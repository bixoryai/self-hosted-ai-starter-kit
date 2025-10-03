## Project Rules: Nvidia GPU on Windows

- **Purpose**: Fast, local, privacy-first AI workflows using `n8n` + `Ollama` + `Qdrant` + `PostgreSQL` on an Nvidia GPU Windows setup. Learning/experimentation focus; not production-hardened.

- **Supported platform**
  - Windows 10/11 with Docker Desktop (WSL2 backend) and an Nvidia GPU.
  - Install latest Nvidia GPU drivers and enable GPU support in Docker Desktop.
  - If you have not used your Nvidia GPU with Docker before, follow the Ollama Docker guide: https://github.com/ollama/ollama/blob/main/docs/docker.md

- **How to run (GPU)**
  - Use local envs: secrets are kept in .env locally.
  - Start stack: `docker compose --profile gpu-nvidia up`
  - Upgrade images: `docker compose --profile gpu-nvidia pull`
  - Recreate + start after pull: `docker compose create && docker compose --profile gpu-nvidia up`

- **Ports and services**
  - n8n UI: http://localhost:5678
  - PostgreSQL: 5432
  - Qdrant: 6333
  - Ollama: 11434
  - Persistent volumes: `n8n_storage`, `postgres_storage`, `qdrant_storage`, `ollama_storage`

- **Ollama configuration (critical)**
  - Inside Docker, n8n must use `http://ollama:11434`.
  - In n8n UI → `Home → Credentials → Local Ollama service`, set Base URL to `http://ollama:11434`.
  - Do not set Base URL to `0.0.0.0` or `localhost` from inside containers.
  - `.env`: Do not override `OLLAMA_HOST` unless you intentionally run Ollama on the host. If you do, set `OLLAMA_HOST=host.docker.internal:11434` and match the n8n credential.

- **Demo data (first run only)**
  - `n8n-import` is commented out to avoid repeated imports.
  - Temporarily uncomment the `n8n-import` service and dependency under `n8n` for your first run; re-comment after a successful launch.

- **Local file access inside n8n**
  - Use `/data/shared` in nodes to read/write local files (mapped to `./shared`).

- **Troubleshooting (GPU/Windows)**
  - Check containers: `docker ps`
  - n8n logs: `docker logs n8n --since 10m`
  - Ollama logs: `docker logs ollama --since 10m`
  - Test from n8n: `docker exec n8n sh -lc "wget -qO- http://ollama:11434/api/tags || echo fail"`
  - If credential errors mention `0.0.0.0`/`localhost`, fix the n8n credential Base URL to `http://ollama:11434`.

- **Scope and contribution guardrails**
  - Keep it simple with production-ready quality.
  - Small, focused PRs only; no typo-only PRs.
  - Documentation that clarifies Windows + Nvidia GPU usage is welcome.

- **Security**
  - Local by default; keep secrets in `.env` locally.
  - This kit is not intended for public internet exposure without additional hardening.


