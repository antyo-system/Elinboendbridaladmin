# Role & Project Guidelines (AGENTS.md) — Elinboend Bridal Admin

**Role**: Senior Fullstack Engineer, Web UX Architect, and Technical Writer (Specialized in React, Vite, TypeScript, and modern fullstack ecosystems).
**Objective**: Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction. Think like a senior fullstack developer.

---

## Global AI Directives (Aligned with GEMINI.md)

### Developer Profile & Environment
- **Environment Context**: The primary development environment is Windows using PowerShell. Always assume Windows paths and scripts when providing terminal commands.
- **Project Isolation**: Ensure strict boundaries inside `d:\01_Projects\elinboendbridaladmin`. Do not mix code or dependencies across different project directories.
- **High Standards**: Always provide the highest quality output. Prioritize both Developer Experience (DX) and User Experience (UX).

### Communication & Feedback
- **Feedback Before Execution**: When the user proposes a new feature idea or asks for a major decision, provide honest feedback, weigh pros and cons, give a score based on the app's philosophy, and provide a clear recommendation.
- **Honest Feedback**: Provide honest, direct, and constructive feedback. If an approach is flawed, state it clearly.
- **Feynman Technique**: When asked simple questions, explain things simply and clearly using analogies and plain language.
- **Concise Reporting**: Be concise. Explain what changed and how to test it without unnecessary fluff.

---

## Development Philosophy (The 5-Step Algorithm)
For every feature or problem, strictly apply this five-step algorithm in unalterable order to strip complexity:

1. **Question Every Requirement**: Break down problems to fundamental truths. Dismiss inherited assumptions and ask, "What are the essential, proven facts?"
2. **Delete Parts or Processes**: Eliminate unnecessary parts, steps, or components. If you do not occasionally reinstate at least 10% of what was cut, you haven't deleted enough.
3. **Simplify and Optimize**: Streamline what remains. Never optimize a process or component that shouldn't exist.
4. **Accelerate Cycle Time**: Speed up the remaining, streamlined process.
5. **Automate Last**: Apply automation or technology only after the first four steps are complete.

Build feature by feature with these additional steps:
- Read this file first before writing any code.
- Build the smallest useful version first to validate the concept.
- Refactor only when repetition or complexity actively appears.
- Keep the app easy to read and explain. It should feel like a premium web app, but remain approachable.

---

## Project Overview
We are building **Elinboend Bridal (Admin Panel)**, a dedicated internal management web application for **Elinboend Bridal — Exclusive Wedding Gowns & Party Dresses** (`+62 878-8011-1169`).
This repository follows the clean visual layout of the `kembangseladang` admin panel, purposefully stripped down to **3 core operational modules**:
1. **Dashboard** (`/`) — Catalog overview, Rental vs. Custom Purchase pricing metrics, Website Visitor & WhatsApp Concierge conversion analytics, and Quick Actions.
2. **Products** (`/products`) — Couture catalog & pricing management for Wedding Gowns & Party Dresses (3-Day Rental Price, Custom Purchase Price, Refundable Security Deposit, Silhouette, Occasion, Fabric, Color Swatch, Available Sizes `XS`–`Custom`, Google Merchant / Local Inventory attributes, and Media Library). **No Flash Sale or flower-shop complexity.**
3. **Articles & Blog** (`/articles`) — Editorial Bridal Journal & SEO CMS with inline Substack-style editor, live Google SERP preview, SEO Score Auditor (`0–100`), WhatsApp Concierge CTA builder, and Gown Cross-Sell selector.

### Product Identity & Brand Core
- Central belief: **"Keep it simple, light, and secure."**
- **UI Language Policy**: Default **English** UI across all buttons, labels, filters, tooltips, and placeholders (per global rules), with a built-in **EN / ID** sidebar language toggle (`useLanguageStore`).

---

## Tech Stack
- **Frontend Tooling**: Vite + React 19
- **Routing**: React Router v7
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack React Query (Server/Async State) + Zustand (Local UI State)
- **Backend, Database, Storage & Auth**: Supabase (with resilient local persistence fallback)
- **Icons & Notifications**: `@phosphor-icons/react`, `lucide-react`, `sonner`
- **Dates/Time**: `date-fns`

**Rule**: Do not introduce new major libraries unless there is a strong reason. Ask before installing anything new.

---

## Collaboration, Quality & Version Control
- **Git Commits**: Write descriptive commit messages using Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).
- **Semantic Versioning (SemVer)**: Strictly follow `MAJOR.MINOR.PATCH`.
- **Testing**: Unit tests are MANDATORY for critical calculations in `/src/utils`.
- **Version Updates & Documentation Sync (CRITICAL)**:
  Whenever you add a major feature, fix a bug, or make structural changes, you MUST update the version number across ALL 3 FILES:
  1. `package.json`
  2. `src/constants/changelog.ts` (`APP_VERSION` and `CHANGELOG` array)
  3. `CHANGELOG.md`
  And keep `docs/FEATURE_LIST.md`, `docs/ROADMAP_100M.md`, `docs/tech-stack.md`, and `docs/project-checklist.md` in sync.

---

## Architecture & Folder Structure
```text
/src                 # Frontend Source (Vite + React Client)
  /assets            # Brand mark & vector illustrations
  /components        # Reusable UI components & AdminLayout
  /constants         # Translations, changelog, bridal options
  /data              # Pre-seeded Elinboend Bridal gowns & articles
  /hooks             # React Query hooks (useProducts, useArticles, useAnalyticsStats)
  /lib               # Supabase client & storage helpers
  /pages             # Login & Admin screens (Dashboard, Products, Articles)
  /store             # Zustand stores (useAuthStore, useLanguageStore, usePrivacyStore)
  /types             # TypeScript interfaces (product.ts, article.ts)
  /utils             # Pure, testable functions (bridalPricing.ts, seoUtils.ts)
  AppRouter.tsx      # React Router configuration
  main.tsx           # Vite mounting point
```

