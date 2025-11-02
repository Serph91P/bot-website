---
applyTo: "src/app/**/page.tsx,src/app/**/layout.tsx"
---

# Page and Layout Instructions

- Pages are Server Components by default, use "use client" only when needed
- Implement proper metadata export for SEO (title, description)
- Use Suspense boundaries with fallback for async data loading
- Handle authentication in Server Components via auth() helper
- Redirect unauthenticated users using redirect() from next/navigation
- Use searchParams for query parameters (requires "use client" and Suspense wrapper)
- Implement proper error boundaries with error.tsx files
- Use loading.tsx for route-level loading states
- Keep page components thin, delegate logic to separate functions or Server Actions
