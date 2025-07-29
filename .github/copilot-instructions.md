<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js project using React, TypeScript, and Tailwind CSS. Generate code and components that follow best practices for these technologies.

- Use name-based values for frontend routes (e.g., /customer/[name]) for user-friendly URLs.
- Use id-based values for backend APIs (e.g., /api/customers/[id]) for reliability and uniqueness.
- When writing Next.js 15+ route handlers, always type the context parameter as Promise<{ params: ... }> and await it to access params.
- For all customer data operations (fetch, update, delete), use the customer ID in API requests.

- When creating Next.js App Router API route handlers (GET, POST, PUT, DELETE, etc.), always use the modern Promise-based params pattern
