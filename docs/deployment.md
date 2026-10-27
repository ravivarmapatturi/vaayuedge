# VaayuEdge — Deployment Guide

## 1. Domain & Routing Topology
- **Production Subdomain**: `vaayuedge.neuralmasteryai.com`
- **Fallback URL**: `neuralmasteryai.com/vaayuedge/` (only if subdomain DNS cannot be isolated)
- **Primary Domain Safety**: Do not modify DNS or root files of `neuralmasteryai.com`. VaayuEdge runs completely isolated.

```
                  ┌───────────────────────────────┐
                  │ vaayuedge.neuralmasteryai.com │
                  └──────────────┬────────────────┘
                                 │
                 ┌───────────────▼───────────────┐
                 │ Cloudflare / Reverse Proxy    │
                 │ - Strict HTTPS (TLS 1.3)      │
                 │ - CORS header enforcement     │
                 └───────────────┬───────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           │                                           │
┌──────────▼──────────┐                     ┌──────────▼──────────┐
│ Web Client (Static) │                     │ API Daemon (FastAPI)│
│ Host: Vercel / Nginx│                     │ Host: Docker / VPS  │
└─────────────────────┘                     └─────────────────────┘
```

## 2. Environment Variables Configuration

| Variable | Description | Example |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Deployment environment | `production` |
| `PROCESSING_MODE` | Runtime mode: `local` or `remote` | `local` |
| `CORS_ORIGINS` | Permitted origins | `["https://vaayuedge.neuralmasteryai.com"]` |
| `PORT` | Listening port | `8000` |
| `ASR_ADAPTER` | Engine for speech recognition | `whisper_cpp` |
| `TRANSLATION_ADAPTER` | Engine for translation | `indictrans2` |

## 3. Local Installation (Laptop Edge Target)
```bash
git clone https://github.com/neuralmasteryai/vaayuedge.git
cd vaayuedge
bash scripts/setup-dev.sh
```

## 4. Production Web Build
```bash
cd apps/web
npm ci
npm run build
# Dist directory 'apps/web/dist' is deployed to CDN/static host.
```

## 5. Rollback Procedure
If a production deployment regression occurs:
1. Revert DNS target or CDN deployment to previous release tag.
2. Ensure healthcheck endpoint `/health` returns `{"status": "healthy"}` before shifting traffic.
