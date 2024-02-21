import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { ShipmentsService } from '../shipments.service';

@Injectable()
export class ShipmentOwnerGuard implements CanActivate {
  constructor(private readonly shipmentsService: ShipmentsService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const shipmentId = request.params.id || request.body.shipmentId;
    const userId = request.user._id;
    if (request.user.role === 'admin') {
      return true;
    }
    const isShipmentOwner: boolean = await this.shipmentsService.isShipmentExist({ _id: shipmentId, userId });

    if (isShipmentOwner) {
      return true;
    }
    throw new NotFoundException('Shipment not found');
  }
}
