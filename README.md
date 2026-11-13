# sarashina-relay

Vercel serverless relay pinned to the Tokyo region (`hnd1`) for the Sarashina API,
which rejects requests from outside Japan. The Sarashina API key lives only in the
Vercel environment variable `SARASHINA_API_KEY`; callers authenticate with the
`x-relay-token` header (env `RELAY_TOKEN`).

- `GET  /api/models` → `GET  https://api.sarashina.ai/v1/models`
- `POST /api/chat`   → `POST https://api.sarashina.ai/v1/chat/completions` (JSON body passed through)
