import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar,
  MapPin,
  Box,
  ChevronDown,
  Check,
  Ship
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth } from '../../contexts/AuthContext';

interface ShipmentData {
  bookingNumber: string;
  origin: string;
  departdate: string;
  destination: string;
  vesselName: string;
  status: string;
  cargotype: string;
  cargokg: string;
  specialreq: string;
  iduser: string;
  fullname: string;
  email: string;
}

interface BookingFormProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, onSubmitSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    origin: 'Rades',
    destination: '',
    cargotype: 'container',
    cargokg: '',
    vesselName: '',
    departdate: '',
    specialreq: ''
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState('CTN000001');

  // Récupérer le dernier numéro de booking
  useEffect(() => {
    const fetchLastBooking = async () => {
      try {
        const response = await fetch('http://localhost:3000/shipments');
        const data = await response.json();
        if (data.length > 0) {
          const lastNumber = data[data.length - 1].bookingNumber;
          const num = parseInt(lastNumber.replace('CTN', '')) + 1;
          setBookingNumber(`CTN${num.toString().padStart(6, '0')}`);
        }
      } catch (err) {
        console.error('Failed to fetch last booking', err);
      }
    };
    fetchLastBooking();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.destination || !formData.departdate) {
        setError('Veuillez remplir tous les champs obligatoires');
        return false;
      }
      return true;
    }
    
    if (currentStep === 2) {
      if (!formData.cargokg || isNaN(Number(formData.cargokg))) {
        setError('Veuillez entrer un poids valide');
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    if (!validateStep(step)) return;
    
    setStep(prev => {
      const nextStep = prev + 1;
      if (nextStep > 3) return 3; // Ne pas dépasser l'étape 3
      return nextStep;
    });
    setError(null);
  };

  // Fonction pour revenir à l'étape précédente
  const goToPrevStep = () => {
    setStep(prev => {
      const prevStep = prev - 1;
      if (prevStep < 1) return 1; // Ne pas descendre en dessous de l'étape 1
      return prevStep;
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit a booking');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    const shipmentData: ShipmentData = {
      bookingNumber,
      origin: formData.origin,
      departdate: formData.departdate,
      destination: formData.destination,
      vesselName: formData.vesselName || 'Any available',
      status: 'Pending',
      cargotype: formData.cargotype,
      cargokg: formData.cargokg,
      specialreq: formData.specialreq,
      iduser: user._id,
      fullname: user.fullname,
      email: user.email
    };
  
    try {
      const response = await fetch('http://localhost:3000/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create shipment');
      }
  
      // Ajouter un message de succès si besoin
      alert('Réservation créée avec succès!');
      
      // Appeler la fonction de succès
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  const destinations = ['Marseille', 'Gênes', 'Livourne', 'Barcelone'];
  const vessels = ['Ulysse', 'Salambo', 'Amilcar', 'Elyssa'];
  const cargoTypes = [
    { value: 'container', label: 'Conteneur (20/40 pieds)' },
    { value: 'trailer', label: 'Remorque' },
    { value: 'breakbulk', label: 'Vrac' }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl relative border border-neutral-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-neutral-800">New Booking</h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step >= stepNumber ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span className={`text-xs mt-2 ${step >= stepNumber ? 'text-primary-600' : 'text-neutral-500'}`}>
                {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Cargo' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Origin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select destination</option>
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="date"
                    name="departdate"
                    value={formData.departdate}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Cargo Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Box className="h-5 w-5 text-neutral-400" />
                  </div>
                  <select
                    name="cargotype"
                    value={formData.cargotype}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    required
                    disabled={isLoading}
                  >
                    {cargoTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Cargo Weight (kg)
                </label>
                <input
                  type="number"
                  name="cargokg"
                  value={formData.cargokg}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 15000"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Preferred Vessel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Ship className="h-5 w-5 text-neutral-400" />
                  </div>
                  <select
                    name="vesselName"
                    value={formData.vesselName}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    disabled={isLoading}
                  >
                    <option value="">Any available vessel</option>
                    {vessels.map(vessel => (
                      <option key={vessel} value={vessel}>{vessel}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-neutral-50 p-4 rounded-md">
                <h3 className="font-medium text-neutral-800 mb-4">Booking Confirmation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-500">Booking Number</p>
                      <p className="font-medium">{bookingNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Status</p>
                      <p className="font-medium text-primary-600">Pending</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Origin</p>
                      <p>{formData.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Destination</p>
                      <p>{formData.destination || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-500">Departure Date</p>
                      <p>{formatDate(formData.departdate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Cargo Type</p>
                      <p>{cargoTypes.find(t => t.value === formData.cargotype)?.label || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Cargo Weight</p>
                      <p>{formData.cargokg ? `${formData.cargokg} kg` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Vessel</p>
                      <p>{formData.vesselName || 'Any available'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="specialreq"
                  value={formData.specialreq}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-20"
                  placeholder="Any special requirements..."
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
    {step > 1 ? (
      <Button
        type="button"
        variant="outline"
        onClick={goToPrevStep}
        disabled={isLoading}
      >
        Retour
      </Button>
    ) : (
      <div></div>
    )}

    {step < 3 ? (
      <Button
        type="button"
        onClick={goToNextStep}
        disabled={isLoading}
      >
        Suivant
      </Button>
    ) : (
      <Button 
        type="submit"
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            En cours...
          </span>
        ) : 'Confirmer la réservation'}
      </Button>
    )}
  </div>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;