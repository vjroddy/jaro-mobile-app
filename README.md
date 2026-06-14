# JARO - Advanced Multi-Feature Streaming Platform

JARO is a modern, scalable streaming platform built with Node.js, TypeScript, and WebSocket technology for real-time communication.

## Features

- 🎥 **Real-time Streaming** - WebSocket-based streaming infrastructure
- 🔐 **Authentication** - JWT-based secure authentication
- 👥 **User Management** - Complete user lifecycle management
- 📊 **Stream Management** - Create, manage, and monitor streams
- 🔄 **Real-time Updates** - Socket.io for instant updates
- 📝 **Logging** - Comprehensive logging with Winston
- 🛡️ **Security** - CORS, Helmet, and JWT protection
- 💾 **Database** - MongoDB integration with Mongoose

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5+
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **Testing**: Vitest
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB running locally or connection string

### Installation

1. Clone the repository
```bash
git clone https://github.com/vjroddy/jaro-app.git
cd jaro-app
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:cov` - Run tests with coverage

## License

MIT
