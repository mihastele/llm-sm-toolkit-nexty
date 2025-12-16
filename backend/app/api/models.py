from fastapi import APIRouter, Query
from typing import Optional, List

router = APIRouter()

MODEL_CATALOG = [
    {
        "id": "llama-3-8b",
        "name": "Llama 3 8B",
        "provider": "Meta",
        "source": "jumpstart",
        "model_id": "meta-textgeneration-llama-3-8b",
        "description": "Meta's latest open LLM, excellent for instruction following and chat applications.",
        "parameter_count": "8B",
        "context_length": 8192,
        "license": "Llama 3 Community License",
        "supported_fine_tune_types": ["full", "lora", "qlora"],
        "recommended_instance": "ml.g5.2xlarge",
        "min_gpu_memory_gb": 24,
        "estimated_cost_per_hour": 1.21,
        "tags": ["chat", "instruction", "general-purpose"],
    },
    {
        "id": "llama-3-70b",
        "name": "Llama 3 70B",
        "provider": "Meta",
        "source": "jumpstart",
        "model_id": "meta-textgeneration-llama-3-70b",
        "description": "Larger Llama 3 variant with superior reasoning and knowledge capabilities.",
        "parameter_count": "70B",
        "context_length": 8192,
        "license": "Llama 3 Community License",
        "supported_fine_tune_types": ["lora", "qlora"],
        "recommended_instance": "ml.p4d.24xlarge",
        "min_gpu_memory_gb": 140,
        "estimated_cost_per_hour": 32.77,
        "tags": ["chat", "instruction", "reasoning", "enterprise"],
    },
    {
        "id": "mistral-7b-v02",
        "name": "Mistral 7B v0.2",
        "provider": "Mistral AI",
        "source": "jumpstart",
        "model_id": "huggingface-llm-mistral-7b-v0-2",
        "description": "Efficient 7B model with sliding window attention for longer context.",
        "parameter_count": "7B",
        "context_length": 32768,
        "license": "Apache 2.0",
        "supported_fine_tune_types": ["full", "lora", "qlora"],
        "recommended_instance": "ml.g5.2xlarge",
        "min_gpu_memory_gb": 16,
        "estimated_cost_per_hour": 1.21,
        "tags": ["chat", "instruction", "long-context", "efficient"],
    },
    {
        "id": "codellama-7b",
        "name": "Code Llama 7B",
        "provider": "Meta",
        "source": "jumpstart",
        "model_id": "meta-textgeneration-llama-codellama-7b",
        "description": "Specialized coding model fine-tuned from Llama 2 for code generation.",
        "parameter_count": "7B",
        "context_length": 16384,
        "license": "Llama 2 Community License",
        "supported_fine_tune_types": ["full", "lora", "qlora"],
        "recommended_instance": "ml.g5.2xlarge",
        "min_gpu_memory_gb": 16,
        "estimated_cost_per_hour": 1.21,
        "tags": ["code", "programming", "technical"],
    },
    {
        "id": "phi-2",
        "name": "Phi-2",
        "provider": "Microsoft",
        "source": "huggingface",
        "model_id": "microsoft/phi-2",
        "description": "Small but powerful 2.7B model with strong reasoning capabilities.",
        "parameter_count": "2.7B",
        "context_length": 2048,
        "license": "MIT",
        "supported_fine_tune_types": ["full", "lora", "qlora"],
        "recommended_instance": "ml.g5.xlarge",
        "min_gpu_memory_gb": 8,
        "estimated_cost_per_hour": 0.84,
        "tags": ["small", "efficient", "reasoning", "educational"],
    },
    {
        "id": "gemma-7b",
        "name": "Gemma 7B",
        "provider": "Google",
        "source": "huggingface",
        "model_id": "google/gemma-7b",
        "description": "Google's 7B open model with strong instruction-following capabilities.",
        "parameter_count": "7B",
        "context_length": 8192,
        "license": "Gemma License",
        "supported_fine_tune_types": ["full", "lora", "qlora"],
        "recommended_instance": "ml.g5.2xlarge",
        "min_gpu_memory_gb": 16,
        "estimated_cost_per_hour": 1.21,
        "tags": ["instruction", "chat", "google"],
    },
]

@router.get("", response_model=dict)
async def list_models(
    source: Optional[str] = Query(None, description="Filter by source"),
    min_context_length: Optional[int] = Query(None, description="Minimum context length"),
    max_cost: Optional[float] = Query(None, description="Maximum cost per hour"),
    fine_tune_type: Optional[str] = Query(None, description="Supported fine-tune type"),
):
    models = MODEL_CATALOG
    
    if source:
        models = [m for m in models if m["source"] == source]
    
    if min_context_length:
        models = [m for m in models if m["context_length"] >= min_context_length]
    
    if max_cost:
        models = [m for m in models if m["estimated_cost_per_hour"] <= max_cost]
    
    if fine_tune_type:
        models = [m for m in models if fine_tune_type in m["supported_fine_tune_types"]]
    
    return {
        "success": True,
        "data": models
    }

@router.get("/{model_id}", response_model=dict)
async def get_model(model_id: str):
    model = next((m for m in MODEL_CATALOG if m["id"] == model_id), None)
    if not model:
        return {
            "success": False,
            "error": "Model not found"
        }
    
    return {
        "success": True,
        "data": model
    }
