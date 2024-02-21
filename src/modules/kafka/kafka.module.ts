import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaProducerService } from './kafka-producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'shipment-tracking-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'tracking-service',
          },
        },
      }, // Can be moved to a configuration file
    ]),
  ],
  providers: [
    KafkaProducerService,
    KafkaConsumerService
  ],
  exports: [
    KafkaProducerService,
    KafkaConsumerService
  ],
})
export class KafkaModule { }
