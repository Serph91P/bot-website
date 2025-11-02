# Project Overview

This is a Progressive Web App (PWA) for checking TV sender status via n8n workflows with Emby authentication.
Built with Next.js 15 App Router, React 18, TypeScript, and Tailwind CSS.
Deployed via Docker with Node.js 24 LTS.

## Folder Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/app/api/auth/[...nextauth]` - NextAuth.js authentication handlers
- `/src/app/api/n8n` - n8n webhook integration endpoints
- `/src/app/dashboard` - Main dashboard (protected route)
- `/src/app/login` - Login page with Emby credentials
- `/src/components/auth` - Authentication components
- `/src/components/sender` - Sender-related UI components
- `/src/lib` - Utility libraries and API clients
- `/src/types` - TypeScript type definitions
- `/public` - Static assets, PWA manifest, icons

## Libraries and Frameworks

- Next.js 15.5.6 with App Router and Server Components
- NextAuth.js v5.0.0-beta.30 with custom Emby provider
- Tailwind CSS 3.4.18 for styling
- Axios 1.7.9 for HTTP requests
- Zod 3.25.76 for runtime validation
- next-pwa 5.6.0 for PWA functionality
- Node.js 24 LTS Alpine in Docker

## Coding Standards

- Use TypeScript with strict mode enabled
- Use arrow functions for React components and callbacks
- Use async/await instead of Promise.then()
- Use Tailwind utility classes instead of custom CSS
- Export types from `/src/types/index.ts`
- Use Zod schemas for API request/response validation
- Follow Next.js App Router conventions (Server Components by default)
- Use "use client" directive only when necessary (client-side state, hooks, event handlers)
- Prefer Server Actions over API routes when appropriate

## API and Integration Patterns

- Emby API calls go through `/src/lib/emby.ts` client
- n8n webhook calls go through `/src/lib/n8n.ts` client
- All API routes return consistent JSON responses with status, message, and data/error fields
- Protected routes use NextAuth session validation via middleware
- Environment variables are typed and validated at runtime

## UI Guidelines

- Use semantic HTML elements
- Implement responsive design with Tailwind breakpoints
- Show loading states for async operations
- Display error messages in user-friendly format
- Use consistent button styles (btn-primary, btn-secondary classes)
- Apply card component pattern for content sections
- Implement proper focus management for accessibility
