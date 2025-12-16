# LLM Toolkit

A comprehensive web application for fine-tuning and deploying LLMs on AWS SageMaker, with a built-in deep research agent.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

### 🎯 Guided LLM Fine-Tuning
- **Model Catalog**: Browse curated models from Meta, Mistral, Google, and more
- **Dataset Upload**: Support for JSONL and CSV formats with validation
- **Training Configuration**: Simple presets or advanced hyperparameter control
- **Real-Time Monitoring**: Track loss curves, costs, and training progress
- **PEFT Support**: LoRA and QLoRA for efficient fine-tuning

### 🚀 One-Click Deployment
- Deploy fine-tuned models to SageMaker endpoints
- Built-in chat playground for testing
- Auto-scaling configuration options

### 🔍 Deep Research Agent
- Multi-step web research and synthesis
- Multiple output formats (bullets, reports, FAQ, pros/cons)
- Source tracking and citation

### 🤖 AI Assistant
- Context-aware help throughout the UI
- Explains concepts and suggests optimal settings

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI + Shadcn UI
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)

### Backend
- **Framework**: FastAPI (Python)
- **Authentication**: JWT with passlib
- **Cloud**: AWS (SageMaker, S3, CloudWatch)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- AWS Account with SageMaker access

### Frontend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Project Structure

```
llm-toolkit/
├── src/                          # Frontend source
│   ├── app/                      # Next.js app router pages
│   │   ├── dashboard/           # Dashboard page
│   │   ├── fine-tune/           # Fine-tuning wizard
│   │   ├── deployments/         # Deployment management
│   │   └── research/            # Deep research UI
│   ├── components/               # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── layout/              # Layout components
│   │   ├── fine-tune/           # Fine-tune wizard components
│   │   └── assistant/           # AI assistant
│   ├── lib/                      # Utilities and configuration
│   │   ├── api.ts               # API client
│   │   ├── store.ts             # Zustand stores
│   │   └── model-catalog.ts     # Model definitions
│   └── types/                    # TypeScript types
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/                 # API routes
│   │   ├── core/                # Core config
│   │   └── main.py              # App entry point
│   └── requirements.txt
├── package.json
└── README.md
```

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/llm_toolkit
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SAGEMAKER_EXECUTION_ROLE=arn:aws:iam::xxx:role/SageMakerRole
OPENAI_API_KEY=your-openai-key  # For AI assistant
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project

### Models
- `GET /api/models` - List available models
- `GET /api/models/:id` - Get model details

### Datasets
- `POST /api/projects/:id/datasets/upload` - Upload dataset
- `POST /api/projects/:id/datasets/:id/validate` - Validate dataset

### Training
- `POST /api/projects/:id/fine-tunes` - Start training
- `GET /api/projects/:id/fine-tunes/:id` - Get training status
- `GET /api/projects/:id/fine-tunes/:id/logs` - Get training logs

### Endpoints
- `POST /api/projects/:id/endpoints` - Deploy model
- `POST /api/projects/:id/endpoints/:id/invoke` - Invoke endpoint

### Research
- `POST /api/projects/:id/research` - Start research session
- `GET /api/projects/:id/research/:id` - Get research status

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [AWS SageMaker](https://aws.amazon.com/sagemaker/) for ML infrastructure
