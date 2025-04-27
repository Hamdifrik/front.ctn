export type ShipmentStatus = 
  | 'pending'       // Awaiting confirmation
  | 'confirmed'     // Booking confirmed
  | 'in_transit'    // Cargo is in transit
  | 'arrived'       // Arrived at destination
  | 'delivered'     // Cargo delivered to recipient
  | 'cancelled'     // Booking cancelled
  | 'delayed';      // Shipment has been delayed

export type DocumentStatus = 
  | 'required'      // Document is required
  | 'uploaded'      // Document has been uploaded
  | 'processing'    // Document is being processed
  | 'approved'      // Document has been approved
  | 'rejected';     // Document has been rejected

export interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'bill_of_lading' | 'customs_declaration' | 'certificate_of_origin' | 'other';
  status: DocumentStatus;
  uploadDate?: string;
  lastUpdated: string;
  notes?: string;
  fileUrl?: string;
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  location?: string;
  description: string;
  type: 'status_change' | 'document_update' | 'location_update' | 'note';
}

export interface Shipment {
  id: string;
  bookingNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: ShipmentStatus;
  origin: string;
  destination: string;
  cargoType: string;
  cargoWeight: number;
  cargoVolume: number;
  cargoDescription: string;
  bookingDate: string;
  departureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  documents: Document[];
  events: ShipmentEvent[];
  vesselName: string;
  vesselVoyage: string;
}