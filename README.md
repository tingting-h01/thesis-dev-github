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

cp .env.example .env

## Project Structure

docker compose --env-file .env build

docker compose --env-file .env up -d
