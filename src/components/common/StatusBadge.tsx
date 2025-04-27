import React from 'react';

type StatusType = 
  // Shipment statuses
  | 'pending'
  | 'confirmed'
  | 'in_transit'
  | 'arrived'
  | 'delivered'
  | 'cancelled'
  | 'delayed'
  // Document statuses
  | 'required'
  | 'uploaded'
  | 'processing'
  | 'approved'
  | 'rejected'
  // Claim statuses
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'additional_info_requested'
  | 'resolved'
  | 'closed'
  | (string & {});


interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  // Define color schemes for different status types
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      // Positive statuses
      case 'approved':
      case 'delivered':
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      
      // Warning statuses
      case 'pending':
      case 'confirmed':
      case 'in_transit':
      case 'processing':
      case 'in_review':
      case 'draft':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      
      // Neutral statuses
      case 'arrived':
      case 'uploaded':
      case 'required':
        return 'bg-blue-100 text-blue-800';
      
      // Negative statuses
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      
      // Attention statuses
      case 'delayed':
      case 'additional_info_requested':
        return 'bg-orange-100 text-orange-800';
        
      
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format status label for display
  const formatStatusLabel = (status: StatusType) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Determine size-based classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  }[size];
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${getStatusStyles(status)}`}>
      {formatStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;