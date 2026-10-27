# Security Policy — VaayuEdge

VaayuEdge is designed as an offline-first, privacy-conscious speech intelligence system.
We treat audio privacy and device safety with top priority.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Core Security & Privacy Principles

1. **No Silent Remote Fallbacks**: VaayuEdge explicitly labels the execution environment (`local` vs `cloud/remote`). When configured in local/offline mode, under no circumstance will audio, intermediate representations, or transcripts be dispatched to remote services.
2. **Ephemeral Audio Storage**: Audio recordings submitted for processing are held in memory or transient temporary storage only for the duration of inference, unless explicitly saved by the user.
3. **No Credential Leaks**: Never hardcode API keys, tokens, or credentials in client bundles or public repositories.
4. **Input Sanitization**: File uploads are strictly validated for MIME type, container integrity, maximum byte length (default 25MB), and maximum duration (default 180 seconds).

## Reporting a Vulnerability

If you discover a security or privacy vulnerability in VaayuEdge:
1. Do **not** open a public issue.
2. Contact the maintainers privately via email: `security@neuralmasteryai.com`.
3. Include clear steps to reproduce, affected software versions, and proof-of-concept information.
4. We aim to acknowledge reports within 48 hours and provide a remediation plan within 7 business days.
