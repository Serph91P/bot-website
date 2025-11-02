---
applyTo: "src/app/api/**/*.ts"
---

# API Route Instructions

- Always validate request bodies using Zod schemas from `/src/types/index.ts`
- Return NextResponse.json() with consistent structure: `{ status, message, data?, error? }`
- Use try-catch blocks to handle errors gracefully
- Return appropriate HTTP status codes (200, 400, 401, 500)
- Check authentication with `await auth()` from NextAuth for protected routes
- Use TypeScript types for request/response objects
- Log errors with descriptive messages for debugging
- Never expose internal error details to clients in production
- Validate environment variables at route initialization
