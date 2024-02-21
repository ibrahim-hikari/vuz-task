import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { DeliveryAgentsService } from './delivery-agents.service';
import { DeliveryAgent } from './interfaces/delivery-agent.interface';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateDeliveryAgentDto } from './dto/update-delivery-agent.dto';

@Controller('delivery-agents')
export class DeliveryAgentsController {
  constructor(private readonly deliveryAgentsService: DeliveryAgentsService) { }

  /**
   * Retrieve all delivery agents.
   * @returns {Promise<DeliveryAgent[]>} Array of delivery agents.
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<DeliveryAgent[]> {
    return this.deliveryAgentsService.findAll();
  }

  /**
   * Disable a delivery agent by ID.
   * @param {string} id - The ID of the delivery agent to disable.
   * @returns {Promise<DeliveryAgent>} The disabled delivery agent.
   */
  @Put('/:id/disable')
  @UseGuards(JwtAuthGuard)
  async disable(@Param('id') id: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsService.disable(id);
  }

  /**
   * Enable a delivery agent by ID.
   * @param {string} id - The ID of the delivery agent to enable.
   * @returns {Promise<DeliveryAgent>} The enabled delivery agent.
   */
  @Put('/:id/enable')
  @UseGuards(JwtAuthGuard)
  async enable(@Param('id') id: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsService.enable(id);
  }

  /**
   * Update the details of a delivery agent.
   * @param {string} id - The ID of the delivery agent to update.
   * @param {UpdateDeliveryAgentDto} updateDeliveryAgentDto - The DTO containing the updated details.
   * @returns {Promise<DeliveryAgent>} The updated delivery agent.
   */
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateDeliveryAgentDto: UpdateDeliveryAgentDto,): Promise<DeliveryAgent> {
    return this.deliveryAgentsService.update(id, updateDeliveryAgentDto);
  }
}
