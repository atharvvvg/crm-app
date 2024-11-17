// File: backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/crm_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

// File: backend/src/models/index.js
const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  totalSpending: { type: Number, default: 0 },
  lastVisit: { type: Date },
  visits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  amount: { type: Number, required: true },
  items: [{ type: String }],
  date: { type: Date, default: Date.now }
});

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  segmentConditions: [{
    type: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: Number, required: true }
  }],
  audienceSize: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['DRAFT', 'SENDING', 'COMPLETED', 'FAILED'],
    default: 'DRAFT'
  },
  createdAt: { type: Date, default: Date.now }
});

// Communication Log Schema
const communicationLogSchema = new mongoose.Schema({
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign',
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer',
    required: true 
  },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'SENT', 'FAILED'],
    default: 'PENDING'
  },
  sentAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for better query performance
customerSchema.index({ email: 1 });
orderSchema.index({ customerId: 1 });
communicationLogSchema.index({ campaignId: 1, customerId: 1 });

const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);
const CommunicationLog = mongoose.model('CommunicationLog', communicationLogSchema);

module.exports = {
  Customer,
  Order,
  Campaign,
  CommunicationLog
};