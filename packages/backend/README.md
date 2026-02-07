# Voice PA Backend

Node.js/TypeScript backend API for Voice PA.

## Features

- 🔐 Authentication with Supabase
- 📊 PostgreSQL database with Prisma ORM
- 🚀 RESTful API
- ⚡ Redis for caching and job queues
- 🔒 JWT token authentication
- ✅ Input validation
- 📝 Request logging
- 🛡️ Security headers

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Meetings
- `GET /api/meetings` - List all meetings
- `GET /api/meetings/:id` - Get meeting details
- `POST /api/meetings` - Create meeting
- `PATCH /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile
- `GET /api/users/me/settings` - Get settings
- `PATCH /api/users/me/settings` - Update settings

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Database

```bash
# Open Prisma Studio
npm run prisma:studio

# Create migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```
