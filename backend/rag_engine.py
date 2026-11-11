import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.utils import embedding_functions

from backend.config import (
    DOCUMENTS_DIR,
    CHROMA_PERSIST_DIR,
    COLLECTION_NAME,
    DEFAULT_TOP_K,
    SIMILARITY_THRESHOLD,
    COLLEGE_NAME,
    SYSTEM_NAME
)
from backend.document_loader import load_document, chunk_text

STOP_WORDS = {
    "what", "which", "where", "when", "who", "whom", "how", "why", "does", "did",
    "the", "and", "for", "with", "about", "are", "were", "been", "have", "has",
    "can", "could", "will", "would", "should", "from", "into", "onto", "that",
    "this", "these", "those", "gec", "hassan", "college", "engineering", "student",
    "students", "details", "information", "tell", "give", "know", "please", "campus",
    "institution", "gech"
}

class CampusMateRAG:
    def __init__(self):
        self.chroma_client = chromadb.PersistentClient(path=str(CHROMA_PERSIST_DIR))
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=self.embedding_fn,
            metadata={"description": "GEC Hassan Approved Institutional Knowledge Base"}
        )
        
        # If collection is empty, automatically index documents
        if self.collection.count() == 0:
            print("[CampusMate] Knowledge base is empty. Performing initial document indexing...")
            self.index_all_documents()

    def index_all_documents(self) -> Dict[str, Any]:
        """Index or re-index all documents in the documents directory."""
        try:
            self.chroma_client.delete_collection(COLLECTION_NAME)
        except Exception:
            pass

        self.collection = self.chroma_client.create_collection(
            name=COLLECTION_NAME,
            embedding_function=self.embedding_fn,
            metadata={"description": "GEC Hassan Approved Institutional Knowledge Base"}
        )

        all_files = list(DOCUMENTS_DIR.glob("*.*"))
        valid_files = [f for f in all_files if f.suffix.lower() in [".md", ".txt", ".pdf"]]

        total_chunks = 0
        indexed_files = []

        for file_path in valid_files:
            try:
                doc = load_document(file_path)
                chunks = chunk_text(doc["content"], chunk_size=650, chunk_overlap=120)
                if not chunks:
                    continue

                ids = [f"{file_path.stem}_chunk_{i}" for i in range(len(chunks))]
                metadatas = [
                    {
                        "source": file_path.name,
                        "file_stem": file_path.stem,
                        "doc_type": doc["doc_type"],
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }
                    for i in range(len(chunks))
                ]

                self.collection.add(
                    ids=ids,
                    documents=chunks,
                    metadatas=metadatas
                )
                total_chunks += len(chunks)
                indexed_files.append({"filename": file_path.name, "chunks": len(chunks)})
            except Exception as e:
                print(f"[Error indexing {file_path.name}]: {e}")

        return {
            "status": "success",
            "indexed_files": indexed_files,
            "total_files": len(indexed_files),
            "total_chunks": total_chunks
        }

    def query(self, question: str, top_k: int = DEFAULT_TOP_K) -> Dict[str, Any]:
        """Retrieve relevant context and generate grounded response."""
        question_clean = question.strip()
        if not question_clean:
            return {
                "answer": "Please ask a question about GEC Hassan academics, admissions, fees, exams, or facilities.",
                "sources": [],
                "confidence": 0.0,
                "grounded": False
            }

        # Extract focused keywords (excluding generic question words and omnipresent college terms)
        all_words = re.findall(r'\b[a-zA-Z0-9]{3,}\b', question_clean.lower())
        keywords_list = [w for w in all_words if w not in STOP_WORDS]
        keywords = " ".join(keywords_list)
        query_variants = [question_clean]
        if keywords and keywords != question_clean.lower():
            query_variants.append(keywords)

        # Multi-query retrieval with broader candidate pool
        candidate_k = max(8, top_k * 2)
        raw_results = self.collection.query(
            query_texts=query_variants,
            n_results=candidate_k,
            include=["documents", "metadatas", "distances"]
        )

        # Reciprocal Rank Fusion (RRF) with exact keyword matching boost
        merged_chunks = {}
        for query_idx in range(len(query_variants)):
            docs = raw_results["documents"][query_idx] if raw_results["documents"] else []
            metas = raw_results["metadatas"][query_idx] if raw_results["metadatas"] else []
            dists = raw_results["distances"][query_idx] if raw_results["distances"] else []

            for rank, (doc_text, meta, dist) in enumerate(zip(docs, metas, dists)):
                cid = f"{meta.get('source', '')}_{meta.get('chunk_index', 0)}"
                similarity = max(0.0, min(1.0, 1.0 - (dist / 1.6)))
                
                # Reciprocal Rank Fusion component
                rrf_score = 1.0 / (60.0 + rank)
                
                # Keyword match component
                text_lower = doc_text.lower()
                kw_hits = sum(1 for tok in keywords_list if tok in text_lower) if keywords_list else 0

                # Total hybrid score
                combined_score = rrf_score + (kw_hits * 0.04)

                if cid not in merged_chunks:
                    merged_chunks[cid] = {
                        "text": doc_text,
                        "meta": meta,
                        "similarity": similarity,
                        "score": combined_score,
                        "kw_hits": kw_hits
                    }
                else:
                    # Accumulate RRF rank support
                    merged_chunks[cid]["score"] += combined_score
                    merged_chunks[cid]["similarity"] = max(merged_chunks[cid]["similarity"], similarity)

        sorted_chunks = sorted(merged_chunks.values(), key=lambda x: x["score"], reverse=True)

        if not sorted_chunks:
            return {
                "answer": "No relevant records found in the GEC Hassan knowledge base. Please check with the college administration or office for clarification.",
                "sources": [],
                "confidence": 0.0,
                "grounded": False
            }

        sources = []
        best_similarity = 0.0

        for i, item in enumerate(sorted_chunks[:top_k]):
            if i == 0:
                best_similarity = item["similarity"]

            sources.append({
                "source": item["meta"].get("source", "Official Document"),
                "chunk_index": item["meta"].get("chunk_index", 0),
                "text": item["text"],
                "similarity": round(item["similarity"] * 100, 1)
            })

        # Check threshold
        if best_similarity < SIMILARITY_THRESHOLD:
            return {
                "answer": (
                    "I could not locate verified official information regarding your query in the current GEC Hassan "
                    "institutional repository. To avoid providing incorrect information, please consult the "
                    "Principal's Office, Student Welfare Officer, or your respective Department HOD."
                ),
                "sources": [s for s in sources if s["similarity"] > 15.0][:2],
                "confidence": round(best_similarity * 100, 1),
                "grounded": False
            }

        # Generate answer using grounded context
        answer = self._generate_grounded_answer(question_clean, sources)

        return {
            "answer": answer,
            "sources": sources,
            "confidence": round(best_similarity * 100, 1),
            "grounded": True
        }

    def _generate_grounded_answer(self, question: str, sources: List[Dict[str, Any]]) -> str:
        """Ground answer in retrieved passages with institutional citations."""
        openai_key = os.getenv("OPENAI_API_KEY")
        gemini_key = os.getenv("GEMINI_API_KEY")

        context_blocks = "\n\n".join([
            f"--- Source: {s['source']} (Relevance: {s['similarity']}%) ---\n{s['text']}"
            for s in sources[:3]
        ])

        if gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=gemini_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"You are CampusMate, the official AI student assistant for Government Engineering College Hassan (GEC Hassan), "
                    f"affiliated to VTU Belagavi. Answer the student's question accurately using ONLY the official context provided below. "
                    f"If the answer is not in the context, politely state that it is not documented in official records. "
                    f"Cite relevant rules, percentages, codes, or contact points.\n\n"
                    f"Context:\n{context_blocks}\n\n"
                    f"Student Question: {question}\n\n"
                    f"Answer:"
                )
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[Gemini API fallback to local synthesiser]: {e}")

        elif openai_key:
            try:
                import openai
                client = openai.OpenAI(api_key=openai_key)
                prompt = (
                    f"You are CampusMate, the official AI student assistant for Government Engineering College Hassan (GEC Hassan). "
                    f"Answer the question using ONLY the provided verified context. Be concise, structured, and helpful.\n\n"
                    f"Context:\n{context_blocks}\n\n"
                    f"Student Question: {question}"
                )
                res = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a domain-specific educational assistant for GEC Hassan."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2
                )
                if res.choices:
                    return res.choices[0].message.content.strip()
            except Exception as e:
                print(f"[OpenAI API fallback to local synthesiser]: {e}")

        # High-precision Local Grounded Synthesizer
        return self._synthesize_local_response(question, sources)

    def _synthesize_local_response(self, question: str, sources: List[Dict[str, Any]]) -> str:
        """High quality deterministic synthesis grounded strictly on retrieved chunks."""
        # Find informative question tokens (excluding generic stopwords and ubiquitous college terms)
        all_words = re.findall(r'\b[a-zA-Z0-9]{3,}\b', question.lower())
        q_tokens = [w for w in all_words if w not in STOP_WORDS]

        # Prioritize chunks that actually contain the distinctive question tokens
        ranked_chunks = []
        for s in sources:
            text_lower = s["text"].lower()
            token_hits = sum(1 for tok in q_tokens if tok in text_lower)
            # Combined score: token matches + vector similarity
            combined_rank = (token_hits * 2.0) + (s["similarity"] / 50.0)
            ranked_chunks.append((combined_rank, token_hits, s))

        ranked_chunks.sort(key=lambda x: x[0], reverse=True)
        best_source = ranked_chunks[0][2] if ranked_chunks else sources[0]
        source_title = best_source["source"].replace(".md", "").replace("_", " ").title()

        # Extract sentences from the best matching chunks
        extracted_lines = []
        seen = set()

        # Inspect candidate chunks in order of token relevance
        candidate_sources = [r[2] for r in ranked_chunks[:2]]
        for src in candidate_sources:
            raw_lines = src["text"].split("\n")
            for line in raw_lines:
                clean_l = line.strip()
                if not clean_l or len(clean_l) < 15:
                    continue
                # Remove Markdown heading markers
                clean_l = re.sub(r'^#+\s*', '', clean_l)
                line_lower = clean_l.lower()

                # Check if line matches question tokens
                matches = sum(1 for tok in q_tokens if tok in line_lower)
                if matches > 0 and line_lower not in seen:
                    seen.add(line_lower)
                    # format nicely as bullet
                    if not clean_l.startswith(("-", "*", "•")):
                        clean_l = f"- {clean_l}"
                    extracted_lines.append(clean_l)

        # Build final response text
        response_parts = [
            f"Based on official GEC Hassan documentation ({source_title}):\n"
        ]

        if extracted_lines:
            for l in extracted_lines[:6]:
                response_parts.append(l)
        else:
            # Fallback to key paragraphs of the primary chunk
            paras = [p.strip() for p in best_source["text"].split("\n\n") if p.strip()]
            for p in paras[:2]:
                response_parts.append(re.sub(r'^#+\s*', '', p))

        response_parts.append(
            f"\n> **Institutional Source**: `{best_source['source']}` (Confidence: {best_source['similarity']}%)"
        )

        return "\n".join(response_parts)

    def get_stats(self) -> Dict[str, Any]:
        """Return system statistics for admin monitoring."""
        count = self.collection.count()
        files = list(DOCUMENTS_DIR.glob("*.*"))
        valid_files = [f.name for f in files if f.suffix.lower() in [".md", ".txt", ".pdf"]]
        return {
            "college": COLLEGE_NAME,
            "system": SYSTEM_NAME,
            "total_documents": len(valid_files),
            "documents_list": valid_files,
            "total_vector_chunks": count,
            "embedding_model": "all-MiniLM-L6-v2 (ONNX Local)",
            "vector_store": "ChromaDB (Persistent)"
        }
