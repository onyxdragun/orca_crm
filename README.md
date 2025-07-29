# Orca CRM

**CRM with a Helpdesk Attitude**

Orca CRM is a modern, full-stack customer relationship management system built with Next.js, React, TypeScript, and Tailwind CSS. It is designed for robust management of customers, devices, tickets, and tasks, with a focus on type safety, best practices, and a clean user experience.

## Project Overview
Orca CRM provides:
- Customer management (view, edit, add, and track customers)
- Device management (associate devices with customers, track service history)
- Ticketing system (create, assign, and manage support tickets)
- Task management (track tasks related to tickets)
- Context-driven UI for seamless navigation and state sharing
- RESTful API routes with modern Next.js conventions

## Features
- **Next.js App Router**: Modern routing and API handling
- **React Context**: For sharing state (e.g., customerId) across components
- **TypeScript**: Type-safe models and API responses
- **Tailwind CSS**: Responsive, modern UI
- **MariaDB**: Scalable SQL backend
- **Modal Forms**: For editing and creating entities
- **BigInt Serialization**: Safe handling of large IDs in API responses

## Tech Stack
- Next.js 15+
- React 18+
- TypeScript
- Tailwind CSS
- MariaDB

## Folder Structure
- `/src/app/` — Next.js pages and API routes
- `/src/components/` — Reusable React components
- `/src/context/` — React Context providers
- `/src/types/` — Shared TypeScript types
- `/src/lib/` — Database and utility functions

## API & Frontend Conventions
- **Frontend routes** use name-based values for user-friendly URLs (e.g., `/customer/[name]`).
- **Backend API routes** use ID-based values for reliability (e.g., `/api/customers/[id]`).
- All API handlers use the modern Promise-based params pattern for Next.js 15+.
- Context is used for sharing customerId and other state across the app.

## Contributing
Pull requests and suggestions are welcome! Please follow best practices for Next.js, React, and TypeScript.

## License
MIT
