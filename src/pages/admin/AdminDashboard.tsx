import React, { useEffect, useState } from 'react';
import { 
  Users,
  BarChart2,
  Smile,
  Clock,
  Ship,
  Settings,
  UserPlus,
  FileText,
  Shield,
  Edit,
  Trash2,
  
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AgentForm from './AgentForm';

interface Agent {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [isAgentFormOpen, setIsAgentFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fullname = localStorage.getItem("fullname");
    if (fullname) {
      setCurrentUser(fullname);
    }

  
    

    // Fetch agents from API
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        // Filter to only include agents with role "agent"
        const filteredAgents = data.filter((user: Agent) => user.role === 'agent');
        setAgents(filteredAgents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleCreateAgent = () => {
    console.log('Creating agent');
    // After creating, you might want to refresh the agents list
  };
  const handleRevoke = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to revoke user');
      }
  
      // Filter out the deleted agent from the list
      setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  

  const stats = [
    { title: "Customer Satisfaction", value: "78%", change: "+5%", icon: <Smile className="h-6 w-6" />, trend: 'up' },
    { title: "On-Time Deliveries", value: "92%", change: "+2%", icon: <Clock className="h-6 w-6" />, trend: 'up' },
    { title: "Active Vessels", value: "4/5", change: "Stable", icon: <Ship className="h-6 w-6" />, trend: 'neutral' },
    { title: "Monthly Bookings", value: "147", change: "+18%", icon: <FileText className="h-6 w-6" />, trend: 'up' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Bienvenue, {currentUser}</p>
          <p className="text-gray-400">CTN Operations Overview</p>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">CTN Operations Overview</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => setIsAgentFormOpen(true)}
          >
            New Agent
          </Button>
          <Button variant="outline" leftIcon={<Settings className="h-4 w-4" />}>
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <div className="flex items-end mt-2">
                  <p className="text-2xl font-semibold mr-2">{stat.value}</p>
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'neutral' ? 'text-gray-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${
                stat.trend === 'up' ? 'bg-green-50 text-green-600' :
                stat.trend === 'neutral' ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-600'
              } h-fit`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Agent Management */}
      <Card title="Agent Accounts" className="border border-gray-200">
        {loading ? (
          <div className="p-4 text-center">Loading agents...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.fullname}</div>
                          <div className="text-sm text-gray-500">ID: {agent._id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {agent.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {agent.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(agent.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex space-x-2">
                      {/* Button with edit icon 
                      
                      <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
  Edit
</Button>
                      */}


                        <Button
  variant="outline"
  size="sm"
  leftIcon={<Trash2 className="h-4 w-4" />}
  className="text-red-600 border-red-200 hover:bg-red-50"
  onClick={() => handleRevoke(agent._id)} // Appel de la fonction ici
>
  Revoke
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Logistics Performance" className="border border-gray-200">
          <div className="p-4">
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-md">
              <BarChart2 className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-400">Performance Metrics</p>
              <div className="mt-4 w-full max-w-md">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>On-Time Rate</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Customer Feedback" className="border border-gray-200">
          <div className="p-4">
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-md">
              <Smile className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-400">Customer Satisfaction</p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center w-full max-w-md">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium text-xl">78%</p>
                  <p className="text-xs text-gray-500 mt-1">Satisfied</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-600 font-medium text-xl">15%</p>
                  <p className="text-xs text-gray-500 mt-1">Neutral</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium text-xl">7%</p>
                  <p className="text-xs text-gray-500 mt-1">Unsatisfied</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Tools */}
      <Card title="Administration Tools" className="border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col">
            <Shield className="h-6 w-6 mb-2" />
            <span>Permissions</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <FileText className="h-6 w-6 mb-2" />
            <span>Audit Logs</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <Settings className="h-6 w-6 mb-2" />
            <span>System Config</span>
          </Button>
          <Button variant="outline" className="h-24 flex-col">
            <BarChart2 className="h-6 w-6 mb-2" />
            <span>Reports</span>
          </Button>
        </div>
      </Card>
      
      <AgentForm 
        isOpen={isAgentFormOpen}
        onClose={() => setIsAgentFormOpen(false)}
        onSubmit={handleCreateAgent}
      />
    </div>
  );
};

export default AdminDashboard;