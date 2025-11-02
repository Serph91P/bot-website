---
applyTo: "src/lib/**/*.ts"
---

# Library/Utility Instructions

- Export functions with descriptive names and TSDoc comments
- Handle errors explicitly, don't let them propagate unhandled
- Use environment variables via process.env with fallbacks
- Validate external API responses before returning
- Create typed clients for external services (Emby, n8n)
- Use axios interceptors for common request/response transformations
- Implement retry logic for transient failures
- Cache responses when appropriate using suitable strategy
- Export types alongside functions for better IDE support
