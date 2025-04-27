import React, { useState, useEffect } from 'react';
import { 
  ClipboardList,
  CheckCircle,
  Search,
  Filter,
  Ship,
  Calendar,
  MapPin,
  Box,
  Loader,
  XCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import axios from 'axios';

interface Shipment {
  _id: string;
  bookingNumber: string;
  origin: string;
  departdate: string;
  destination: string;
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

const Dashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Shipment[]>('http://localhost:3000/shipments');
        setShipments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
        console.error('Error fetching shipments:', err);
      }
    };

    fetchShipments();
  }, []);

  const pendingShipments = shipments.filter(s => s.status.toLowerCase() === 'pending').length;
  const confirmedShipments = shipments.filter(s => s.status.toLowerCase() === 'confirmed').length;
  const uniqueVessels = [...new Set(shipments.map(s => s.vesselName))].length;
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // Log des données envoyées
      console.log('Envoi de la requête PUT pour la réservation:', id, 'avec le statut:', newStatus);
  
      // Trouver l'envoi actuel dans l'état local
      const shipmentToUpdate = shipments.find(s => s._id === id);
  
      if (!shipmentToUpdate) {
        alert('Réservation non trouvée');
        return;
      }
  
      // Mettre à jour uniquement le statut tout en préservant les autres propriétés
      const updatedShipment = {
        ...shipmentToUpdate,
        status: newStatus,  // Mettre à jour uniquement le statut
      };
  
      // Envoyer la requête PUT avec toutes les informations mises à jour
      const response = await axios.put(`http://localhost:3000/shipments/${id}`, updatedShipment);
  
      // Mettre à jour localement la liste des réservations après modification
      setShipments(prevShipments =>
        prevShipments.map(s => s._id === id ? { ...s, status: newStatus } : s)
      );
    } catch (err: any) {
      // Afficher l'erreur dans la console pour plus de détails
      console.error('Erreur de mise à jour du statut:', err);
      if (err.response) {
        // Si l'erreur provient de la réponse du backend
        console.error('Détails de l\'erreur:', err.response.data);
      }
      alert('Erreur lors de la mise à jour du statut');
    }
  };
  
  
  

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Tableau de bord Agent CTN</h1>
          <p className="text-neutral-500">Gestion des réservations et opérations logistiques</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
            Filtres
          </Button>
          <Button variant="outline" leftIcon={<Search className="h-4 w-4" />}>
            Rechercher
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Réservations en attente</p>
              <p className="text-2xl font-semibold">{pendingShipments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Réservations confirmées</p>
              <p className="text-2xl font-semibold">{confirmedShipments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Ship className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Navires en opération</p>
              <p className="text-2xl font-semibold">{uniqueVessels}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des réservations */}
      <Card title="Réservations en cours" className="border border-neutral-200">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">N° Réservation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Trajet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Navire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Cargaison</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {shipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{shipment.bookingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      <div>{shipment.fullname}</div>
                      <div className="text-xs text-neutral-500">{shipment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-neutral-400 mr-1" />
                        {shipment.origin} → {shipment.destination}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-neutral-400 mr-1" />
                        <span className="text-xs text-neutral-500">
                          Départ: {new Date(shipment.departdate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{shipment.vesselName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      <div className="flex items-center">
                        <Box className="h-4 w-4 text-neutral-400 mr-1" />
                        {shipment.cargotype}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">{shipment.cargokg} kg</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          leftIcon={<CheckCircle className="h-4 w-4" />}
                          disabled={shipment.status.toLowerCase() === 'confirmed'}
                          onClick={() => handleStatusUpdate(shipment._id, 'Confirmed')}
                        >
                          Valider
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<XCircle className="h-4 w-4" />}
                          disabled={shipment.status.toLowerCase() === 'cancelled'}
                          onClick={() => handleStatusUpdate(shipment._id, 'Cancelled')}
                        >
                          Annuler
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
