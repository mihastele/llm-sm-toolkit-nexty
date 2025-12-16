from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.api.auth import get_current_user

router = APIRouter()

class AssistantMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class AssistantRequest(BaseModel):
    messages: List[AssistantMessage]
    context: Optional[str] = None  # Current page/step context

# Pre-defined responses for common questions
KNOWLEDGE_BASE = {
    "lora": """**LoRA (Low-Rank Adaptation)** is a parameter-efficient fine-tuning technique that:

1. **Freezes** the original model weights
2. **Adds** small trainable matrices to specific layers
3. **Reduces** memory and compute requirements by 10-100x

**LoRA Rank** controls the size of these adapter matrices:
- **Lower rank (8-16)**: Faster training, less memory, may underfit complex tasks
- **Higher rank (32-128)**: Better capacity, slower training, more memory

**Recommendation**: Start with rank 16-32 for most tasks.""",

    "model": """**Choosing the right base model** depends on several factors:

1. **Task complexity**: Simple tasks → smaller models (2-7B), Complex reasoning → larger models (13-70B)
2. **Context length needs**: Short inputs → any model, Long documents → Mistral (32K), Llama 3 (8K)
3. **Budget**: Limited → Phi-2, Gemma 2B; Production → Llama 3 8B, Mistral 7B
4. **License**: Commercial use → Apache 2.0 models (Mistral, Falcon)

**Recommendation**: Start with Mistral 7B or Llama 3 8B for a good balance.""",

    "learning_rate": """**Learning Rate** controls how much weights change during training:

- **Too high**: Model diverges, loss explodes
- **Too low**: Training is slow, may get stuck

**Typical ranges for fine-tuning**:
- Full fine-tune: 1e-5 to 5e-5
- LoRA: 1e-4 to 3e-4
- QLoRA: 2e-4 to 5e-4

**Tips**:
1. Use warmup (10% of steps)
2. Use cosine decay
3. If loss spikes, try 2-3x lower LR""",

    "dataset": """**Best practices for fine-tuning datasets**:

1. **Quality over quantity**: 100-1000 high-quality examples often beat 10K noisy ones
2. **Format consistency**: Use consistent instruction templates
3. **Diversity**: Cover edge cases and variations
4. **Validation split**: Keep 10-20% for evaluation
5. **Token limits**: Most models have 2K-8K context limits

**Common formats**:
```json
{"instruction": "...", "input": "...", "output": "..."}
{"messages": [{"role": "user", "content": "..."}, ...]}
```""",

    "cost": """**Understanding AWS SageMaker costs**:

1. **Instance costs**: Billed per second while running
2. **GPU instances**: ml.g5.xlarge (~$1.00/hr), ml.g5.2xlarge (~$1.21/hr)
3. **Storage**: S3 storage for datasets and model artifacts

**Cost optimization tips**:
- Use spot instances for training (up to 70% savings)
- Start with smaller models for experimentation
- Use QLoRA for memory-efficient training
- Set max training hours to prevent runaway costs""",
}

@router.post("/chat", response_model=dict)
async def chat_with_assistant(
    request: AssistantRequest,
    current_user: dict = Depends(get_current_user)
):
    if not request.messages:
        return {
            "success": True,
            "data": {
                "response": "Hi! I'm your AI assistant for LLM Toolkit. How can I help you today?"
            }
        }
    
    last_message = request.messages[-1].content.lower()
    
    # Find matching topic
    response = "I can help you with that! Here are some topics I can explain:\n\n"
    response += "- **LoRA/QLoRA** fine-tuning techniques\n"
    response += "- **Model selection** guidance\n"
    response += "- **Learning rate** and hyperparameters\n"
    response += "- **Dataset** best practices\n"
    response += "- **Cost** estimation and optimization\n\n"
    response += "What would you like to know more about?"
    
    # Match keywords to knowledge base
    if any(word in last_message for word in ["lora", "rank", "qlora", "peft"]):
        response = KNOWLEDGE_BASE["lora"]
    elif any(word in last_message for word in ["model", "choose", "select", "which"]):
        response = KNOWLEDGE_BASE["model"]
    elif any(word in last_message for word in ["learning", "rate", "lr"]):
        response = KNOWLEDGE_BASE["learning_rate"]
    elif any(word in last_message for word in ["dataset", "data", "format", "upload"]):
        response = KNOWLEDGE_BASE["dataset"]
    elif any(word in last_message for word in ["cost", "price", "expensive", "budget"]):
        response = KNOWLEDGE_BASE["cost"]
    
    return {
        "success": True,
        "data": {
            "response": response
        }
    }

@router.get("/suggestions", response_model=dict)
async def get_suggestions(
    context: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    suggestions = [
        "What does LoRA rank do?",
        "How do I choose the right model?",
        "Explain learning rate",
        "Best practices for datasets",
    ]
    
    # Context-aware suggestions
    if context == "model-selection":
        suggestions = [
            "Which model is best for chat applications?",
            "What's the difference between 7B and 13B models?",
            "Should I use JumpStart or Hugging Face models?",
        ]
    elif context == "training-config":
        suggestions = [
            "What learning rate should I use?",
            "How many epochs do I need?",
            "Should I use gradient checkpointing?",
        ]
    elif context == "dataset-upload":
        suggestions = [
            "What format should my dataset be in?",
            "How many examples do I need?",
            "How do I handle long documents?",
        ]
    
    return {
        "success": True,
        "data": {
            "suggestions": suggestions
        }
    }
