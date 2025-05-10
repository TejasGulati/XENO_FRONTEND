import {
  X,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

const CampaignLogsModal = ({ isOpen, onClose, campaign, logs, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sentAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedLog, setExpandedLog] = useState(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleExpandLog = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {campaign ? `Logs for ${campaign.name}` : 'All Communication Logs'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs by customer or message..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
              </select>
              
              <button className="px-3 py-2 bg-gray-100 rounded-md flex items-center text-gray-600 hover:bg-gray-200">
                <Filter className="h-4 w-4 mr-1" />
                More Filters
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No logs found matching your criteria</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  {!campaign && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                  )}
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sentAt')}
                  >
                    <div className="flex items-center">
                      Sent At
                      {sortBy === 'sentAt' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Preview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map(log => (
                  <>
                    <tr 
                      key={log._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpandLog(log._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                            {log.customer?.name ? log.customer.name.charAt(0).toUpperCase() : 'N'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{log.customer?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{log.customer?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      
                      {!campaign && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{log.campaign?.name || 'N/A'}</div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${log.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                          log.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                          {log.status === 'SENT' && <Clock className="h-3 w-3 mr-1" />}
                          {log.status === 'FAILED' && <XCircle className="h-3 w-3 mr-1" />}
                          {log.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                          {log.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.sentAt).toLocaleString()}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {log.message}
                        </div>
                      </td>
                    </tr>
                    
                    {expandedLog === log._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={campaign ? 4 : 5} className="px-6 py-4">
                          <div className="bg-white p-4 rounded-md border border-gray-200">
                            <h4 className="font-medium text-gray-800 mb-2">Full Message</h4>
                            <div className="whitespace-pre-wrap text-sm text-gray-700 mb-4">
                              {log.message}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-xs font-medium text-gray-500 mb-1">Delivery Details</h5>
                                <div className="text-sm">
                                  <p>Status: <span className={`font-medium ${
                                    log.status === 'DELIVERED' ? 'text-green-600' :
                                    log.status === 'FAILED' ? 'text-red-600' : 'text-blue-600'
                                  }`}>{log.status}</span></p>
                                  <p>Sent: {new Date(log.sentAt).toLocaleString()}</p>
                                  {log.deliveredAt && (
                                    <p>Delivered: {new Date(log.deliveredAt).toLocaleString()}</p>
                                  )}
                                  {log.errorMessage && (
                                    <p>Error: <span className="text-red-600">{log.errorMessage}</span></p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-medium text-gray-500 mb-1">Customer Details</h5>
                                <div className="text-sm">
                                  <p>Name: {log.customer?.name || 'N/A'}</p>
                                  <p>Email: {log.customer?.email || 'N/A'}</p>
                                  {log.customer?.phone && <p>Phone: {log.customer.phone}</p>}
                                  <p>Total Spend: ${log.customer?.totalSpend?.toFixed(2) || '0.00'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{logs.length}</span> logs
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-md text-sm text-white hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignLogsModal;