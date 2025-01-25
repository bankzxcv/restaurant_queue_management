import Queue from '../models/Queue.js';
import { broadcast } from '../index.js';

// GraphQL Schema
const schema = `#graphql
  type Queue {
    id: ID!
    customerName: String!
    phoneNumber: String!
    partySize: Int!
    status: String!
    position: Int!
    estimatedWaitTime: Int!
    createdAt: String!
  }

  type Query {
    getQueue(id: ID!): Queue
    getAllQueues: [Queue!]
    getCurrentWaitTime: Int!
  }

  type Mutation {
    addToQueue(
      customerName: String!
      phoneNumber: String!
      partySize: Int!
    ): Queue!
    
    updateQueueStatus(
      id: ID!
      status: String!
    ): Queue
    
    removeFromQueue(id: ID!): Queue
  }
`;

// Resolvers
const resolvers = {
  Query: {
    getQueue: async (_, { id }) => {
      try {
        return await Queue.findById(id);
      } catch (error) {
        console.error('Error in getQueue:', error);
        return null;
      }
    },
    
    getAllQueues: async () => {
      try {
        const queues = await Queue.find({}).sort({ position: 1 });
        return queues || [];
      } catch (error) {
        console.error('Error in getAllQueues:', error);
        return [];
      }
    },
    
    getCurrentWaitTime: async () => {
      try {
        const activeQueues = await Queue.countDocuments({ status: 'waiting' });
        return activeQueues * 15; // Assuming 15 minutes per party
      } catch (error) {
        console.error('Error in getCurrentWaitTime:', error);
        return 0;
      }
    },
  },
  
  Mutation: {
    addToQueue: async (_, { customerName, phoneNumber, partySize }) => {
      try {
        const position = await Queue.countDocuments({ status: 'waiting' }) + 1;
        const estimatedWaitTime = position * 15;
        const newQueue = new Queue({
          customerName,
          phoneNumber,
          partySize,
          position,
          estimatedWaitTime,
          status: 'waiting',
          createdAt: new Date().toISOString()
        });
        
        const result = await newQueue.save();
        broadcast({ type: 'QUEUE_UPDATED' });
        return result;
      } catch (error) {
        console.error('Error in addToQueue:', error);
        throw new Error('Failed to add to queue');
      }
    },
    
    updateQueueStatus: async (_, { id, status }) => {
      try {
        const result = await Queue.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        broadcast({ type: 'QUEUE_UPDATED' });
        return result;
      } catch (error) {
        console.error('Error in updateQueueStatus:', error);
        throw new Error('Failed to update queue status');
      }
    },
    
    removeFromQueue: async (_, { id }) => {
      try {
        const result = await Queue.findByIdAndDelete(id);
        broadcast({ type: 'QUEUE_UPDATED' });
        return result;
      } catch (error) {
        console.error('Error in removeFromQueue:', error);
        throw new Error('Failed to remove from queue');
      }
    },
  },
};

export { schema, resolvers };
