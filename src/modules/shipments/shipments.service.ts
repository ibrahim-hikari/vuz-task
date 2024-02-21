import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { CacheService } from '../redis/cache.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

import { AssignShipmentDto } from './dto/assign-shipment.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

import { DeleteResponse } from './interfaces/delete-response.interface';
import { DeliveryAgent } from '../delivery-agents/interfaces/delivery-agent.interface';
import { Shipment } from './interfaces/shipment.interface';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel('Shipment') private readonly shipmentModel: Model<Shipment>,
    @InjectModel('DeliveryAgent') private readonly deliveryAgentModel: Model<DeliveryAgent>,
    private readonly redisService: CacheService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) { }

  /**
   * Retrieves all shipments from the database.
   * @param userId - Optional. If provided, retrieves shipments associated with the specified user.
   * @returns A Promise that resolves to an array of Shipment objects.
   * @throws NotFoundException if no shipments are found.
  */
  async getAllShipments(userId?: string): Promise<Shipment[]> {
    const cachedData: string = await this.redisService.getData('allShipments');
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    try {
      let shipments: Shipment[];
      if (userId) {
        shipments = await this.shipmentModel.find({ userId }).exec();
      } else {
        shipments = await this.shipmentModel.find().exec();
      }
      await this.redisService.setData('allShipments', JSON.stringify(shipments));

      return shipments;
    } catch (error) {
      throw new NotFoundException('Shipment not found');
    }
  }

  /**
   * Retrieves shipments associated with a specific user or a single shipment by ID.
   * @param userId - The ID of the user whose shipments are to be retrieved.
   * @param shipmentId - Optional. The ID of the shipment to retrieve.
   * @returns A Promise that resolves to a single Shipment object if shipmentId is provided,
   *          or an array of Shipment objects associated with the specified user.
   * @throws NotFoundException if no shipments are found.
  */
  async getUserShipments(userId: string, shipmentId: string): Promise<Shipment[] | Shipment> {
    try {
      if (shipmentId) {
        const shipment: Shipment = await this.shipmentModel.findOne({ userId, _id: shipmentId }).exec();
        if (!!shipment) {
          return shipment;
        }

        throw new NotFoundException('Shipment not found');
      }
      return this.shipmentModel.find({ userId }).exec();

    } catch (error) {
      throw new NotFoundException('Shipment not found');
    }
  }

  /**
   * Creates a new shipment in the database.
   * @param createShipmentDto - The data to create the shipment.
   * @param userId - The ID of the user creating the shipment.
   * @returns A Promise that resolves to the created Shipment object.
  */
  async createShipment(createShipmentDto: CreateShipmentDto, userId: string): Promise<Shipment> {
    const payLoad: Shipment = {
      ...createShipmentDto,
      userId,
      trackingNumber: uuidv4()
    }
    const createdShipment = new this.shipmentModel(payLoad);
    return createdShipment.save();
  }

  /**
   * Updates an existing shipment in the database.
   * @param id - The ID of the shipment to update.
   * @param updateShipmentDto - The data to update the shipment.
   * @returns A Promise that resolves to the updated Shipment object.
  */
  async updateShipment(id: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    const updateShipment: Shipment = {
      ...updateShipmentDto,
      modifiedDate: new Date()
    } as Shipment;

    const updatedShipment = await this.shipmentModel.findByIdAndUpdate(id, updateShipment, { new: true });
    await this.emitShipmentEvent('shipment-updates', updatedShipment);

    return updatedShipment;
  }

  /**
   * Cancels a shipment in the database.
   * @param id - The ID of the shipment to cancel.
   * @returns A Promise that resolves to the cancelled Shipment object.
  */
  async cancelShipment(id: string): Promise<Shipment> {
    const cancelledShipment = await this.shipmentModel.findByIdAndUpdate(
      id,
      {
        status: 'cancelled', modifiedDate: new Date()
      }, { new: true }
    ).exec();

    await this.emitShipmentEvent('shipment-updates', cancelledShipment);

    return cancelledShipment;
  }

  /**
   * Deletes a shipment from the database.
   * @param id - The ID of the shipment to delete.
   * @returns A Promise that resolves to a DeleteResponse object indicating the status of the deletion.
  */
  async deleteShipment(id: string): Promise<DeleteResponse> {
    const deletedShipment = await this.shipmentModel.deleteOne({ _id: id }).exec();
    if (deletedShipment.acknowledged) {
      return {
        status: 202,
        message: 'Shipment deleted successfully'
      }
    }

  }

  /**
   * Checks if a shipment exists in the database based on the provided search filter.
   * @param searchFilter - The filter criteria to search for the shipment.
   * @returns A Promise that resolves to true if the shipment exists, false otherwise.
  */
  async isShipmentExist(searchFilter: object): Promise<boolean> {
    try {
      const shipment = await this.shipmentModel.findOne(searchFilter).exec();

      return !!shipment
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async emitShipmentEvent(eventType: string, payload: any) {
    await this.kafkaProducerService.send(eventType, payload);
  }

  async assignShipment(id: number, assignShipmentDto: AssignShipmentDto): Promise<void> {
    const { deliveryAgentId } = assignShipmentDto;

    const shipment = await this.shipmentModel.findById(id);
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const deliveryAgent = await this.deliveryAgentModel.findById(deliveryAgentId);
    if (!deliveryAgent) {
      throw new NotFoundException('Delivery agent not found');
    }

    shipment.deliveryAgent = deliveryAgent;
    await shipment.save();
  }
}
