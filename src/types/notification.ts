export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedTo?: {
    type: 'shipment' | 'booking' | 'document' | 'claim';
    id: string;
  };
  createdAt: string;
  read: boolean;
}