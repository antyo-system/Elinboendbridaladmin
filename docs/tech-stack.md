# Tech Stack & Architecture — Elinboend Bridal Admin

## Frontend Stack
- **Framework**: React 19 + TypeScript (Strict Mode)
- **Build Tool**: Vite 6 (`@vitejs/plugin-react-swc`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing**: React Router DOM v7
- **State Management**:
  - `@tanstack/react-query` v5 for asynchronous data fetching, caching, and mutations
  - `zustand` v5 (with `persist` middleware) for `useAuthStore`, `useLanguageStore`, and `usePrivacyStore`
- **Icons & Feedback**: `@phosphor-icons/react`, `lucide-react`, `sonner`

## Backend & Persistence Strategy
- **Primary BaaS**: Supabase (`@supabase/supabase-js`) targeting `products` and `articles` tables defined in `Elinboendbridal/docs/schema.sql`.
- **Resilient Local Persistence Fallback**: When Supabase environment variables are not configured or offline, `useProducts` and `useArticles` seamlessly read/write to `localStorage` seeded with the official Elinboend Bridal collection so the admin panel works 100% out of the box.

