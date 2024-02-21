import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor() {
    const kafka = new Kafka({
      clientId: 'shipment-tracking-service',
      brokers: ['localhost:9092'],
    });
    this.producer = kafka.producer();
    this.setupListeners();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected successfully');
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
      throw error;
    }
  }

  async send(topic: string, message: any) {
    if (!this.isConnected) {
      throw new Error('Kafka producer is not connected');
    }

    const record: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
    };

    try {
      await this.producer.send(record);
      console.log('Message sent to Kafka:', message);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from Kafka:', error);
      throw error;
    }
  }

  private setupListeners() {
    this.producer.on(this.producer.events.CONNECT, () => {
      this.isConnected = true;
      console.log('Kafka producer connected');
    });

    this.producer.on(this.producer.events.DISCONNECT, () => {
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    });
  }
}
