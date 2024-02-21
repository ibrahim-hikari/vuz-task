import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryAgent } from './interfaces/delivery-agent.interface';
import { UpdateDeliveryAgentDto } from './dto/update-delivery-agent.dto';

@Injectable()
export class DeliveryAgentsService {
  constructor(@InjectModel('DeliveryAgent') private readonly deliveryAgentModel: Model<DeliveryAgent>) { }

  /**
   * Retrieve all delivery agents from the database.
   * @returns {Promise<DeliveryAgent[]>} Array of delivery agents.
   */
  async findAll(): Promise<DeliveryAgent[]> {
    return this.deliveryAgentModel.find().exec();
  }

  /**
   * Disable a delivery agent by ID.
   * @param {string} id - The ID of the delivery agent to disable.
   * @returns {Promise<DeliveryAgent>} The disabled delivery agent.
   * @throws {NotFoundException} If the delivery agent with the given ID is not found.
   */
  async disable(id: string): Promise<DeliveryAgent> {
    const agent = await this.deliveryAgentModel.findByIdAndUpdate(id, { status: 'disabled' }, { new: true }).exec();
    if (!agent) {
      throw new NotFoundException('Delivery agent not found');
    }
    return agent;
  }

  /**
   * Enable a delivery agent by ID.
   * @param {string} id - The ID of the delivery agent to enable.
   * @returns {Promise<DeliveryAgent>} The enabled delivery agent.
   * @throws {NotFoundException} If the delivery agent with the given ID is not found.
   */
  async enable(id: string): Promise<DeliveryAgent> {
    const agent = await this.deliveryAgentModel.findByIdAndUpdate(id, { status: 'enabled' }, { new: true }).exec();
    if (!agent) {
      throw new NotFoundException('Delivery agent not found');
    }
    return agent;
  }

  /**
   * Update the details of a delivery agent.
   * @param {string} id - The ID of the delivery agent to update.
   * @param {UpdateDeliveryAgentDto} updateDeliveryAgentDto - The DTO containing the updated details.
   * @returns {Promise<DeliveryAgent>} The updated delivery agent.
   * @throws {NotFoundException} If the delivery agent with the given ID is not found.
   */
  async update(id: string, updateDeliveryAgentDto: UpdateDeliveryAgentDto): Promise<DeliveryAgent> {
    const agent = await this.deliveryAgentModel.findByIdAndUpdate(id, updateDeliveryAgentDto, { new: true }).exec();
    if (!agent) {
      throw new NotFoundException('Delivery agent not found');
    }
    return agent;
  }
}