import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { ShipmentsService } from '../shipments.service';

@Injectable()
export class ShipmentExistenceGuard implements CanActivate {
  constructor(private readonly shipmentsService: ShipmentsService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const shipmentId = request.params.id || request.body.shipmentId;
    const isShipmentExist: boolean = await this.shipmentsService.isShipmentExist({ _id: shipmentId });

    if (isShipmentExist) {
      return true;
    }
    throw new NotFoundException('Shipment not found');
  }
}
