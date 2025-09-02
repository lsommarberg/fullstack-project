# Knitting Pattern Manager

A full-stack web application for managing knitting patterns and tracking project progress. Built with React, Node.js, Express, and MongoDB.

## 🔗 Link to Application

[Knitting Pattern Manager](https://fullstack-project-client.onrender.com)

## Features

- **Pattern Management**: Create, edit, and organize knitting patterns with instructions, images, and tags
- **Project Tracking**: Start projects from patterns or create standalone projects with row tracking and progress monitoring
- **Image Upload**: Upload pattern images and project photos via Cloudinary integration
- **User Analytics**: View statistics on project completion rates, activity trends, and pattern usage
- **Responsive Design**: Works on desktop with dark/light mode support

## Tech Stack

- **Frontend**: React, Chakra UI, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Testing**: Jest (unit), Playwright (E2E)
- **Deployment**: Docker, Render

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose (required for testing only)
- MongoDB database (used for both development and production)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/lsommarberg/fullstack-project.git
   cd fullstack-project
   ```

2. **Set up environment variables**
   
   Create a `.env` file in `src/server` directory only:
   
   **Server (.env)**:
   ```
   MONGODB_URI=your-mongodb-connection-string
   SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```
   
   *Note: Client-side does not require environment variables in development*

3. **Install dependencies**
   ```bash
   # Backend
   cd src/server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Backend (from src/server)
   npm run dev
   
   # Terminal 2: Frontend (from src/client)
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Testing

### Unit Tests

**Frontend Tests**
```bash
cd src/client
npm test
```

**Backend Tests** (requires MongoDB test container)
```bash
# Start MongoDB test container (separate from development database)
docker-compose -f docker-compose.test.yml up -d

# Run tests
cd src/server
npm test

# Clean up
docker-compose -f docker-compose.test.yml down
```

### End-to-End Tests

E2E tests require the MongoDB test container:

```bash
# Start test services (includes MongoDB container for testing)
docker-compose -f docker-compose.test.yml up -d

# Run E2E tests
cd src/client
npm run e2e:ci

# Or run with UI (for development)
npm run e2e

# Clean up
docker-compose -f docker-compose.test.yml down
```

### Running All Tests

```bash
# Start MongoDB test container
docker-compose -f docker-compose.test.yml up -d

# Run all tests
cd src/server && npm test
cd ../client && npm test && npm run e2e:ci

# Clean up test container
docker-compose -f docker-compose.test.yml down
```

## Deployment

### Docker Production Build

**Environment Variables for Production:**
Create a `.env` file in the **root directory** with the same variables as the server .env:
```
MONGODB_URI=your-mongodb-connection-string
SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

**Run Production Build:**
```bash
# Build and run production containers (connects to MongoDB)
docker-compose -f docker-compose.local.yml up --build

# Access application at http://localhost:3000
```

*Note: Production deployment uses MongoDB, not containerized MongoDB*

## Usage

1. **Sign up/Login**: Create an account or log in to access your patterns
2. **Create Patterns**: Add new knitting patterns with instructions, links, and images
3. **Start Projects**: Begin projects from existing patterns with row tracking
4. **Track Progress**: Update row counts and add project notes as you work
5. **View Analytics**: Monitor your knitting activity and completion statistics
6. **Organize**: Use tags and search to organize your pattern collection

## API Endpoints

Key backend endpoints:
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `GET /api/patterns/:userId` - Get user patterns
- `POST /api/patterns` - Create new pattern
- `GET /api/projects/:userId` - Get user projects
- `POST /api/projects` - Start new project
- `GET /api/analytics/:userId` - Get user analytics


## Project Hours
Link: [Work & Study Hours Log](hours.md)

**Total Hours**: 176 hours

