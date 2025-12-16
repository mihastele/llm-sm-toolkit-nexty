from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from app.api.auth import get_current_user

router = APIRouter()

# In-memory store
research_sessions_db = {}

class ResearchSessionCreate(BaseModel):
    question: str
    depth: str = "quick"  # "quick" or "in-depth"
    output_format: str = "bullets"  # "bullets", "report", "faq", "pros-cons"
    include_domains: List[str] = []
    exclude_domains: List[str] = []

class ResearchSource(BaseModel):
    url: str
    title: str
    snippet: str
    relevance_score: float

class ResearchStep(BaseModel):
    id: str
    type: str
    status: str
    query: Optional[str] = None
    sources: List[dict] = []
    synthesis: Optional[str] = None
    started_at: str
    completed_at: Optional[str] = None

@router.get("", response_model=dict)
async def list_research_sessions(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    sessions = [
        s for s in research_sessions_db.values()
        if s["project_id"] == project_id
    ]
    sessions.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "success": True,
        "data": sessions
    }

@router.post("", response_model=dict)
async def create_research_session(
    project_id: str,
    session: ResearchSessionCreate,
    current_user: dict = Depends(get_current_user)
):
    session_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    session_data = {
        "id": session_id,
        "project_id": project_id,
        "question": session.question,
        "status": "running",
        "depth": session.depth,
        "output_format": session.output_format,
        "include_domains": session.include_domains,
        "exclude_domains": session.exclude_domains,
        "steps": [
            {
                "id": str(uuid.uuid4()),
                "type": "search",
                "status": "running",
                "query": session.question,
                "sources": [],
                "synthesis": None,
                "started_at": now,
                "completed_at": None,
            }
        ],
        "final_report": None,
        "sources": [],
        "created_at": now,
        "completed_at": None,
    }
    
    research_sessions_db[session_id] = session_data
    
    return {
        "success": True,
        "data": session_data
    }

@router.get("/{session_id}", response_model=dict)
async def get_research_session(
    project_id: str,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    session = research_sessions_db.get(session_id)
    if not session or session["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research session not found"
        )
    return {
        "success": True,
        "data": session
    }

@router.get("/{session_id}/stream")
async def stream_research_updates(
    project_id: str,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    # In production, this would be a WebSocket or SSE endpoint
    session = research_sessions_db.get(session_id)
    if not session or session["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research session not found"
        )
    
    return {
        "success": True,
        "data": {
            "message": "Use WebSocket connection for real-time updates",
            "session": session
        }
    }

@router.post("/{session_id}/stop", response_model=dict)
async def stop_research_session(
    project_id: str,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    session = research_sessions_db.get(session_id)
    if not session or session["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research session not found"
        )
    
    session["status"] = "stopped"
    research_sessions_db[session_id] = session
    
    return {
        "success": True,
        "data": session
    }

@router.delete("/{session_id}", response_model=dict)
async def delete_research_session(
    project_id: str,
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    session = research_sessions_db.get(session_id)
    if not session or session["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research session not found"
        )
    
    del research_sessions_db[session_id]
    
    return {"success": True}
