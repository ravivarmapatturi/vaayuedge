# Contributing to VayyuEdge

Thank you for your interest in contributing to **VayyuEdge** ("Less compute. More intelligence.").

## Development Guidelines

1. **Modular Monorepo Structure**:
   - `apps/web`: React + Vite + TypeScript frontend.
   - `services/api`: FastAPI backend with pluggable ML adapters.
   - `packages/contracts`: Shared schemas and contracts.
   - `docs`: Product requirements, architectural decisions, and model evaluations.
   - `scripts`: Setup, download, and benchmarking utilities.

2. **Zero Weights in Git**:
   - Never commit `.bin`, `.gguf`, `.pt`, `.safetensors`, or audio files.
   - Use `scripts/download-models.py` for weight retrieval.

3. **Inference Adapters**:
   - All speech-to-text (ASR), translation (MT), and speech synthesis (TTS) models must implement the respective abstract adapter interfaces.
   - The application must remain operable and return informative fallback messages even when optional TTS or heavy local weights are missing.

4. **Testing Standards**:
   - Run unit and integration tests before submitting PRs.
   - Backend: `pytest`
   - Frontend: `npm run test` (Vitest)
   - Do not claim a test passed unless verified in your terminal.

5. **Code Formatting & Linting**:
   - Python: `flake8`, `black`, `isort`
   - TypeScript/React: `eslint`, `prettier`

## Pull Request Checklist
- [ ] Code adheres to style and naming conventions.
- [ ] Documentation updated in `docs/` where relevant.
- [ ] Tests added for new capabilities or bug fixes.
- [ ] No audio files or binary weights staged.
