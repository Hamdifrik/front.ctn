import React, { useState, useEffect } from 'react';
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

interface EditAgentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentData: AgentData) => void;
  userToEdit?: AgentData; // Added userToEdit to pass user data for editing
}

interface AgentData {
  _id: string;
  fullname: string;
  email: string;
  action: string;
  phone: string;
  password: string;
}

const EditAgent: React.FC<EditAgentProps> = ({ isOpen, onClose, onSubmit, userToEdit }) => {
  // If a user is passed, pre-fill the form with their data
  const [formData, setFormData] = useState<AgentData>({
    _id: '',
    fullname: '',
    email: '',
    action: 'logistics_agent',
    phone: '',
    password: ''
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/users/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          action: formData.action,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      onSubmit(updatedUser); // Notify parent component with the updated user data
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Action</label>
          <select name="action" value={formData.action} onChange={handleChange}>
            <option value="logistics_agent">Logistics Agent</option>
            <option value="import_supervisor">Import Supervisor</option>
            <option value="export_manager">Export Manager</option>
            <option value="shipping_coordinator">Shipping Coordinator</option>
          </select>
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </Modal>
  );
};

export default EditAgent;
