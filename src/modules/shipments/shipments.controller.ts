import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Put,
  ParseIntPipe
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';
import { RolesGuard } from '../auth/middleware/roles.guard';
import { ShipmentExistenceGuard } from './guards/shipment-existence.guard';
import { ShipmentOwnerGuard } from './guards/shipment-owner.guard';
import { ShipmentsService } from './shipments.service';

import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AssignShipmentDto } from './dto/assign-shipment.dto';

import { Roles } from '../common/decorators/roles.decorator';
import { Shipment } from './interfaces/shipment.interface';

@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly shipmentsService: ShipmentsService
  ) { }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllShipments(@Query('userId') userId: string) {
    return this.shipmentsService.getAllShipments(userId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async getUserShipments(@Request() req: Request, @Query('shipmentId') shipmentId: string) {
    return this.shipmentsService.getUserShipments(req['user']._id, shipmentId);
  }

  @Get('track/:id')
  async track(@Param('id') id: string): Promise<Shipment> {
    return this.kafkaConsumerService.store.get(id) || {} as Shipment;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createShipment(@Request() req: Request, @Body() createShipmentDto: CreateShipmentDto) {
    const shipment: Shipment = await this.shipmentsService.createShipment(createShipmentDto, req['user']._id);
    await this.shipmentsService.emitShipmentEvent('shipment-updates', shipment);
    return shipment
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, ShipmentExistenceGuard, ShipmentOwnerGuard)
  async updateShipment(@Param('id') id: string, @Body() updateShipmentDto: UpdateShipmentDto) {
    return this.shipmentsService.updateShipment(id, updateShipmentDto);
  }

  @Patch('cancel/:id')
  @UseGuards(JwtAuthGuard, ShipmentExistenceGuard, ShipmentOwnerGuard)
  async cancelShipment(@Param('id') id: string) {
    return this.shipmentsService.cancelShipment(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, ShipmentExistenceGuard, ShipmentOwnerGuard)
  async deleteShipment(@Param('id') id: string) {
    return this.shipmentsService.deleteShipment(id);
  }

  @Put('deliveryAgent/:id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async assignShipment(@Param('id', ParseIntPipe) id: number, @Body() assignShipmentDto: AssignShipmentDto) {
    await this.shipmentsService.assignShipment(id, assignShipmentDto);
  }
}
