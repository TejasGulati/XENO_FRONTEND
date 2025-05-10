import React from 'react';
import {
  X,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  List,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  AlertTriangle,
  BarChart2,
  PieChart,
  Download,
  Sliders,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';

const CampaignLogsModal = ({ isOpen, onClose, campaign, logs, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sentAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedLog, setExpandedLog] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(log.sentAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && (new Date() - new Date(log.sentAt)) < 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'month' && (new Date() - new Date(log.sentAt)) < 30 * 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesStatus && matchesDate;
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

  const stats = {
    total: logs.length,
    delivered: logs.filter(log => log.status === 'DELIVERED').length,
    failed: logs.filter(log => log.status === 'FAILED').length,
    pending: logs.filter(log => log.status === 'PENDING').length,
    deliveryRate: logs.length > 0 ? 
      Math.round((logs.filter(log => log.status === 'DELIVERED').length / logs.length) * 100) : 0
  };

  // Add this function to handle CSV export for logs
  const exportLogsToCSV = () => {
    // If no logs to export, show alert and return
    if (filteredLogs.length === 0) {
      alert('No logs to export');
      return;
    }
    
    // CSV header row
    const headers = [
      'Customer Name',
      'Customer Email',
      'Status',
      'Sent At',
      'Delivered At',
      'Message',
      'Error Message',
      'Campaign',
      'ID'
    ];
    
    // Format log data for CSV
    const csvData = filteredLogs.map(log => [
      // Escape quotes in text fields to prevent CSV formatting issues
      `"${(log.customer?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${(log.customer?.email || 'N/A').replace(/"/g, '""')}"`,
      log.status,
      new Date(log.sentAt).toLocaleString(),
      log.deliveredAt ? new Date(log.deliveredAt).toLocaleString() : 'N/A',
      `"${(log.message || '').replace(/"/g, '""')}"`,
      `"${(log.errorMessage || '').replace(/"/g, '""')}"`,
      `"${(log.campaign?.name || 'N/A').replace(/"/g, '""')}"`,
      log._id
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
    const filename = campaign 
      ? `campaign-logs-${campaign.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.csv`
      : `all-communication-logs-${timestamp}.csv`;
    
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {campaign ? `Logs for ${campaign.name}` : 'All Communication Logs'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {campaign ? `Audience: ${campaign.audienceSize.toLocaleString()} customers` : ''}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs by customer or message..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  aria-label="Filter by date"
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
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 flex items-center ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Table View"
                  aria-label="Switch to table view"
                  aria-pressed={viewMode === 'table'}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('stats')}
                  className={`px-3 py-2 flex items-center ${viewMode === 'stats' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  title="Statistics View"
                  aria-label="Switch to statistics view"
                  aria-pressed={viewMode === 'stats'}
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
                <button 
                  className="px-3 py-2 flex items-center text-gray-600 hover:bg-gray-50" 
                  title="Export Data"
                  aria-label="Export data"
                  onClick={exportLogsToCSV}
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-600">Loading communication logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center p-8 max-w-md">
                <div className="bg-gray-50 rounded-full p-3 inline-flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No matching logs found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset filters
                </button>
              </div>
            </div>
          ) : viewMode === 'stats' ? (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                Delivery Statistics
              </h3>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Total Messages</h4>
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Delivered</h4>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.delivered}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% success rate
                  </p>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Failed</h4>
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.failed}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}% failure rate
                  </p>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${stats.total > 0 ? (stats.failed / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Pending</h4>
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% pending
                  </p>
                  <div className="h-1 w-full bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Status Distribution */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-4">Status Distribution</h4>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex">
                  {stats.delivered > 0 && (
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(stats.delivered / stats.total) * 100}%` }}
                      title={`Delivered: ${stats.delivered}`}
                    ></div>
                  )}
                  {stats.failed > 0 && (
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                      title={`Failed: ${stats.failed}`}
                    ></div>
                  )}
                  {stats.pending > 0 && (
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                      title={`Pending: ${stats.pending}`}
                    ></div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                    Delivered: {stats.delivered}
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                    Failed: {stats.failed}
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
                    Pending: {stats.pending}
                  </span>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-medium text-gray-500 mb-3">Delivery Timeline</h4>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <p>Timeline chart will appear here</p>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-medium text-gray-500 mb-3">Status by Time of Day</h4>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <p>Time distribution chart will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Customer
                      </div>
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
                        <Calendar className="h-4 w-4 mr-1" />
                        Sent At
                        {sortBy === 'sentAt' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message Preview
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <React.Fragment key={log._id}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggleExpandLog(log._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-gray-700 font-medium mr-3">
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
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center
                            ${log.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                            log.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'}`}>
                            {log.status === 'DELIVERED' && <CheckCircle className="h-3 w-3 mr-1" />}
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
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-gray-800">Message Details</h4>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpandLog(log._id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                  aria-label="Close details"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="mb-4">
                                <h5 className="text-xs font-medium text-gray-500 mb-1">Full Message Content</h5>
                                <div className="whitespace-pre-wrap text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-100">
                                  {log.message}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">Delivery Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Status:</span>
                                      <span className={`font-medium ${
                                        log.status === 'DELIVERED' ? 'text-green-600' :
                                        log.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                                      }`}>
                                        {log.status}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Sent:</span>
                                      <span>{new Date(log.sentAt).toLocaleString()}</span>
                                    </div>
                                    {log.deliveredAt && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Delivered:</span>
                                        <span>{new Date(log.deliveredAt).toLocaleString()}</span>
                                      </div>
                                    )}
                                    {log.errorMessage && (
                                      <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-red-700 text-xs">
                                        <p className="font-medium mb-1">Error Message:</p>
                                        <p>{log.errorMessage}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="text-xs font-medium text-gray-500 mb-2">Customer Details</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Name:</span>
                                      <span>{log.customer?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Email:</span>
                                      <span>{log.customer?.email || 'N/A'}</span>
                                    </div>
                                    {log.customer?.phone && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span>{log.customer.phone}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Total Spend:</span>
                                      <span>${log.customer?.totalSpend?.toFixed(2) || '0.00'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{logs.length}</span> logs
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 border border-blue-600 rounded-md text-sm text-white hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignLogsModal;