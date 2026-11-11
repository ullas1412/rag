import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DOCUMENTS_DIR = BASE_DIR / "backend" / "data" / "documents"
CHROMA_PERSIST_DIR = BASE_DIR / "backend" / "data" / "chroma_db"
STATIC_DIR = BASE_DIR / "static"

# Ensure directories exist
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_PERSIST_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# Vector store settings
COLLECTION_NAME = "gec_hassan_knowledge_base"
DEFAULT_TOP_K = 4
SIMILARITY_THRESHOLD = 0.35  # Threshold below which queries are deemed out of institutional scope

# App Info
COLLEGE_NAME = "Government Engineering College Hassan (GEC Hassan)"
SYSTEM_NAME = "CampusMate - AI Student Assistant"
COLLEGE_CODE = "VTU: 4HN | KCET: E146"

