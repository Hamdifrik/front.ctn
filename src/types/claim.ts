export type ClaimStatus = 
  | 'draft'          // Being prepared by customer
  | 'submitted'      // Submitted for review
  | 'in_review'      // Being reviewed by agent
  | 'additional_info_requested' // Additional information required
  | 'processing'     // Claim is being processed
  | 'resolved'       // Claim has been resolved
  | 'rejected'       // Claim has been rejected
  | 'closed';        // Claim is closed

export type ClaimType = 
  | 'cargo_damage'      // Damage to cargo
  | 'cargo_loss'        // Loss of cargo
  | 'delay'            // Delay in delivery
  | 'documentation'    // Issues with documentation
  | 'billing'          // Billing or payment issues
  | 'service_quality'  // Service quality complaints
  | 'other';           // Other issues

export interface ClaimComment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'customer' | 'agent' | 'admin';
  timestamp: string;
  message: string;
  attachments?: {
    id: string;
    name: string;
    fileUrl: string;
  }[];
}

export interface Claim {
  id: string;
  claimNumber: string;
  customerId: string;
  customerName: string;
  shipmentId: string;
  bookingNumber: string;
  type: ClaimType;
  status: ClaimStatus;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    agentId: string;
    agentName: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: ClaimComment[];
  attachments?: {
    id: string;
    name: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  resolution?: {
    resolvedAt: string;
    resolvedBy: string;
    resolution: string;
    compensationAmount?: number;
  };
}