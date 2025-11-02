# Multi-stage Dockerfile for Next.js

# Stage 1: Dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (needed for Next.js build)
ARG EMBY_SERVER_URL
ARG EMBY_API_KEY
ARG N8N_WEBHOOK_URL
ARG N8N_WEBHOOK_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Set them as ENV for the build process
ENV EMBY_SERVER_URL=${EMBY_SERVER_URL}
ENV EMBY_API_KEY=${EMBY_API_KEY}
ENV N8N_WEBHOOK_URL=${N8N_WEBHOOK_URL}
ENV N8N_WEBHOOK_SECRET=${N8N_WEBHOOK_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
