import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Ship, Calendar, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import axios from 'axios';

// Interface for User
interface User {
  _id: string;
  fullname: string;
  email: string;
}

// Interface for Shipment
interface Shipment {
  _id: string;
  bookingNumber: string;
  origin: string;
  destination: string;
  departdate: string;
  vesselName: string;
  status: string;
  cargotype: string;
  cargokg: string;
  iduser: string;
  fullname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Auth context type
interface AuthContextType {
  user: User | null;
}

const ShipmentTracking: React.FC = () => {
  const { user } = useAuth() as AuthContextType;
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        if (user) {
          // Fetch all shipments like in Dashboard component
          const response = await axios.get<Shipment[]>('http://localhost:3000/shipments');
          
          // Filter shipments to only include those belonging to the current user
          const userShipments = response.data.filter((shipment: Shipment) => shipment.iduser === user._id);
          setShipments(userShipments);
        }
      } catch (err) {
        setError('Failed to load shipments');
        console.error('Error fetching shipments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [user]);

  const filteredShipments = shipments.filter(shipment => {
    if (filter === 'all') return true;
    return shipment.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">My Shipments</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-neutral-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Shipments</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      <Card className="border border-neutral-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Booking #</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Origin - Destination</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Vessel</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Departure Date</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {shipment.bookingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-neutral-400 mr-2" />
                      {shipment.origin} - {shipment.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Ship className="h-4 w-4 text-neutral-400 mr-2" />
                      {shipment.vesselName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-neutral-400 mr-2" />
                      {new Date(shipment.departdate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      shipment.status === 'Pending'
        ? 'bg-yellow-100 text-yellow-800'
        : shipment.status === 'Cancelled'
        ? 'bg-red-100 text-red-800'
        : shipment.status === 'Confirmed'
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    {shipment.status}
  </span>
</td> 
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/customer/tracking/${shipment._id}`}
                      className="text-primary-600 hover:text-primary-900 flex items-center"
                    >
                      Details <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-neutral-500">
                    No shipments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ShipmentTracking;