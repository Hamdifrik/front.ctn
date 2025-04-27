import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ship, 
  Package, 
  Clock, 
  AlertTriangle, 
  CalendarCheck, 
  BarChart2,
  Plus,
  Search,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getClaims } from '../../services/claimService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import BookingForm from './BookingForm';

// Définition des interfaces pour les types de données
interface User {
  _id: string;
  fullname: string;
  email: string;
}

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

interface Claim {
  id: string;
  claimNumber: string;
  bookingNumber: string;
  subject: string;
  status: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth() as AuthContextType;
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // Fetch all shipments
          const response = await axios.get<Shipment[]>('http://localhost:3000/shipments');
          
          // Filter shipments to only include those belonging to the current user
          const userShipments = response.data.filter((shipment: Shipment) => shipment.iduser === user._id);
          
          // Fetch claims
          const claimData = await getClaims(user._id);
          
          setShipments(userShipments);
          setClaims(claimData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const activeShipments = shipments.filter((s: Shipment) => 
    s.status !== 'delivered' && s.status !== 'cancelled'
  );
  
  const activeClaims = claims.filter((c: Claim) => 
    c.status !== 'resolved' && c.status !== 'closed' && c.status !== 'rejected'
  );
  
  // Count shipments by status
  const shipmentStatusCounts: Record<string, number> = shipments.reduce((acc: Record<string, number>, shipment: Shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {});
  
  // Get upcoming shipments (departing in the next 7 days)
  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);
  
  const upcomingShipments = shipments.filter((shipment: Shipment) => {
    const departureDate = new Date(shipment.departdate);
    return departureDate > now && departureDate <= in7Days;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome, {user?.fullname}</h1>
          <p className="text-neutral-500 mt-1">Here's an overview of your shipments and activities</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="outline"
            leftIcon={<Search className="h-4 w-4" />}
          >
            Track Shipment
          </Button>
          <Button 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowBookingForm(true)}
          >
            New Booking
          </Button>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border border-neutral-200">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <Ship className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Active Shipments</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{activeShipments.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border border-neutral-200">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Package className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Delivered</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{shipmentStatusCounts['delivered'] || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border border-neutral-200">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">In Transit</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{shipmentStatusCounts['in_transit'] || 0}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border border-neutral-200">
            <div className="flex items-start">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Active Claims</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-900">{activeClaims.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Recent shipments section */}
      <Card
        title="Recent Shipments"
        className="border border-neutral-200"
        footer={
          <div className="text-right">
            <Link 
              to="/customer/tracking" 
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-end"
            >
              View all shipments
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Booking #
                </th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Origin - Destination
                </th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Vessel
                </th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Departure Date
                </th>
                <th className="px-6 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {shipments.slice(0, 5).map((shipment: Shipment) => (
                <tr key={shipment._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link to={`/customer/tracking/${shipment._id}`}>
                      {shipment.bookingNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {shipment.origin} - {shipment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {shipment.vesselName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {new Date(shipment.departdate).toLocaleDateString()}
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

                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-500">
                    No shipments found. Start by creating a new booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Upcoming departures and active claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Upcoming Departures"
          subtitle="Shipments departing in the next 7 days"
          className="border border-neutral-200"
        >
          {upcomingShipments.length > 0 ? (
            <ul className="space-y-4">
              {upcomingShipments.map((shipment: Shipment) => (
                <li key={shipment._id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">
                        <Link to={`/customer/tracking/${shipment._id}`} className="hover:text-primary-600">
                          {shipment.bookingNumber} - {shipment.vesselName}
                        </Link>
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {shipment.origin} to {shipment.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <CalendarCheck className="h-4 w-4 text-primary-500 mr-1" />
                        <span className="text-sm font-medium text-neutral-700">
                          {new Date(shipment.departdate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {shipment.cargotype} - {shipment.cargokg} kg
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500">No upcoming departures in the next 7 days</p>
            </div>
          )}
        </Card>
        
        <Card
          title="Active Claims"
          subtitle="Claims that require your attention"
          className="border border-neutral-200"
          footer={
            claims.length > 0 ? (
              <div className="text-right">
                <Link 
                  to="/customer/claims" 
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-end"
                >
                  View all claims
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : null
          }
        >
          {activeClaims.length > 0 ? (
            <ul className="space-y-4">
              {activeClaims.map((claim: Claim) => (
                <li key={claim.id} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">
                        <Link to={`/customer/claims/${claim.id}`} className="hover:text-primary-600">
                          {claim.claimNumber} - {claim.subject.substring(0, 30)}
                          {claim.subject.length > 30 && '...'}
                        </Link>
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        Related to shipment: {claim.bookingNumber}
                      </p>
                    </div>
                    <div>
                      <StatusBadge status={claim.status}  />
                      <p className="text-xs text-right text-neutral-500 mt-1">
                        {new Date(claim.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500">No active claims</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
              >
                File a claim
              </Button>
            </div>
          )}
        </Card>
      </div>
      
      {/* Shipment volume chart */}
      <Card
        title="Shipment Volume"
        subtitle="Overview of your shipment activity"
        className="border border-neutral-200"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Shipment analytics visualization would appear here</p>
            <p className="text-xs text-neutral-400 mt-2">Based on your historical shipping data</p>
          </div>
        </div>
      </Card>

      {showBookingForm && (
        <BookingForm
          onClose={() => setShowBookingForm(false)}
          onSubmitSuccess={() => {
            console.log('New booking created');
            setShowBookingForm(false);
            // Rafraîchir la liste des expéditions après la création d'une nouvelle réservation
            const fetchUpdatedShipments = async () => {
              try {
                if (user) {
                  const response = await axios.get<Shipment[]>('http://localhost:3000/shipments');
                  const userShipments = response.data.filter((shipment: Shipment) => shipment.iduser === user._id);
                  setShipments(userShipments);
                }
              } catch (error) {
                console.error('Error fetching updated shipments:', error);
              }
            };
            fetchUpdatedShipments();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;