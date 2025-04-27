import React, { useState } from 'react';
import { 
  X,
  User,
  Mail,
  Key,
  ChevronDown,
  Briefcase,
  Phone
} from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

interface AgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: AgentData) => void;
}

interface AgentData {
  fullname: string;
  email: string;
  action: string;
  phone: string;
  password: string;
}

const AgentForm: React.FC<AgentFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AgentData>({
    fullname: '',
    email: '',
    action: 'logistics_agent',
    phone: '',
    password: generateTemporaryPassword()
  });

  function generateTemporaryPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Préparer les données à envoyer à l'API
    const agentData = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      role: "agent", // Toujours définir le rôle comme "agent"
      action: formData.action,
      phone: formData.phone
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'agent');
      }

      const result = await response.json();
      onSubmit(result); // Passer les données à la fonction parent si nécessaire
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      // Gérer l'erreur (afficher un message à l'utilisateur, etc.)
    }
  };

  const actions = [
    { value: 'logistics_agent', label: 'Logistics Agent' },
    { value: 'export_manager', label: 'Export Manager' },
    { value: 'import_supervisor', label: 'Import Supervisor' },
    { value: 'shipping_coordinator', label: 'Shipping Coordinator' }
  ];

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Agent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="action"
                value={formData.action}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required
              >
                {actions.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, password: generateTemporaryPassword() }))}
                className="absolute right-2 top-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Regenerate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Agent will be required to change this on first login</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Agent
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AgentForm;
