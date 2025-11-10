# Travel App

A full-stack travel booking application built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Travel package management
- Booking system
- Review system
- Admin dashboard
- File upload functionality
- Responsive design

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Storage:** Supabase
- **Deployment:** Docker

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd travel-app
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma.seed
   ```

5. Build the frontend:
   ```bash
   cd frontend && npm run build && cd ..
   ```

6. Start the application:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:5000`.

## Development

### Running in development mode

1. Start the backend:
   ```bash
   cd backend && npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend && npm run dev
   ```

## Deployment

### Using Docker

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Manual Deployment

1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Start the backend:
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for required environment variables.

## API Documentation

The API endpoints are available at `/api/*`. Key endpoints include:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/packages` - Get all packages
- `POST /api/bookings` - Create booking
- `GET /api/admin/dashboard` - Admin dashboard data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
