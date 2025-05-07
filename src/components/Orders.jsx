import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Calendar,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const Orders = () => {
  const { orders, loading, error } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Get order count by status
  const orderCounts = {
    all: orders.length,
    completed: orders.filter(order => order.status === 'completed').length,
    pending: orders.filter(order => order.status === 'pending').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
  };

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
      <div className="flex">
        <XCircle className="h-6 w-6 text-red-500 mr-3" />
        <p className="text-red-800">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md">
          <Download className="h-5 w-5 mr-2" />
          Export
        </button>
      </div>
      
      {/* Status Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <StatusTab 
            label="All Orders" 
            count={orderCounts.all} 
            active={statusFilter === 'all'} 
            onClick={() => setStatusFilter('all')} 
          />
          <StatusTab 
            label="Completed" 
            count={orderCounts.completed} 
            active={statusFilter === 'completed'} 
            onClick={() => setStatusFilter('completed')} 
            icon={<CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
          />
          <StatusTab 
            label="Pending" 
            count={orderCounts.pending} 
            active={statusFilter === 'pending'} 
            onClick={() => setStatusFilter('pending')} 
            icon={<Clock className="h-4 w-4 text-yellow-500 mr-1" />}
          />
          <StatusTab 
            label="Cancelled" 
            count={orderCounts.cancelled} 
            active={statusFilter === 'cancelled'} 
            onClick={() => setStatusFilter('cancelled')} 
            icon={<XCircle className="h-4 w-4 text-red-500 mr-1" />}
          />
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders by ID or customer..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select 
                className="pl-3 pr-8 py-2 bg-gray-100 rounded-md text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <button className="px-3 py-2 bg-gray-100 rounded-md flex items-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('_id')}
                >
                  <div className="flex items-center">
                    Order ID
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === '_id' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === '_id' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'orderAmount' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'orderAmount' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderDate')}
                >
                  <div className="flex items-center">
                    Date
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'orderDate' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'orderDate' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1.5 rounded-md mr-3">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">#{order._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                          {order.customer?.name ? order.customer.name.charAt(0).toUpperCase() : 'N'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.customer?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {order.orderAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                        {order.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {order.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg">No orders found matching your criteria</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-md text-sm text-white hover:bg-blue-700 transition-colors flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status Tab Component
const StatusTab = ({ label, count, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    {icon}
    {label}
    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
      active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {count}
    </span>
  </button>
);

export default Orders;