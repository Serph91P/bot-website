---
applyTo: "src/types/**/*.ts"
---

# TypeScript Type Definitions

- Export all types and interfaces from this file
- Use interface for object shapes, type for unions/intersections
- Avoid using `any` type, prefer `unknown` if type is truly unknown
- Use Zod schemas for runtime validation alongside TypeScript types
- Create separate types for API requests, responses, and domain models
- Use const assertions for literal types
- Prefer readonly properties for immutable data
- Document complex types with JSDoc comments
- Use generic types to reduce duplication
- Export utility types (Partial, Pick, Omit) when creating derived types
