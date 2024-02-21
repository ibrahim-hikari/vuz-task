import { DeliveryAgent } from "../../delivery-agents/interfaces/delivery-agent.interface";

export interface Shipment {
  _id?: string;
  userId: string;
  origin: string;
  destination: string;
  deliveryDate?: Date;
  deliveryTime?: string;
  deliveryVehicleType?: 'standard' | 'eco_friendly';
  packagingInstructions?: string;
  additionalServices?: string[];
  status?: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  location?: string;
  trackingNumber?: string;
  deliveryNotes?: string;
  createDate?: Date;
  modifiedDate?: Date;
  deliveryAgent?: DeliveryAgent;
  
}
