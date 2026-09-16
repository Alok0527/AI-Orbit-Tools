# AI Orbit Tools

An AI Tools Directory built with Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Auth.js, Zod, and Framer Motion.

## Overview

AI Orbit Tools is a production-quality AI tools discovery platform. It allows users to search, filter, sort, and discover AI tools across multiple categories. Users can save tools, write reviews, submit new tools, and manage their accounts.

## Features

- **Tools Listing**: Search, filter, sort, grid/list view, pagination
- **Tool Detail**: Full information, reviews, similar tools, save/bookmark
- **Category Pages**: Filtered views by category
- **Saved Tools**: Bookmark tools for quick access
- **Submit Tool**: Submit new AI tools for review
- **Reviews**: 1-5 star ratings with written reviews
- **Authentication**: Email/password signup and login
- **REST API**: Complete API for tools, reviews, saved tools, submissions
- **Database**: Prisma + PostgreSQL with proper schema

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma + PostgreSQL
- **Authentication**: Auth.js (NextAuth)
- **Validation**: Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Architecture

```
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
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or remote)

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-orbit-tools
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aiorbit?schema=public"
AUTH_SECRET="your-auth-secret-here-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
```

Generate a secure AUTH_SECRET:

```bash
openssl rand -base64 32
```

### 4. Set up the database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations
npm run db:migrate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Create and apply migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Secret key for NextAuth | Yes |
| `AUTH_URL` | Application URL | Yes |

## Demo Credentials

After setting up the database, you can create an account by visiting `/signup` with your preferred email and password (minimum 8 characters).

## Deployment

### Vercel

This project is deployment-ready for Vercel.

1. Import the project into Vercel
2. Set the environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL`
3. Deploy

The build command is `npm run build` and the output directory is `.next`.

## Database Schema

The Prisma schema includes the following models:

- **User**: User accounts with email, name, password
- **Tool**: AI tools with name, slug, description, category, pricing, rating
- **Category**: Tool categories (writing, coding, design, etc.)
- **Review**: User reviews with rating and content
- **SavedTool**: User's bookmarked tools
- **ToolSubmission**: Pending tool submissions

## Routes

| Route | Description |
|-------|-------------|
| `/tools` | Tools listing page |
| `/tools/[slug]` | Tool detail page |
| `/tools/category/[slug]` | Category page |
| `/tools/saved` | Saved tools page |
| `/tools/submit` | Submit tool page |
| `/login` | Login page |
| `/signup` | Signup page |
| `/api/tools` | Tools API |
| `/api/tools/[slug]` | Tool detail API |
| `/api/categories` | Categories API |
| `/api/reviews` | Reviews API |
| `/api/reviews/[id]` | Review detail API |
| `/api/saved` | Saved tools API |
| `/api/saved/[toolId]` | Saved tool detail API |
| `/api/submissions` | Submissions API |
| `/api/auth/[...nextauth]` | Auth API |

## License

This project is built for an internship working trial. All code is original.