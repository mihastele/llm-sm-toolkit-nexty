from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

from app.api.auth import get_current_user

router = APIRouter()

# In-memory store
datasets_db = {}

class DatasetResponse(BaseModel):
    id: str
    project_id: str
    name: str
    file_name: str
    s3_uri: str
    format: str
    row_count: int
    column_mapping: dict
    validation_status: str
    validation_errors: List[str]
    estimated_tokens: int
    created_at: str

@router.get("", response_model=dict)
async def list_datasets(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    project_datasets = [
        d for d in datasets_db.values()
        if d["project_id"] == project_id
    ]
    return {
        "success": True,
        "data": project_datasets
    }

@router.post("/upload", response_model=dict)
async def upload_dataset(
    project_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    dataset_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    # Determine format
    file_format = "jsonl" if file.filename.endswith(".jsonl") else "csv"
    
    # Mock validation
    dataset_data = {
        "id": dataset_id,
        "project_id": project_id,
        "name": file.filename.rsplit(".", 1)[0],
        "file_name": file.filename,
        "s3_uri": f"s3://llm-toolkit-datasets/{project_id}/{dataset_id}/{file.filename}",
        "format": file_format,
        "row_count": 2547,  # Mock
        "column_mapping": {},
        "validation_status": "valid",
        "validation_errors": [],
        "estimated_tokens": 1250000,  # Mock
        "created_at": now,
    }
    
    datasets_db[dataset_id] = dataset_data
    
    return {
        "success": True,
        "data": dataset_data
    }

@router.get("/{dataset_id}", response_model=dict)
async def get_dataset(
    project_id: str,
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    dataset = datasets_db.get(dataset_id)
    if not dataset or dataset["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    return {
        "success": True,
        "data": dataset
    }

@router.post("/{dataset_id}/validate", response_model=dict)
async def validate_dataset(
    project_id: str,
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    dataset = datasets_db.get(dataset_id)
    if not dataset or dataset["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Mock validation result
    return {
        "success": True,
        "data": {
            "is_valid": True,
            "total_rows": dataset["row_count"],
            "estimated_tokens": dataset["estimated_tokens"],
            "errors": [],
            "warnings": [
                "15 rows exceed 2048 tokens and will be truncated"
            ],
            "detected_columns": ["instruction", "input", "output"]
        }
    }

@router.patch("/{dataset_id}/mapping", response_model=dict)
async def update_column_mapping(
    project_id: str,
    dataset_id: str,
    mapping: dict,
    current_user: dict = Depends(get_current_user)
):
    dataset = datasets_db.get(dataset_id)
    if not dataset or dataset["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    dataset["column_mapping"] = mapping
    datasets_db[dataset_id] = dataset
    
    return {
        "success": True,
        "data": dataset
    }

@router.delete("/{dataset_id}", response_model=dict)
async def delete_dataset(
    project_id: str,
    dataset_id: str,
    current_user: dict = Depends(get_current_user)
):
    dataset = datasets_db.get(dataset_id)
    if not dataset or dataset["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    del datasets_db[dataset_id]
    
    return {"success": True}
