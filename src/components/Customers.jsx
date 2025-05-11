// src/components/Customers.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  ChevronDown,
  ChevronLeft,
  Activity,
  ChevronRight,
  User,
  Mail,
  Phone,
  DollarSign,
  CalendarDays,
  RefreshCw,
  ArrowUpDown,
  Sliders,
  Download,
  XCircle,
  CheckCircle,
  Clock,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import CustomerModal from './CustomerModal';

const Customers = () => {
  const { 
    customers, 
    loading, 
    error, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    fetchAllData
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);

  const filteredCustomers = [
    ...pendingCustomers,
    ...customers.filter(customer => {
      if (customer._isDeleted) return false;
      
      const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && customer.lastVisit && new Date(customer.lastVisit) > new Date(Date.now() - 30*24*60*60*1000)) ||
        (statusFilter === 'inactive' && (!customer.lastVisit || new Date(customer.lastVisit) <= new Date(Date.now() - 30*24*60*60*1000)));
      
      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'today' && customer.lastVisit && new Date(customer.lastVisit).toDateString() === new Date().toDateString()) ||
        (dateFilter === 'week' && customer.lastVisit && (new Date() - new Date(customer.lastVisit)) < 7 * 24 * 60 * 60 * 1000) ||
        (dateFilter === 'month' && customer.lastVisit && (new Date() - new Date(customer.lastVisit)) < 30 * 24 * 60 * 60 * 1000);
      
      return matchesSearch && matchesStatus && matchesDate;
    })
  ].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    setPendingCustomers([]);
  }, [customers]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentCustomer(null);
    setShowModal(true);
  };

  const handleSubmit = async (customerData) => {
    try {
      setSubmitting(true);
      const tempId = `temp-${Date.now()}`;
      const tempCustomer = { 
        ...customerData,
        _id: tempId,
        createdAt: new Date().toISOString(),
        lastVisit: customerData.lastVisit || new Date().toISOString()
      };
      
      setPendingCustomers(prev => [...prev, tempCustomer]);
      
      if (currentCustomer) {
        await updateCustomer(currentCustomer._id, customerData);
      } else {
        await addCustomer(customerData);
      }
      
      await fetchAllData();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting customer:', error);
      setPendingCustomers(prev => prev.filter(c => c._id !== tempId));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (id.startsWith('temp-')) {
        setPendingCustomers(prev => prev.filter(c => c._id !== id));
        return;
      }
      
      const customerToDelete = customers.find(c => c._id === id);
      if (customerToDelete) {
        setPendingCustomers(prev => [...prev, {...customerToDelete, _isDeleted: true}]);
      }
      
      await deleteCustomer(id);
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setPendingCustomers(prev => prev.filter(c => c._id !== id || !c._isDeleted));
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchAllData();
      setPendingCustomers([]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const exportCustomersToCSV = async () => {
    try {
      setExportLoading(true);
      
      if (filteredCustomers.length === 0) {
        setExportLoading(false);
        alert('No customers to export');
        return;
      }
      
      const headers = [
        '"Customer Name"',
        '"Email"',
        '"Phone"',
        '"Total Spend"',
        '"Last Visit"',
        '"Status"',
        '"ID"'
      ];
      
      const csvData = filteredCustomers.map(customer => {
        if (customer._isDeleted) return null;
        
        const name = customer.name ? customer.name.replace(/"/g, '""') : 'Unknown';
        const email = customer.email ? customer.email.replace(/"/g, '""') : 'N/A';
        const phone = customer.phone ? customer.phone.replace(/"/g, '""') : 'N/A';
        
        const totalSpend = customer.totalSpend ? 
          `"₹${customer.totalSpend.toLocaleString('en-IN')}"` : '"₹0"';
          
        const lastVisitDate = customer.lastVisit ? 
          `"${new Date(customer.lastVisit).toLocaleDateString('en-IN')}"` : '"No data"';
          
        const status = customer.lastVisit && 
          new Date(customer.lastVisit) > new Date(Date.now() - 30*24*60*60*1000) ? 
          '"Active"' : '"Inactive"';
          
        return [
          `"${name}"`,
          `"${email}"`,
          `"${phone}"`,
          totalSpend,
          lastVisitDate,
          status,
          `"${customer._id}"`
        ].join(',');
      }).filter(row => row !== null);
      
      const allRows = [headers.join(','), ...csvData];
      const csvContent = allRows.join('\r\n');
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;
      
      const blob = new Blob([csvContentWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `customers-export-${timestamp}.csv`;
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExportLoading(false);
      }, 100);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setExportLoading(false);
      alert('Error exporting customer data. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-700">Loading customers...</span>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex items-center">
        <XCircle className="h-6 w-6 text-red-500 mr-3" />
        <p className="text-red-800">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <CustomerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        customer={currentCustomer}
        isSubmitting={submitting}
      />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-xl mr-3">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
            <p className="text-sm text-gray-500">Manage your customer database and segments</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium"
            onClick={handleAdd}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Customer
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
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name or email..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
                className={`px-3 py-2 bg-white border border-gray-300 rounded-lg flex items-center text-gray-600 hover:bg-gray-50 transition-colors ${exportLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={exportCustomersToCSV}
                disabled={exportLoading}
              >
                {exportLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredCustomers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Customer Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                      {sortBy === 'email' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('totalSpend')}
                  >
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Total Spend
                      {sortBy === 'totalSpend' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastVisit')}
                  >
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Last Activity
                      {sortBy === 'lastVisit' && (
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
                {currentCustomers.map(customer => {
                  if (customer._isDeleted) return null;
                  
                  const isPending = customer._id && customer._id.startsWith('temp-');
                  const displayId = customer._id ? customer._id.slice(-6) : 'N/A';
                  
                  return (
                    <tr key={customer._id || Math.random()} className={`hover:bg-gray-50 transition-colors ${isPending ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`${isPending ? 'bg-blue-200' : 'bg-blue-100'} p-2 rounded-lg mr-3`}>
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {isPending ? '(Saving...)' : customer.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">ID: #{displayId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{customer.email || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">{customer.phone || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            ₹{customer.totalSpend ? customer.totalSpend.toLocaleString('en-IN') : '0'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {customer.lastVisit ? (
                            <>
                              <span className="text-sm text-gray-500 mr-2">
                                {new Date(customer.lastVisit).toLocaleDateString()}
                              </span>
                              <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                                new Date(customer.lastVisit) > new Date(Date.now() - 30*24*60*60*1000) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isPending && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                                {!isPending && new Date(customer.lastVisit) > new Date(Date.now() - 30*24*60*60*1000) 
                                  ? 'Active' 
                                  : 'Inactive'}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button 
                            className={`p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isPending && handleEdit(customer)}
                            title="Edit"
                            disabled={isPending}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="p-1 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => customer._id && handleDelete(customer._id)}
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No customers found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or add a new customer</p>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={handleAdd}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Customer
              </button>
            </div>
          )}
        </div>
        
        {filteredCustomers.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)}</span> of <span className="font-medium">{filteredCustomers.length}</span> customers
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

export default Customers;