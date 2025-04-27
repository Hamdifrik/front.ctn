import { Claim, ClaimStatus, ClaimType, ClaimComment } from '../types/claim';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a random date within the last 60 days
const getRandomDate = (daysAgo = 60) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate mock claims
const generateMockClaims = (count: number): Claim[] => {
  const statuses: ClaimStatus[] = [
    'draft', 'submitted', 'in_review', 'additional_info_requested', 
    'processing', 'resolved', 'rejected', 'closed'
  ];
  const types: ClaimType[] = [
    'cargo_damage', 'cargo_loss', 'delay', 'documentation', 
    'billing', 'service_quality', 'other'
  ];
  const priorities = ['low', 'medium', 'high', 'urgent'] as const;
  
  const claims: Claim[] = [];
  
  for (let i = 1; i <= count; i++) {
    const createdAt = getRandomDate();
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 5));
    
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    // Generate subject based on type
    let subject = '';
    switch (type) {
      case 'cargo_damage':
        subject = 'Damaged cargo container reported on arrival';
        break;
      case 'cargo_loss':
        subject = 'Missing items from shipment';
        break;
      case 'delay':
        subject = 'Significant delay in shipment arrival';
        break;
      case 'documentation':
        subject = 'Issues with bill of lading documentation';
        break;
      case 'billing':
        subject = 'Disputed charges on invoice';
        break;
      case 'service_quality':
        subject = 'Poor handling of cargo during loading';
        break;
      case 'other':
        subject = 'General inquiry about shipment process';
        break;
    }
    
    // Generate comments
    const commentCount = Math.floor(Math.random() * 4) + 1;
    const comments: ClaimComment[] = [];
    
    for (let j = 1; j <= commentCount; j++) {
      const commentDate = new Date(createdAt);
      commentDate.setDate(commentDate.getDate() + j);
      
      let userRole: 'customer' | 'agent' | 'admin';
      let userId: string;
      let userName: string;
      
      if (j === 1) {
        // First comment is always from customer
        userRole = 'customer';
        userId = '1';
        userName = 'John Customer';
      } else {
        // Subsequent comments alternate between agent and customer
        if (j % 2 === 0) {
          userRole = 'agent';
          userId = '2';
          userName = 'Sarah Agent';
        } else {
          userRole = 'customer';
          userId = '1';
          userName = 'John Customer';
        }
      }
      
      comments.push({
        id: `comment-${i}-${j}`,
        userId,
        userName,
        userRole,
        timestamp: commentDate.toISOString(),
        message: getRandomCommentMessage(userRole, type, status, j),
        attachments: j === 1 && type === 'cargo_damage' ? [
          {
            id: `attach-${i}-${j}`,
            name: 'damage_photo.jpg',
            fileUrl: 'https://i.pravatar.cc/300', // Placeholder for a real image URL
          }
        ] : undefined,
      });
    }
    
    // Generate resolution for resolved claims
    let resolution;
    if (status === 'resolved' || status === 'closed') {
      const resolvedAt = new Date(updatedAt);
      resolvedAt.setDate(resolvedAt.getDate() + 1);
      
      resolution = {
        resolvedAt: resolvedAt.toISOString(),
        resolvedBy: 'Sarah Agent',
        resolution: type === 'cargo_damage' || type === 'cargo_loss' 
          ? 'Claim approved. Compensation has been processed.'
          : 'Issue has been resolved to customer satisfaction.',
        compensationAmount: type === 'cargo_damage' || type === 'cargo_loss'
          ? Math.floor(Math.random() * 2000) + 500
          : undefined,
      };
    }
    
    claims.push({
      id: `claim-${i}`,
      claimNumber: `CLM${String(10000 + i).padStart(6, '0')}`,
      customerId: '1',
      customerName: 'John Customer',
      shipmentId: `ship-${i}`,
      bookingNumber: `CTN${String(10000 + i).padStart(6, '0')}`,
      type,
      status,
      subject,
      description: getClaimDescription(type),
      createdAt,
      updatedAt: updatedAt.toISOString(),
      assignedTo: status !== 'draft' ? {
        agentId: '2',
        agentName: 'Sarah Agent',
      } : undefined,
      priority,
      comments,
      attachments: type === 'cargo_damage' ? [
        {
          id: `file-${i}-1`,
          name: 'damage_evidence.jpg',
          fileUrl: 'https://i.pravatar.cc/300', // Placeholder for a real image URL
          uploadedAt: createdAt,
        }
      ] : undefined,
      resolution,
    });
  }
  
  return claims;
};

