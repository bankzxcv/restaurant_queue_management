# Restaurant Queue Manager

A real-time queue management system for restaurants built with Node.js, Express, GraphQL, React, and MongoDB.

## Features

- Real-time queue updates using WebSocket
- Customer queue management (add, update status, remove)
- Estimated wait time calculation
- Modern UI with Tailwind CSS and shadcn components
- GraphQL API for efficient data fetching

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
restaurant-queue/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/         # Utility functions
│   │   └── App.jsx      # Main application component
│   └── package.json
└── server/              # Node.js backend
    ├── src/
    │   ├── models/      # MongoDB models
    │   ├── graphql/     # GraphQL schema and resolvers
    │   └── index.js     # Server entry point
    └── package.json
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Start MongoDB service

4. Start the server:
   ```bash
   cd server
   npm run dev
   ```

5. Start the client:
   ```bash
   cd client
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

## Usage

1. Add customers to the queue using the form on the left
2. View and manage the queue on the right
3. Update customer status (notify, seat) or remove them from the queue
4. Queue positions and wait times update automatically

## Development

- Server runs on port 4000 (GraphQL endpoint: http://localhost:4000/graphql)
- Client runs on port 5173
- WebSocket connection is established automatically for real-time updates

## License

MIT
