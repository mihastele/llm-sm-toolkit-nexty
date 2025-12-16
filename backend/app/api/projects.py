from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from app.api.auth import get_current_user

router = APIRouter()

# In-memory project store
projects_db = {}

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: str  # "fine-tune" or "deep-research"
    tags: List[str] = []
    aws_region: str = "us-east-1"
    s3_bucket: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str]
    type: str
    tags: List[str]
    aws_region: str
    s3_bucket: str
    created_at: str
    updated_at: str

@router.get("", response_model=dict)
async def list_projects(
    page: int = 1,
    page_size: int = 10,
    current_user: dict = Depends(get_current_user)
):
    user_projects = [
        p for p in projects_db.values() 
        if p["user_id"] == current_user["id"]
    ]
    
    # Sort by created_at descending
    user_projects.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Paginate
    start = (page - 1) * page_size
    end = start + page_size
    paginated = user_projects[start:end]
    
    return {
        "success": True,
        "data": {
            "items": paginated,
            "total": len(user_projects),
            "page": page,
            "page_size": page_size,
            "has_more": end < len(user_projects)
        }
    }

@router.post("", response_model=dict)
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    project_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # Generate S3 bucket name if not provided
    s3_bucket = project.s3_bucket or f"llm-toolkit-{current_user['id'][:8]}-{project_id[:8]}"
    
    project_data = {
        "id": project_id,
        "user_id": current_user["id"],
        "name": project.name,
        "description": project.description,
        "type": project.type,
        "tags": project.tags,
        "aws_region": project.aws_region,
        "s3_bucket": s3_bucket,
        "created_at": now,
        "updated_at": now,
    }
    
    projects_db[project_id] = project_data
    
    return {
        "success": True,
        "data": project_data
    }

@router.get("/{project_id}", response_model=dict)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    project = projects_db.get(project_id)
    if not project or project["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return {
        "success": True,
        "data": project
    }

@router.patch("/{project_id}", response_model=dict)
async def update_project(
    project_id: str,
    updates: dict,
    current_user: dict = Depends(get_current_user)
):
    project = projects_db.get(project_id)
    if not project or project["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    allowed_fields = ["name", "description", "tags"]
    for field in allowed_fields:
        if field in updates:
            project[field] = updates[field]
    
    project["updated_at"] = datetime.utcnow().isoformat()
    projects_db[project_id] = project
    
    return {
        "success": True,
        "data": project
    }

@router.delete("/{project_id}", response_model=dict)
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    project = projects_db.get(project_id)
    if not project or project["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    del projects_db[project_id]
    
    return {"success": True}
