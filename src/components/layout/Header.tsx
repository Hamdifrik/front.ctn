import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ship, Bell, User, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowNotifications(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-primary-500 text-white fixed top-0 left-0 right-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to={user ? `/${user.role}/dashboard` : '/'}
              className="flex items-center space-x-2"
            >
              <Ship className="h-8 w-8 text-accent-500" />
              <span className="font-heading font-bold text-lg md:text-xl">CTN e-Services</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              {/* Desktop navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-primary-600 transition-colors relative"
                    onClick={toggleNotifications}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent-500 text-primary-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden z-40">
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-primary-600 transition-colors"
                    onClick={toggleUserMenu}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden lg:block">{user.fullname}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-40">
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm text-neutral-700">Connecté en tant que</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">{user.role}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  className="p-2 rounded-md hover:bg-primary-600 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && user && (
        <div className="md:hidden border-t border-primary-400 bg-primary-600 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-4 py-3 border-b border-primary-500">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-400 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.fullname}</p>
                  <p className="text-xs text-primary-200">{user.email}</p>
                  <p className="text-xs text-primary-300 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            
            <button
              className="w-full flex items-center space-x-2 px-3 py-2 text-base text-white hover:bg-primary-500 rounded-md"
              onClick={toggleNotifications}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-accent-500 text-primary-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <button
              className="w-full flex items-center space-x-2 px-3 py-2 text-base text-white hover:bg-primary-500 rounded-md"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
          
          {showNotifications && (
            <div className="px-2 py-3 bg-white">
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;