// Helper to generate random comment messages
const getRandomCommentMessage = (
  userRole: 'customer' | 'agent' | 'admin',
  type: ClaimType,
  status: ClaimStatus,
  commentIndex: number
): string => {
  if (userRole === 'customer') {
    if (commentIndex === 1) {
      switch (type) {
        case 'cargo_damage':
          return "I received my shipment today and noticed significant damage to several items. I have attached photos showing the condition.";
        case 'cargo_loss':
          return "After checking my delivery, I have found that several items are missing from the shipment. The full list is detailed in the attached inventory.";
        case 'delay':
          return "My shipment was supposed to arrive 5 days ago, but it still has not been delivered. This delay is causing significant problems for my business.";
        case 'documentation':
          return "There appear to be errors in the documentation that have caused delays at customs. Can someone please review and correct these issues?";
        case 'billing':
          return "I believe I have been overcharged for this shipment. The invoice amount does not match our agreed rate.";
        case 'service_quality':
          return "I am very dissatisfied with the handling of my shipment. The customer service representative was unhelpful and could not provide clear information.";
        default:
          return "I have an issue with my recent shipment and would appreciate your assistance in resolving it.";
      }
    } else {
      const responses = [
        "Thank you for looking into this matter.",
        "I appreciate your help with resolving this issue.",
        "Could you please provide an update on the status of my claim?",
        "I have just provided the additional information you requested.",
        "When can I expect to receive compensation for the damaged goods?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  } else { // Agent responses
    if (status === 'submitted' || status === 'in_review') {
      return "Thank you for submitting your claim. We have started our investigation and will keep you updated on our progress.";
    } else if (status === 'additional_info_requested') {
      return "We need some additional information to process your claim. Could you please provide more details about the issue and any supporting documentation?";
    } else if (status === 'processing') {
      return "Your claim is currently being processed. We have escalated this to our specialized team and expect to have a resolution for you shortly.";
    } else if (status === 'resolved' || status === 'closed') {
      return "We have completed our investigation. Please see the resolution details for information on compensation or next steps.";
    } else if (status === 'rejected') {
      return "After careful review, we regret to inform you that your claim has been rejected. Please refer to our terms of service regarding the limitations of our liability in such cases.";
    } else {
      return "We are reviewing your claim and will get back to you as soon as possible. Thank you for your patience.";
    }
  }
};

// Helper to generate claim descriptions
const getClaimDescription = (type: ClaimType): string => {
  switch (type) {
    case 'cargo_damage':
      return "Multiple items in my shipment were damaged during transit. The outer packaging showed signs of rough handling, and several items inside were broken. I need compensation for the damaged goods.";
    case 'cargo_loss':
      return "According to my inventory, several items are missing from the delivered shipment. I have checked all packages thoroughly, and these items were not included despite being listed on the bill of lading.";
    case 'delay':
      return "My shipment has been significantly delayed beyond the estimated delivery date. This delay has caused disruption to my business operations and resulted in financial losses due to inability to fulfill customer orders.";
    case 'documentation':
      return "There appear to be errors in the shipping documentation that have caused the shipment to be held at customs. The country of origin is incorrectly listed, and the HS codes do not match the actual contents.";
    case 'billing':
      return "I believe I have been incorrectly charged for this shipment. The invoice shows charges for premium shipping services that I did not request, and the weight calculation appears to be incorrect.";
    case 'service_quality':
      return "I am dissatisfied with the level of service I received throughout this shipping process. Communication was poor, tracking information was inaccurate, and customer service representatives were unable to resolve my concerns.";
    default:
      return "I have an issue with my recent shipment that does not fall into the standard categories. Please review the details and advise on how to proceed.";
  }
};

// Mock claims data
const mockClaims = generateMockClaims(7);

// Get all claims for a user
export const getClaims = async (userId: string): Promise<Claim[]> => {
  await delay(800);
  return mockClaims;
};

// Get a single claim by ID
export const getClaimById = async (claimId: string): Promise<Claim | undefined> => {
  await delay(500);
  return mockClaims.find(claim => claim.id === claimId);
};

// Create a new claim
export const createClaim = async (claimData: Partial<Claim>): Promise<Claim> => {
  await delay(1000);
  
  const now = new Date();
  const newId = `claim-${mockClaims.length + 1}`;
  const claimNumber = `CLM${String(10000 + mockClaims.length + 1).padStart(6, '0')}`;
  
  const newClaim: Claim = {
    id: newId,
    claimNumber,
    customerId: '1', // In a real app, this would come from the authenticated user
    customerName: 'John Customer',
    shipmentId: claimData.shipmentId || '',
    bookingNumber: claimData.bookingNumber || '',
    type: claimData.type || 'other',
    status: 'draft',
    subject: claimData.subject || '',
    description: claimData.description || '',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    priority: claimData.priority || 'medium',
    comments: [
      {
        id: `comment-${newId}-1`,
        userId: '1',
        userName: 'John Customer',
        userRole: 'customer',
        timestamp: now.toISOString(),
        message: claimData.description || 'Initial claim description',
      }
    ],
    attachments: claimData.attachments || [],
  };
  
  mockClaims.push(newClaim);
  
  return newClaim;
};

// Update a claim
export const updateClaim = async (claimId: string, updates: Partial<Claim>): Promise<Claim> => {
  await delay(800);
  
  const claim = mockClaims.find(c => c.id === claimId);
  if (!claim) {
    throw new Error('Claim not found');
  }
  
  // Update claim fields
  Object.assign(claim, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  
  return claim;
};

// Add a comment to a claim
export const addComment = async (
  claimId: string, 
  commentData: { userId: string; userName: string; userRole: 'customer' | 'agent' | 'admin'; message: string; attachments?: any[] }
): Promise<ClaimComment> => {
  await delay(600);
  
  const claim = mockClaims.find(c => c.id === claimId);
  if (!claim) {
    throw new Error('Claim not found');
  }
  
  const newComment: ClaimComment = {
    id: `comment-${claimId}-${claim.comments.length + 1}`,
    timestamp: new Date().toISOString(),
    ...commentData,
  };
  
  claim.comments.push(newComment);
  claim.updatedAt = new Date().toISOString();
  
  return newComment;
};