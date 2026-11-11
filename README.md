# CampusMate: AI-Powered Domain-Specific Conversational Chatbot for GEC Hassan

**CampusMate** is an institutional Retrieval-Augmented Generation (RAG) conversational system designed for **Government Engineering College, Hassan (GEC Hassan)** (Affiliated to VTU Belagavi, AICTE Approved).

Unlike generic AI assistants, CampusMate grounds all answers directly in verified, approved college documents (handbooks, VTU academic regulations, syllabus, scholarship notifications, fee structures, and placement records) to prevent hallucinations and provide accurate, actionable student support.

---

## 🌟 Key Features

1. **Grounded Student Chat Interface**:
   - Modern, responsive web interface tailored for GEC Hassan students.
   - Quick inquiry prompt chips (Attendance, SSP scholarships, VTU CIE/SEE passing marks, placements, hostel facilities, college codes).
   - Expandable source citation cards showing the exact source document, chunk index, and relevance confidence score.
   - Guardrails & Fallback: Automatically detects queries outside college jurisdiction and directs students to authorized college officials.

2. **Domain-Specific Institutional Knowledge Base**:
   - `01_college_overview.md`: Vision, mission, history, AICTE approval, VTU code (4HN), KCET code (E146).
   - `02_departments_and_programs.md`: CSE, ECE, ME, CV, AI&DS intake, laboratories, student forums.
   - `03_academic_rules_vtu.md`: VTU CBSS/NEP guidelines, 85% attendance rule (75% with medical condonation), CIE/SEE passing criteria, SGPA/CGPA formulas.
   - `04_fees_and_scholarships.md`: Govt. fee structure, SNQ quota, SSP Karnataka portal, NSP, Vidyasiri.
   - `05_examinations_and_evaluation.md`: VTU exam registration, hall tickets, revaluation, photocopy of answer scripts.
   - `06_placements_and_internships.md`: Training & Placement Cell (TPC), recruiters (Infosys, TCS, Wipro, Bosch, etc.), eligibility criteria, mandatory VTU internships.
   - `07_campus_facilities_hostels.md`: Central library, VTU consortium e-journals, boys' and girls' hostels, sports, transportation.
   - `08_administration_and_contacts.md`: Principal, HODs, SWO, Anti-ragging helpline, contact details.

3. **Hybrid RAG Retrieval Engine**:
   - **Vector Database**: ChromaDB (Persistent local storage).
   - **Embedding Model**: `all-MiniLM-L6-v2` ONNX local transformer (100% offline, free, deterministic, no external API keys required).
   - **Hybrid Search**: Combines Dense Vector Semantics with Reciprocal Rank Fusion (RRF) and exact institutional token matching.
   - **LLM Agnostic**: High-precision local grounded synthesizer included out-of-the-box, with plug-and-play support for Gemini API or OpenAI GPT-4o if an API key is provided.

4. **Administrative Knowledge Base Portal**:
   - Upload new institutional documents (`.pdf`, `.md`, `.txt`).
   - One-click vector store re-indexing.
   - Live system statistics (Total documents, vector chunks, embedding status).

---

## 🚀 How to Run CampusMate

### 1. Start the Server
Open your terminal in `C:\Users\user\OneDrive\Desktop\rag` and run:

```powershell
python main.py
```

### 2. Access the Application
- **Student Web Chat**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Admin & Knowledge Base Tab**: Click the "Knowledge Base (Admin)" tab at the top of the interface.

---

## 🧪 Testing the System

You can run the automated validation test suite:

```powershell
python test_system.py
```

This verifies:
1. Academic queries (e.g. 85% attendance rule) -> Grounded with `03_academic_rules_vtu.md`.
2. Scholarship queries (e.g. SSP portal) -> Grounded with `04_fees_and_scholarships.md`.
3. Placement queries (e.g. TCS, Infosys, Wipro) -> Grounded with `06_placements_and_internships.md`.
4. Out-of-domain queries (e.g. recipes, non-college topics) -> Safely rejected with institutional fallback message.

