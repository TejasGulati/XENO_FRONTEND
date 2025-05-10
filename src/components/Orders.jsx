import { useState, useEffect } from 'react';
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
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  BarChart2,
  ArrowUpDown,
  Sliders,
  X
} from 'lucide-react';
import OrderModal from './OrderModal';

const Orders = () => {
  const { 
    orders, 
    customers, 
    loading, 
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    fetchAllData
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState('all');
  
  const filteredOrders = orders.filter(order => {
    const orderId = order?._id?.toLowerCase() || '';
    const customerName = order?.customer?.name?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = orderId.includes(searchTermLower) || customerName.includes(searchTermLower);
    const matchesStatus = statusFilter === 'all' || order?.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(order.orderDate).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && (new Date() - new Date(order.orderDate)) < 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'month' && (new Date() - new Date(order.orderDate)) < 30 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleEdit = (order) => {
    setCurrentOrder(order);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentOrder(null);
    setShowModal(true);
  };

  const handleSubmit = async (orderData) => {
    try {
      if (currentOrder) {
        await updateOrder(currentOrder._id, orderData);
      } else {
        await addOrder(orderData);
      }
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  // Add this function to handle CSV export in the Orders component
  const exportOrdersToCSV = () => {
    // If no orders to export, show alert and return
    if (filteredOrders.length === 0) {
      alert('No orders to export');
      return;
    }
    
    // CSV header row
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Order Amount',
      'Status',
      'Order Date',
      'ID'
    ];
    
    // Format order data for CSV
    const csvData = filteredOrders.map(order => [
      // Escape quotes in text fields to prevent CSV formatting issues
      `"${order._id ? order._id.slice(-6) : 'N/A'}"`,
      `"${(order.customer?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${(order.customer?.email || 'No email').replace(/"/g, '""')}"`,
      order.orderAmount ? order.orderAmount.toFixed(2) : '0.00',
      order.status || 'Unknown',
      order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown date',
      order._id
    ]);
    
    // Add header row to the beginning
    const allRows = [headers, ...csvData];
    
    // Convert to CSV format
    const csvContent = allRows.map(row => row.join(',')).join('\n');
    
    // Create a blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `orders-export-${timestamp}.csv`;
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    // Add to document, trigger download and cleanup
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
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
      <OrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        order={currentOrder}
        customers={customers}
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-xl mr-3">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-sm text-gray-500">Manage customer orders and transactions</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium"
            onClick={handleAdd}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Order
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sliders className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg flex items-center text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={exportOrdersToCSV}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {currentOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('_id')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortBy === '_id' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
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
                      <DollarSign className="h-4 w-4 mr-1" />
                      Amount
                      {sortBy === 'orderAmount' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('orderDate')}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                      {sortBy === 'orderDate' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <ShoppingBag className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{order._id ? order._id.slice(-6) : 'N/A'}</p>
                          <p className="text-xs text-gray-500">ID: #{order._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                          {order.customer?.name ? order.customer.name.charAt(0).toUpperCase() : 'N'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.customer?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        ₹{order.orderAmount ? order.orderAmount.toFixed(2) : '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                        {order.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {order.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => handleEdit(order)}
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(order._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No orders found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or create a new order</p>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={handleAdd}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Order
              </button>
            </div>
          )}
        </div>
        
        {currentOrders.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Showing <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-medium">{filteredOrders.length}</span> orders
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className={`px-3 py-1 border rounded-md text-sm flex items-center ${
                  currentPage === 1 
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors'
                }`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <div className="text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages || 1}
              </div>
              <button 
                className={`px-3 py-1 border rounded-md text-sm flex items-center ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 transition-colors'
                }`}
                onClick={nextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;