# AI Orbit Tools

A production-quality AI Tools Directory built with Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Auth.js, Zod, and Framer Motion.

## Overview

AI Orbit Tools is an AI tools discovery platform where users can search, filter, sort, save, review, and submit AI tools across multiple categories.

## Features

- **Tools Listing**: Search, filters, sorting, grid/list view, pagination
- **Tool Detail**: Full information, reviews, similar tools, save/bookmark
- **Category Pages**: Browse tools by category
- **Saved Tools**: Bookmark tools
- **Submit Tool**: Submit new AI tools
- **Reviews**: 1–5 star ratings and written reviews
- **Authentication**: Email/password signup and login
- **REST APIs**: Tools, categories, reviews, saved tools, submissions
- **Database**: Prisma + PostgreSQL

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Prisma
- **Authentication**: Auth.js
- **Validation**: Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel + Neon

## Architecture

```text
src/
├── app/                    # Next.js App Router
│   ├── api/                # Route Handlers
│   │   ├── auth/           # Authentication endpoints
│   │   ├── categories/     # Categories API
│   │   ├── reviews/        # Reviews API
│   │   ├── saved/          # Saved tools API
│   │   ├── submissions/    # Tool submissions API
│   │   └── tools/          # Tools API
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── tools/              # Tools pages
│   │   ├── [slug]/         # Tool detail page
│   │   ├── category/[slug]/ # Category page
│   │   ├── saved/          # Saved tools page
│   │   ├── submit/         # Submit tool page
│   │   ├── page.tsx        # Tools listing page
│   │   └── ToolsPageClient.tsx
│   ├── not-found.tsx       # 404 page
│   ├── error.tsx           # Error boundary
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root redirect
├── components/             # Reusable components
│   ├── Navbar.tsx
│   ├── ToolCard.tsx
│   ├── ToolSearchFilters.tsx
│   ├── Pagination.tsx
│   └── ui/                 # UI components (Button, Input, Select, etc.)
├── data/                   # Mock data
│   ├── categories.ts       # Category definitions
│   └── tools.ts            # Mock tool data (25 tools)
├── lib/                    # Utilities
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth configuration
│   └── utils.ts            # Helper functions
└── types/                  # TypeScript types
    ├── tool.ts
    ├── category.ts
    ├── review.ts
    ├── user.ts
    ├── saved.ts
    └── submission.ts
