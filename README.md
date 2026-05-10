# Headless Admin-side Product Management Prototype

This repository contains the source code for a small-scale e-commerce admin-side product management prototype. The prototype uses a headless architecture with a Vue.js frontend, a Strapi backend, PostgreSQL persistence, and Docker Compose for the local development environment.

## Technology Stack

- Frontend: Vue.js 3, Vite, Axios
- Backend: Strapi 5
- Database: PostgreSQL 15
- Containerization: Docker and Docker Compose

## Project Structure


```text
.
├── compose.yaml
├── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── strapi/
    ├── Dockerfile
    ├── package.json
    ├── config/
    └── src/api/product/
```

## Environment variable

Copy the example environment file:

```bash
cp .env.example .env
```

## Build and Run

docker compose --env-file .env build

docker compose --env-file .env up -d

## If the logs show an error related to zod/admin bundle...

```text
Could not resolve "zod/v4"
Could not resolve "zod/v3"
```

docker exec -it thesis-clean-strapi sh -lc "npm install zod@3.25.76 --legacy-peer-deps"

docker restart thesis-clean-strapi

## How to build and start the docker compose after npm installation？
docker compose --env-file .env build strapi

docker compose --env-file .env up -d

docker logs thesis-clean-strapi --tail 150

## Open in chrome and check whether it works：

http://localhost:1338/adminv

http://localhost:5174/


