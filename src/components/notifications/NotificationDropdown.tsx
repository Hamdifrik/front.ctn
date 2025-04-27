import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();
  
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.relatedTo) {
      const { type, id } = notification.relatedTo;
      
      switch (type) {
        case 'shipment':
          navigate(`/customer/tracking/${id}`);
          break;
        case 'booking':
          navigate(`/customer/tracking/${id}`);
          break;
        case 'document':
          navigate(`/customer/tracking/${id}`);
          break;
        case 'claim':
          navigate(`/customer/claims/${id}`);
          break;
        default:
          break;
      }
    }
    
    onClose();
  };
  
  return (
    <div className="bg-white rounded-md shadow-xl max-h-[70vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="px-4 py-3 bg-primary-50 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-700">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
          >
            <Check className="h-3 w-3 mr-1" />
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="max-h-[50vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <Bell className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <li 
                key={notification.id}
                className={`px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  notification.read ? 'bg-white' : 'bg-primary-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-1" onClick={() => handleNotificationClick(notification)}>
                    <p className="text-sm font-medium text-neutral-900">{notification.title}</p>
                    <p className="text-xs text-neutral-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="ml-2 p-1 text-neutral-400 hover:text-error-500 transition-colors"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;