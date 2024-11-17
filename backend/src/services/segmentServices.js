// File: backend/src/services/segmentService.js
const Customer = require('../models/Customer');

class SegmentService {
  async calculateAudienceSize(conditions) {
    const query = this.buildSegmentQuery(conditions);
    return await Customer.countDocuments(query);
  }

  async getAudience(conditions) {
    const query = this.buildSegmentQuery(conditions);
    return await Customer.find(query);
  }

  buildSegmentQuery(conditions) {
    const query = { $and: [] };
    
    conditions.forEach(condition => {
      const subQuery = {};
      const field = this.getFieldForCondition(condition.type);
      
      switch (condition.operator) {
        case 'gt':
          subQuery[field] = { $gt: condition.value };
          break;
        case 'lt':
          subQuery[field] = { $lt: condition.value };
          break;
        case 'eq':
          subQuery[field] = condition.value;
          break;
      }
      
      if (condition.type === 'lastVisit') {
        const date = new Date();
        date.setDate(date.getDate() - condition.value);
        subQuery[field] = { $lt: date };
      }
      
      query.$and.push(subQuery);
    });
    
    return query;
  }

  getFieldForCondition(type) {
    switch (type) {
      case 'spending':
        return 'totalSpending';
      case 'visits':
        return 'visits';
      case 'lastVisit':
        return 'lastVisit';
      default:
        throw new Error(`Unknown condition type: ${type}`);
    }
  }
}

module.exports = new SegmentService();

// File: backend/src/services/messageService.js
const kafka = require('kafka-node');
const CommunicationLog = require('../models/CommunicationLog');

class MessageService {
  constructor() {
    this.producer = new kafka.Producer(
      new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST })
    );
    
    this.producer.on('ready', () => {
      console.log('Kafka Producer is ready');
    });
  }

  async sendMessages(campaign, customers) {
    const messages = customers.map(customer => ({
      campaignId: campaign._id,
      customerId: customer._id,
      message: this.generateMessage(campaign, customer),
      status: 'PENDING',
      sentAt: new Date()
    }));
    
    // Batch insert into communications_log
    await CommunicationLog.insertMany(messages);
    
    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      await this.processBatch(batch);
    }
  }

  async processBatch(messages) {
    return Promise.all(
      messages.map(async (message) => {
        // Simulate message sending with 90% success rate
        const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
        
        // Publish to Kafka for delivery status updates
        await this.publishDeliveryStatus(message._id, status);
        
        return status;
      })
    );
  }

  async publishDeliveryStatus(messageId, status) {
    return new Promise((resolve, reject) => {
      this.producer.send([{
        topic: 'delivery-status',
        messages: JSON.stringify({ messageId, status })
      }], (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  generateMessage(campaign, customer) {
    // You can expand this to support more complex message templates
    return `Hi ${customer.name}, here's 10% off on your next order!`;
  }
}

module.exports = new MessageService();