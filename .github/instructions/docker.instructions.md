---
applyTo: "Dockerfile,docker-compose*.yml,.dockerignore"
---

# Docker Instructions

- Use multi-stage builds to minimize final image size
- Base on node:24-alpine for production stage
- Copy only necessary files for each stage
- Use .dockerignore to exclude development files
- Run as non-root user in production
- Set NODE_ENV=production in production stage
- Use ARG for build-time variables, ENV for runtime
- Expose only necessary ports (3000 for Next.js)
- Implement health check endpoint and HEALTHCHECK instruction
- Use docker-compose for local development with hot reload
