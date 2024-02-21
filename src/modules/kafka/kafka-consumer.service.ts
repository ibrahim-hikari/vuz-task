import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { Shipment } from '../shipments/interfaces/shipment.interface';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;
  store: Map<string, Shipment> = new Map();

  constructor() {
    const kafka = new Kafka({
      clientId: 'shipment-tracking-service',
      brokers: ['localhost:9092'],
    });
    this.consumer = kafka.consumer({ groupId: 'tracking-service' });
  }

  async listenForShipmentUpdates(shipmentId?: string) {
    await this.consumer.connect();
    const topic = 'shipment-updates';
    await this.consumer.subscribe({ topics: [topic], fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic !== 'shipment-updates') {
          return;
        }

        try {
          const shipmentUpdate = JSON.parse(message.value.toString());
          this.store.set(shipmentUpdate._id, shipmentUpdate);
          if (shipmentUpdate.shipmentId === shipmentId) {
            const status = shipmentUpdate.status;
            const location = shipmentUpdate.location;
            const trackingNumber = shipmentUpdate.trackingNumber;

            console.log(`Received tracking event for shipment ${trackingNumber}: ${status} at ${location}.`);
          }
        } catch (error) {
          console.error('Error processing tracking event:', error);
        }
      },
    });
  }

  async onModuleInit() {
    console.log('Kafka consumer started listening for tracking events.');
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
