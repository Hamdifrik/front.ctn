import { Shipment, ShipmentStatus, Document, DocumentStatus } from '../types/shipment';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock shipments
const generateMockShipments = (count: number): Shipment[] => {
  const statuses: ShipmentStatus[] = ['pending', 'confirmed', 'in_transit', 'arrived', 'delivered', 'cancelled', 'delayed'];
  const documentStatuses: DocumentStatus[] = ['required', 'uploaded', 'processing', 'approved', 'rejected'];
  const origins = ['Shanghai, China', 'Rotterdam, Netherlands', 'Singapore', 'Dubai, UAE', 'Los Angeles, USA'];
  const destinations = ['New York, USA', 'Hamburg, Germany', 'Sydney, Australia', 'Mumbai, India', 'Cape Town, South Africa'];
  const cargoTypes = ['Container', 'Bulk Cargo', 'Break Bulk', 'Roll-on/Roll-off', 'Heavy Lift'];
  const vessels = ['CTN Voyager', 'CTN Mariner', 'CTN Explorer', 'CTN Navigator', 'CTN Horizon'];
  
  const shipments: Shipment[] = [];
  
  for (let i = 1; i <= count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    const cargoType = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
    const vessel = vessels[Math.floor(Math.random() * vessels.length)];
    
    // Generate booking date between 1-60 days ago
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 60) - 1);
    
    // Generate departure date after booking date
    const departureDate = new Date(bookingDate);
    departureDate.setDate(departureDate.getDate() + Math.floor(Math.random() * 15) + 5);
    
    // Generate estimated arrival date after departure date
    const estimatedArrivalDate = new Date(departureDate);
    estimatedArrivalDate.setDate(estimatedArrivalDate.getDate() + Math.floor(Math.random() * 30) + 10);
    
    // Generate actual arrival date for completed shipments
    let actualArrivalDate;
    if (status === 'arrived' || status === 'delivered') {
      actualArrivalDate = new Date(estimatedArrivalDate);
      // 50% chance of being delayed by 1-5 days
      if (Math.random() > 0.5) {
        actualArrivalDate.setDate(actualArrivalDate.getDate() + Math.floor(Math.random() * 5) + 1);
      } else {
        // or on time / early by 0-2 days
        actualArrivalDate.setDate(actualArrivalDate.getDate() - Math.floor(Math.random() * 3));
      }
    }
    
    // Generate required documents
    const documents: Document[] = [
      {
        id: `doc-${i}-1`,
        name: 'Bill of Lading',
        type: 'bill_of_lading',
        status: documentStatuses[Math.floor(Math.random() * documentStatuses.length)],
        uploadDate: status !== 'pending' ? new Date(bookingDate).toISOString() : undefined,
        lastUpdated: new Date(bookingDate).toISOString(),
        notes: '',
      },
      {
        id: `doc-${i}-2`,
        name: 'Commercial Invoice',
        type: 'invoice',
        status: documentStatuses[Math.floor(Math.random() * documentStatuses.length)],
        uploadDate: status !== 'pending' ? new Date(bookingDate).toISOString() : undefined,
        lastUpdated: new Date(bookingDate).toISOString(),
        notes: '',
      },
      {
        id: `doc-${i}-3`,
        name: 'Customs Declaration',
        type: 'customs_declaration',
        status: 'required',
        lastUpdated: new Date(bookingDate).toISOString(),
        notes: 'Required for import clearance',
      }
    ];
    
    // Generate shipment events
    const events = [
      {
        id: `event-${i}-1`,
        timestamp: bookingDate.toISOString(),
        description: 'Booking created',
        type: 'status_change' as const,
      }
    ];
    
    if (status !== 'pending' && status !== 'cancelled') {
      events.push({
        id: `event-${i}-2`,
        timestamp: new Date(bookingDate.getTime() + 1000 * 60 * 60 * 24).toISOString(),
        description: 'Booking confirmed',
        type: 'status_change' as const,
      });
    }
    
    if (status === 'in_transit' || status === 'arrived' || status === 'delivered') {
      events.push({
        id: `event-${i}-3`,
        timestamp: departureDate.toISOString(),
        location: origin,
        description: 'Cargo loaded on vessel',
        type: 'location_update' as const,
      });
      
      // Add intermediate location updates for in-transit
      if (status === 'in_transit') {
        const midpointDate = new Date((departureDate.getTime() + estimatedArrivalDate.getTime()) / 2);
        events.push({
          id: `event-${i}-4`,
          timestamp: midpointDate.toISOString(),
          location: 'Mid-ocean',
          description: 'Vessel in transit',
          type: 'location_update' as const,
        });
      }
    }
    
    if (status === 'arrived' || status === 'delivered') {
      events.push({
        id: `event-${i}-5`,
        timestamp: actualArrivalDate?.toISOString() || estimatedArrivalDate.toISOString(),
        location: destination,
        description: 'Vessel arrived at destination',
        type: 'status_change' as const,
      });
    }
    
    if (status === 'delivered') {
      const deliveryDate = new Date(actualArrivalDate || estimatedArrivalDate);
      deliveryDate.setDate(deliveryDate.getDate() + 2);
      events.push({
        id: `event-${i}-6`,
        timestamp: deliveryDate.toISOString(),
        location: destination,
        description: 'Cargo delivered to recipient',
        type: 'status_change' as const,
      });
    }
    
    if (status === 'cancelled') {
      const cancellationDate = new Date(bookingDate);
      cancellationDate.setDate(cancellationDate.getDate() + 2);
      events.push({
        id: `event-${i}-7`,
        timestamp: cancellationDate.toISOString(),
        description: 'Booking cancelled by customer',
        type: 'status_change' as const,
      });
    }
    
    if (status === 'delayed') {
      const delayDate = new Date(departureDate);
      delayDate.setDate(delayDate.getDate() - 1);
      events.push({
        id: `event-${i}-8`,
        timestamp: delayDate.toISOString(),
        description: 'Shipment delayed due to port congestion',
        type: 'status_change' as const,
      });
    }
    
    // Sort events by timestamp
    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    shipments.push({
      id: `ship-${i}`,
      bookingNumber: `CTN${String(10000 + i).padStart(6, '0')}`,
      customer: {
        id: '1',
        name: 'John Customer',
        email: 'customer@example.com',
      },
      status,
      origin,
      destination,
      cargoType,
      cargoWeight: Math.floor(Math.random() * 50) + 5,
      cargoVolume: Math.floor(Math.random() * 100) + 10,
      cargoDescription: `${cargoType} containing various goods`,
      bookingDate: bookingDate.toISOString(),
      departureDate: departureDate.toISOString(),
      estimatedArrivalDate: estimatedArrivalDate.toISOString(),
      actualArrivalDate: actualArrivalDate?.toISOString(),
      documents,
      events,
      vesselName: vessel,
      vesselVoyage: `V${String(Math.floor(Math.random() * 900) + 100)}-E`,
    });
  }
  
  return shipments;
};

