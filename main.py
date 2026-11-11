import os
import shutil
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from backend.config import (
    DOCUMENTS_DIR,
    STATIC_DIR,
    COLLEGE_NAME,
    SYSTEM_NAME,
    COLLEGE_CODE
)
from backend.rag_engine import CampusMateRAG

# Initialize FastAPI application
app = FastAPI(
    title=f"{SYSTEM_NAME} - {COLLEGE_NAME}",
    description="Domain-specific RAG chatbot grounded in official institutional documents for GEC Hassan",
    version="1.0.0"
)

# Initialize RAG Engine
rag_engine = CampusMateRAG()

# Mount static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4

@app.get("/")
def read_root():
    """Serve the main student conversational interface."""
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "CampusMate backend is running. static/index.html not found.", "status": "ok"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "system": SYSTEM_NAME,
        "college": COLLEGE_NAME,
        "code": COLLEGE_CODE
    }

@app.post("/api/chat")
def chat(request: QueryRequest):
    """Process student query against grounded GEC Hassan knowledge base."""
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    response = rag_engine.query(question=request.query, top_k=request.top_k or 4)
    return response

@app.get("/api/admin/stats")
def get_stats():
    """Get system and knowledge base statistics."""
    return rag_engine.get_stats()

@app.get("/api/documents")
def list_documents():
    """List all documents currently in the knowledge base."""
    files = []
    for f in DOCUMENTS_DIR.glob("*.*"):
        if f.suffix.lower() in [".md", ".txt", ".pdf"]:
            size_kb = round(f.stat().st_size / 1024, 2)
            files.append({
                "name": f.name,
                "type": f.suffix.replace(".", "").upper(),
                "size_kb": size_kb,
                "modified": f.stat().st_mtime
            })
    return {"documents": sorted(files, key=lambda x: x["name"])}

@app.post("/api/admin/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload an official college document (PDF, Markdown, or Text) and re-index."""
    ext = Path(file.filename).suffix.lower()
    if ext not in [".md", ".txt", ".pdf"]:
        raise HTTPException(status_code=400, detail="Only .pdf, .md, and .txt files are supported.")

    destination = DOCUMENTS_DIR / file.filename
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Re-index collection with the new document
    index_result = rag_engine.index_all_documents()

    return {
        "status": "success",
        "message": f"File '{file.filename}' uploaded and knowledge base updated successfully.",
        "indexing_details": index_result
    }

@app.post("/api/admin/rebuild-index")
def rebuild_index():
    """Trigger full re-indexing of the knowledge base."""
    result = rag_engine.index_all_documents()
    return result

@app.get("/api/sample-queries")
def get_sample_queries():
    """Provide suggested student questions categorized by institutional domain."""
    return {
        "categories": [
            {
                "category": "Academic Rules & VTU",
                "questions": [
                    "What is the minimum attendance requirement at GEC Hassan?",
                    "What are the passing criteria for CIE and SEE under VTU rules?",
                    "What is the vertical progression/promotion policy?"
                ]
            },
            {
                "category": "Admissions, Fees & Scholarships",
                "questions": [
                    "What scholarships are available and how do I apply for SSP?",
                    "What is the annual fee structure for government quota at GEC Hassan?",
                    "What is the fee waiver under SNQ quota?"
                ]
            },
            {
                "category": "Departments & Placements",
                "questions": [
                    "What branches and laboratories are available at GEC Hassan?",
                    "Which companies visit GEC Hassan for campus placements?",
                    "What is the mandatory VTU internship policy?"
                ]
            },
            {
                "category": "Campus, Facilities & Contacts",
                "questions": [
                    "What facilities are available in the hostel and central library?",
                    "Where is GEC Hassan located and what are the college codes?",
                    "Who are the key administrative contacts and anti-ragging squad?"
                ]
            }
        ]
    }

import os
from urllib.parse import quote_plus

import requests
from fastapi import FastAPI, Query


@app.get("/api/directions")
def google_maps_directions(
    origin: str = Query("", description="Starting point (address or 'lat,lng'). Empty = user location prompt."),
    destination: str = Query("Government Engineering College Hassan, B.M. Road, Hassan, Karnataka, India", description="Destination"),
    mode: str = Query("driving", description="driving|walking|bicycling|transit"),
):
    """Build a Google Maps directions URL (and fetch live route data if GOOGLE_MAPS_API_KEY is set)."""
    maps_url = (
        "https://www.google.com/maps/dir/?api=1"
        f"&origin={quote_plus(origin) if origin else ''}"
        f"&destination={quote_plus(destination)}"
        f"&travelmode={quote_plus(mode)}"
    )
    if not origin:
        maps_url = maps_url.replace("&origin=", "")

    result = {
        "maps_url": maps_url,
        "origin": origin or "Your location",
        "destination": destination,
        "mode": mode,
    }

    api_key = os.getenv("GOOGLE_MAPS_API_KEY", "")
    if api_key and origin:
        try:
            resp = requests.get(
                "https://maps.googleapis.com/maps/api/directions/json",
                params={"origin": origin, "destination": destination, "mode": mode, "key": api_key},
                timeout=15,
            )
            data = resp.json()
            result["api_status"] = data.get("status")
            if data.get("routes"):
                route = data["routes"][0]
                leg = route["legs"][0]
                result["summary"] = route.get("summary")
                result["distance"] = leg["distance"]["text"]
                result["duration"] = leg["duration"]["text"]
                result["start_address"] = leg["start_address"]
                result["end_address"] = leg["end_address"]
            else:
                result["api_error"] = data.get("error_message", data.get("status"))
        except Exception as exc:  # noqa: BLE001
            result["api_error"] = str(exc)
    else:
        result["note"] = (
            "Set GOOGLE_MAPS_API_KEY to also fetch live route distance/duration. "
            "The maps_url works without any key."
        )

    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
