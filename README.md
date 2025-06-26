This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local Development (without Docker)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Docker Development Environment

For development with Docker (includes hot reload):

```bash
# Using the script
./scripts/dev.sh

# Or directly with docker-compose
docker-compose -f infrastructure/docker-compose.yml up --build
```

This will start the development environment with hot reload enabled. Any changes to your source code will automatically trigger a rebuild.

### Docker Production Environment

For production with Docker:

```bash
# Using the script
./scripts/prod.sh

# Or directly with docker-compose
docker-compose -f infrastructure/docker-compose.prod.yml up --build
```

This will build and run the production-optimized version of your application.

## Project Structure

```
IntroToAI/
├── infrastructure/          # Docker and deployment configuration
│   ├── docker-compose.yml   # Development environment
│   ├── docker-compose.prod.yml # Production environment
│   ├── Dockerfile          # Production Docker build
│   ├── Dockerfile.dev      # Development Docker build
│   └── .dockerignore       # Docker build exclusions
├── scripts/                 # Helper scripts
│   ├── dev.sh              # Development startup script
│   └── prod.sh             # Production startup script
├── src/                    # Application source code
└── ...
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