// Mock shipments data
const mockShipments = generateMockShipments(10);

// Get all shipments for a user
export const getShipments = async (userId: string): Promise<Shipment[]> => {
  await delay(800);
  return mockShipments;
};

// Get a single shipment by ID
export const getShipmentById = async (shipmentId: string): Promise<Shipment | undefined> => {
  await delay(500);
  return mockShipments.find(shipment => shipment.id === shipmentId);
};

// Create a new shipment booking
export const createBooking = async (bookingData: Partial<Shipment>): Promise<Shipment> => {
  await delay(1000);
  
  const newId = `ship-${mockShipments.length + 1}`;
  const bookingNumber = `CTN${String(10000 + mockShipments.length + 1).padStart(6, '0')}`;
  const now = new Date();
  
  const newShipment: Shipment = {
    id: newId,
    bookingNumber,
    customer: {
      id: '1', // In a real app, this would come from authenticated user
      name: 'John Customer',
      email: 'customer@example.com',
    },
    status: 'pending',
    origin: bookingData.origin || '',
    destination: bookingData.destination || '',
    cargoType: bookingData.cargoType || '',
    cargoWeight: bookingData.cargoWeight || 0,
    cargoVolume: bookingData.cargoVolume || 0,
    cargoDescription: bookingData.cargoDescription || '',
    bookingDate: now.toISOString(),
    departureDate: bookingData.departureDate || '',
    estimatedArrivalDate: bookingData.estimatedArrivalDate || '',
    documents: [
      {
        id: `doc-${newId}-1`,
        name: 'Bill of Lading',
        type: 'bill_of_lading',
        status: 'required',
        lastUpdated: now.toISOString(),
        notes: 'Please upload as soon as possible',
      },
      {
        id: `doc-${newId}-2`,
        name: 'Commercial Invoice',
        type: 'invoice',
        status: 'required',
        lastUpdated: now.toISOString(),
        notes: 'Required for customs clearance',
      },
    ],
    events: [
      {
        id: `event-${newId}-1`,
        timestamp: now.toISOString(),
        description: 'Booking created',
        type: 'status_change',
      }
    ],
    vesselName: bookingData.vesselName || '',
    vesselVoyage: bookingData.vesselVoyage || '',
  };
  
  mockShipments.push(newShipment);
  
  return newShipment;
};

// Upload a document for a shipment
export const uploadDocument = async (
  shipmentId: string, 
  documentId: string, 
  fileData: { name: string; file: File; }
): Promise<Document> => {
  await delay(1500);
  
  const shipment = mockShipments.find(s => s.id === shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }
  
  const document = shipment.documents.find(d => d.id === documentId);
  if (!document) {
    throw new Error('Document not found');
  }
  
  // Update document status
  document.status = 'uploaded';
  document.uploadDate = new Date().toISOString();
  document.lastUpdated = new Date().toISOString();
  document.fileUrl = URL.createObjectURL(fileData.file); // In a real app, this would be a server URL
  
  // Add document upload event
  shipment.events.push({
    id: `event-${shipmentId}-${shipment.events.length + 1}`,
    timestamp: new Date().toISOString(),
    description: `Document ${document.name} uploaded`,
    type: 'document_update',
  });
  
  return document;
};