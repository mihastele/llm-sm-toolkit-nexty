from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from app.api.auth import get_current_user

router = APIRouter()

# In-memory store
endpoints_db = {}

class EndpointCreate(BaseModel):
    training_run_id: str
    name: str
    instance_type: str = "ml.g5.xlarge"
    instance_count: int = 1
    auto_scaling: bool = False

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    max_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9

@router.get("", response_model=dict)
async def list_endpoints(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    project_endpoints = [
        e for e in endpoints_db.values()
        if e["project_id"] == project_id
    ]
    return {
        "success": True,
        "data": project_endpoints
    }

@router.post("", response_model=dict)
async def create_endpoint(
    project_id: str,
    endpoint: EndpointCreate,
    current_user: dict = Depends(get_current_user)
):
    endpoint_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    endpoint_data = {
        "id": endpoint_id,
        "project_id": project_id,
        "training_run_id": endpoint.training_run_id,
        "name": endpoint.name,
        "sagemaker_endpoint_name": f"llm-toolkit-{endpoint_id[:8]}",
        "status": "creating",
        "instance_type": endpoint.instance_type,
        "instance_count": endpoint.instance_count,
        "auto_scaling": endpoint.auto_scaling,
        "endpoint_url": None,
        "created_at": now,
        "updated_at": now,
    }
    
    endpoints_db[endpoint_id] = endpoint_data
    
    return {
        "success": True,
        "data": endpoint_data
    }

@router.get("/{endpoint_id}", response_model=dict)
async def get_endpoint(
    project_id: str,
    endpoint_id: str,
    current_user: dict = Depends(get_current_user)
):
    endpoint = endpoints_db.get(endpoint_id)
    if not endpoint or endpoint["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Endpoint not found"
        )
    return {
        "success": True,
        "data": endpoint
    }

@router.post("/{endpoint_id}/invoke", response_model=dict)
async def invoke_endpoint(
    project_id: str,
    endpoint_id: str,
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    endpoint = endpoints_db.get(endpoint_id)
    if not endpoint or endpoint["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Endpoint not found"
        )
    
    if endpoint["status"] != "inservice":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Endpoint is not in service"
        )
    
    # Mock response
    last_message = request.messages[-1].content if request.messages else ""
    
    return {
        "success": True,
        "data": {
            "response": f"This is a mock response to: {last_message[:50]}...",
            "usage": {
                "prompt_tokens": 50,
                "completion_tokens": 100,
                "total_tokens": 150,
            }
        }
    }

@router.delete("/{endpoint_id}", response_model=dict)
async def delete_endpoint(
    project_id: str,
    endpoint_id: str,
    current_user: dict = Depends(get_current_user)
):
    endpoint = endpoints_db.get(endpoint_id)
    if not endpoint or endpoint["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Endpoint not found"
        )
    
    del endpoints_db[endpoint_id]
    
    return {"success": True}
