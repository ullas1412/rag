import os
from pathlib import Path
from typing import List, Dict, Any

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract plain text from PDF pages."""
    if PdfReader is None:
        raise ImportError("pypdf is not installed. Please install pypdf to process PDF files.")
    reader = PdfReader(str(pdf_path))
    pages_text = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages_text.append(f"--- Page {i + 1} ---\n{text.strip()}")
    return "\n\n".join(pages_text)

def load_document(file_path: Path) -> Dict[str, Any]:
    """Load a single document and return content and metadata."""
    suffix = file_path.suffix.lower()
    text = ""
    doc_type = "unknown"

    if suffix in [".md", ".markdown"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        doc_type = "markdown"
    elif suffix in [".txt"]:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        doc_type = "text"
    elif suffix == ".pdf":
        text = extract_text_from_pdf(file_path)
        doc_type = "pdf"
    else:
        # Default try utf-8 read
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        doc_type = "generic"

    return {
        "filename": file_path.name,
        "filepath": str(file_path),
        "doc_type": doc_type,
        "content": text.strip()
    }

def chunk_text(text: str, chunk_size: int = 600, chunk_overlap: int = 100) -> List[str]:
    """Split text into overlapping chunks using paragraph and sentence boundaries."""
    if not text:
        return []

    # First split into paragraphs
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 <= chunk_size:
            if current_chunk:
                current_chunk += "\n\n" + para
            else:
                current_chunk = para
        else:
            if current_chunk:
                chunks.append(current_chunk)
            # If a single paragraph is larger than chunk_size, split by sentences/lines
            if len(para) > chunk_size:
                lines = para.split("\n")
                sub_chunk = ""
                for line in lines:
                    if len(sub_chunk) + len(line) + 1 <= chunk_size:
                        sub_chunk = (sub_chunk + "\n" + line).strip()
                    else:
                        if sub_chunk:
                            chunks.append(sub_chunk)
                        sub_chunk = line
                if sub_chunk:
                    current_chunk = sub_chunk
                else:
                    current_chunk = ""
            else:
                # Add overlap from previous chunk if possible
                overlap_text = current_chunk[-chunk_overlap:] if len(current_chunk) > chunk_overlap else ""
                current_chunk = (overlap_text + "\n" + para).strip() if overlap_text else para

    if current_chunk:
        chunks.append(current_chunk)

    return chunks

