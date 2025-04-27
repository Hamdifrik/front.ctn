import React from 'react';
import { Ship } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-800 text-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ship className="h-6 w-6 text-accent-500" />
              <span className="font-heading font-bold text-lg text-white">CTN e-Services</span>
            </div>
            <p className="text-sm text-neutral-400 mb-4">
              Simplifying import/export procedures, improving communication, and optimizing shipment tracking for our valued customers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">Track Shipment</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">New Booking</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">Support</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-neutral-400">Port of Carthage, Tunis</li>
              <li className="text-neutral-400">+216 71 123 456</li>
              <li><a href="mailto:contact@ctn.com.tn" className="text-neutral-400 hover:text-accent-500 transition-colors">contact@ctn.com.tn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            &copy; {currentYear} CTN. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
              Terms
            </a>
            <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-neutral-400 hover:text-accent-500 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;