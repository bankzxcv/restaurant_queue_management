import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'seated', 'cancelled'],
    default: 'waiting',
    required: true,
  },
  position: {
    type: Number,
    required: true,
    min: 1,
  },
  estimatedWaitTime: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Add a pre-save hook to ensure position is set
queueSchema.pre('save', async function(next) {
  if (this.isNew && !this.position) {
    try {
      const count = await this.constructor.countDocuments({ status: 'waiting' });
      this.position = count + 1;
      this.estimatedWaitTime = this.position * 15;
    } catch (error) {
      next(error);
    }
  }
  next();
});

const Queue = mongoose.model('Queue', queueSchema);

export default Queue;
