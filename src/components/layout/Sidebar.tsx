import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  CalendarPlus, 
  AlertCircle, 
  History, 
  FileText, 
  MessageSquare, 
  Users, 
  BarChart3, 
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  if (!user) return null;
  
  // Define navigation links based on user role
  const getNavLinks = () => {
    switch (user.role) {
      case 'customer':
        return [
          { 
            to: '/customer/dashboard', 
            label: 'Dashboard', 
            icon: <LayoutDashboard className="h-5 w-5" />
          },
          { 
            to: '/customer/tracking', 
            label: 'Track Shipments', 
            icon: <Search className="h-5 w-5" />
          },
         /* { 
            to: '/customer/booking', 
            label: 'New Booking', 
            icon: <CalendarPlus className="h-5 w-5" />
          },*/
          { 
            to: '/customer/claims', 
            label: 'Claims', 
            icon: <AlertCircle className="h-5 w-5" />
          },
          { 
            to: '/customer/history', 
            label: 'History', 
            icon: <History className="h-5 w-5" />
          },
        ];
      case 'agent':
        return [
          { 
            to: '/agent/dashboard', 
            label: 'Dashboard', 
            icon: <LayoutDashboard className="h-5 w-5" />
          },
          { 
            to: '/agent/files', 
            label: 'File Management', 
            icon: <FileText className="h-5 w-5" />
          },
          { 
            to: '/agent/messages', 
            label: 'Messages', 
            icon: <MessageSquare className="h-5 w-5" />
          },
        ];
      case 'admin':
        return [
          { 
            to: '/admin/dashboard', 
            label: 'Dashboard', 
            icon: <LayoutDashboard className="h-5 w-5" />
          },
        /*  { 
            to: '/admin/users', 
            label: 'User Management', 
            icon: <Users className="h-5 w-5" />
          },*/ 
          { 
            to: '/admin/reports', 
            label: 'Reports', 
            icon: <BarChart3 className="h-5 w-5" />
          },
        ];
      default:
        return [];
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-20 bg-white shadow-md transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} hidden md:block`}>
      <div className="h-full flex flex-col justify-between">
        <nav className="px-2 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-500'
                }
                transition-colors
              `}
            >
              <span className="mr-3">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;