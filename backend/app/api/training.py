from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

from app.api.auth import get_current_user

router = APIRouter()

# In-memory store
training_runs_db = {}

class TrainingConfig(BaseModel):
    epochs: int = 3
    learning_rate: float = 0.0001
    batch_size: int = 4
    warmup_ratio: float = 0.1
    gradient_checkpointing: bool = True
    packing: bool = False
    fine_tune_type: str = "lora"
    lora_rank: Optional[int] = 16
    lora_alpha: Optional[int] = 32
    quantization_bits: Optional[int] = None

class TrainingRunCreate(BaseModel):
    model_id: str
    dataset_id: str
    config: TrainingConfig
    instance_type: str = "ml.g5.2xlarge"

class TrainingRunResponse(BaseModel):
    id: str
    project_id: str
    model_id: str
    dataset_id: str
    sagemaker_job_name: str
    status: str
    config: Dict[str, Any]
    metrics: Dict[str, Any]
    artifacts: Dict[str, str]
    started_at: str
    completed_at: Optional[str]
    estimated_cost: float

@router.get("", response_model=dict)
async def list_training_runs(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    project_runs = [
        r for r in training_runs_db.values()
        if r["project_id"] == project_id
    ]
    project_runs.sort(key=lambda x: x["started_at"], reverse=True)
    
    return {
        "success": True,
        "data": project_runs
    }

@router.post("", response_model=dict)
async def start_training(
    project_id: str,
    run: TrainingRunCreate,
    current_user: dict = Depends(get_current_user)
):
    run_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    job_name = f"llm-toolkit-{run_id[:8]}"
    
    run_data = {
        "id": run_id,
        "project_id": project_id,
        "model_id": run.model_id,
        "dataset_id": run.dataset_id,
        "sagemaker_job_name": job_name,
        "status": "starting",
        "config": run.config.model_dump(),
        "metrics": {
            "current_epoch": 0,
            "total_epochs": run.config.epochs,
            "current_step": 0,
            "total_steps": 0,
            "train_loss": None,
            "eval_loss": None,
            "learning_rate": run.config.learning_rate,
        },
        "artifacts": {
            "model_artifacts_s3": f"s3://llm-toolkit-artifacts/{project_id}/{run_id}/model",
            "logs_s3": f"s3://llm-toolkit-artifacts/{project_id}/{run_id}/logs",
            "checkpoints_s3": f"s3://llm-toolkit-artifacts/{project_id}/{run_id}/checkpoints",
        },
        "started_at": now,
        "completed_at": None,
        "estimated_cost": 15.50,  # Mock
    }
    
    training_runs_db[run_id] = run_data
    
    return {
        "success": True,
        "data": run_data
    }

@router.get("/{run_id}", response_model=dict)
async def get_training_run(
    project_id: str,
    run_id: str,
    current_user: dict = Depends(get_current_user)
):
    run = training_runs_db.get(run_id)
    if not run or run["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training run not found"
        )
    return {
        "success": True,
        "data": run
    }

@router.get("/{run_id}/logs", response_model=dict)
async def get_training_logs(
    project_id: str,
    run_id: str,
    current_user: dict = Depends(get_current_user)
):
    run = training_runs_db.get(run_id)
    if not run or run["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training run not found"
        )
    
    # Mock logs
    return {
        "success": True,
        "data": {
            "logs": [
                {"timestamp": "2024-01-15T10:00:00Z", "message": "Starting training job..."},
                {"timestamp": "2024-01-15T10:00:05Z", "message": "Loading model weights..."},
                {"timestamp": "2024-01-15T10:01:00Z", "message": "Training started. Epoch 1/3"},
            ]
        }
    }

@router.get("/{run_id}/metrics", response_model=dict)
async def get_training_metrics(
    project_id: str,
    run_id: str,
    current_user: dict = Depends(get_current_user)
):
    run = training_runs_db.get(run_id)
    if not run or run["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training run not found"
        )
    
    # Mock metrics history
    return {
        "success": True,
        "data": {
            "loss_history": [
                {"step": 100, "train_loss": 2.5, "eval_loss": 2.6},
                {"step": 200, "train_loss": 1.8, "eval_loss": 1.9},
                {"step": 300, "train_loss": 1.2, "eval_loss": 1.4},
            ]
        }
    }

@router.post("/{run_id}/stop", response_model=dict)
async def stop_training(
    project_id: str,
    run_id: str,
    current_user: dict = Depends(get_current_user)
):
    run = training_runs_db.get(run_id)
    if not run or run["project_id"] != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training run not found"
        )
    
    run["status"] = "stopping"
    training_runs_db[run_id] = run
    
    return {
        "success": True,
        "data": run
    }
