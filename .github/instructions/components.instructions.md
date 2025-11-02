---
applyTo: "src/components/**/*.tsx"
---

# Component Instructions

- Use "use client" directive only when necessary (state, effects, event handlers)
- Export components as named exports (not default)
- Use TypeScript interface for props with descriptive names
- Apply Tailwind classes directly, avoid inline styles
- Use semantic HTML elements (button, article, section, etc.)
- Handle loading and error states explicitly
- Implement proper accessibility attributes (aria-label, role, etc.)
- Keep components small and focused on single responsibility
- Extract reusable logic into custom hooks in `/src/hooks`
- Use React.memo for expensive components that receive stable props
