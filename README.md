# Nozris - AI-Powered Google Review Management SaaS

Nozris is a multi-tenant SaaS platform that automates Google Business Profile review management using AI.

## Features
- **Multi-Tenancy**: Support for multiple organizations with isolated data.
- **Google Integration**: OAuth 2.0 login and Google Business Profile API integration.
- **AI Automation**: Auto-draft responses based on star rating and sentiment.
- **Dashboard**: Real-time insights into review performance.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js (v5)
- **AI**: OpenAI / Gemini (Integration ready)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL Database (Local or Cloud like Nepal/Supabase)
- Google Cloud Console Project

### Installation

1.  **Clone the repository** (or use the provided source code).

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/nozris?schema=public"
    AUTH_SECRET="your-random-secret-key" # Generate with `openssl rand -base64 32`
    
    # Google OAuth
    AUTH_GOOGLE_ID="your-google-client-id"
    AUTH_GOOGLE_SECRET="your-google-client-secret"
    
    # AI API (Future Use)
    OPENAI_API_KEY="sk-..."
    ```

4.  **Database Setup**:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Documentation

- [Google Cloud Setup](docs/google-setup.md)
- [Database Schema](prisma/schema.prisma)

## Deployment
Deploy easily on Vercel or any Node.js compatible hosting. Ensure environment variables are set in the dashboard.
