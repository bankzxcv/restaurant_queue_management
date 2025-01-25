import { resolvers, schema } from './graphql/schema.js';

import { ApolloServer } from '@apollo/server';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Store connected clients
const clients = new Set();

// Broadcast to all connected clients
export const broadcast = (message) => {
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
};

async function startApolloServer() {
  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  // Start the server
  await server.start();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Apply Apollo middleware
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }));

  // Add a simple test endpoint
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });
  });

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 4000;

  // Start the server
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL interface: http://localhost:${PORT}/graphql`);
  });
}

startApolloServer().catch(console.error);
