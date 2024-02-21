export interface TrackingEvent {
    _id: string;
    status: 'pending' | 'in_transit' | 'delivered';
    location: string;
    trackingNumber: string;
  }