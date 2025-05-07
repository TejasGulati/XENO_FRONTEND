import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  PlusCircle, 
  UserPlus,
  Mail,
  Phone,
  DollarSign,
  ChevronDown,
  Filter
} from 'lucide-react';

const Customers = () => {
  const { customers, loading, error, deleteCustomer } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <p className="text-red-800">Error: {error}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 bg-gray-100 rounded-md flex items-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            <select className="px-3 py-2 bg-gray-100 rounded-md text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'name' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'name' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'email' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalSpend')}
                >
                  <div className="flex items-center">
                    Total Spend
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'totalSpend' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'totalSpend' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">Customer ID: #{customer._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                      {customer.totalSpend.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => deleteCustomer(customer._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{customers.length}</span> customers
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-md text-sm text-white hover:bg-blue-700 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;