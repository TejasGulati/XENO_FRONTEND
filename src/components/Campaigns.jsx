import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Megaphone, 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Search,
  BarChart3,
  Plus,
  List,
  Mail,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Clock,
  MessageSquare,
  Tag,
  Lightbulb,
  X,
  ArrowUpDown,
  Sliders,
  Download,
  PieChart,
  BarChart2
} from 'lucide-react';
import CreateCampaignModal from './CreateCampaignModal';
import CampaignLogsModal from './CampaignLogsModal';

const Campaigns = () => {
  const { 
    campaigns, 
    communicationLogs,
    loading, 
    error,
    addCampaign,
    getCampaignLogs,
    previewCampaignAudience,
    generateAIContent,
    fetchAllData
  } = useAppContext();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignLogs, setCampaignLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [aiContent, setAiContent] = useState(null);
  const [aiContentType, setAiContentType] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(campaign.createdAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && (new Date() - new Date(campaign.createdAt)) < 7 * 24 * 60 * 60 * 1000) ||
      (dateFilter === 'month' && (new Date() - new Date(campaign.createdAt)) < 30 * 24 * 60 * 60 * 1000);
    
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);

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

  const viewCampaignLogs = async (campaignId) => {
    setLogsLoading(true);
    try {
      const logs = await getCampaignLogs(campaignId);
      setCampaignLogs(logs);
      setSelectedCampaign(campaigns.find(c => c._id === campaignId));
      setShowLogsModal(true);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const generateAISummary = async (campaign) => {
    try {
      const summary = await generateAIContent('summary', campaign);
      setAiContent(summary);
      setAiContentType('summary');
    } catch (err) {
      console.error('Error generating summary:', err);
    }
  };

  const getOptimalSendTime = async (campaign) => {
    try {
      const result = await generateAIContent('optimal-time', {
        rules: campaign.segmentRules,
        description: campaign.description
      });
      setAiContent(result);
      setAiContentType('optimal-time');
    } catch (err) {
      console.error('Error getting optimal time:', err);
    }
  };

  const generateMessageVariants = async (campaign) => {
    try {
      const variants = await generateAIContent('variants', {
        objective: campaign.objective,
        audienceDescription: campaign.description,
        baseMessage: campaign.messageTemplate
      });
      setAiContent(variants);
      setAiContentType('variants');
    } catch (err) {
      console.error('Error generating variants:', err);
    }
  };

  // Add this function to handle CSV export in the Campaigns component
const exportCampaignsToCSV = () => {
  // If no campaigns to export, show alert and return
  if (filteredCampaigns.length === 0) {
    alert('No campaigns to export');
    return;
  }
  
  // CSV header row
  const headers = [
    'Campaign Name',
    'Description',
    'Audience Size',
    'Sent',
    'Status',
    'Created Date',
    'ID'
  ];
  
  // Format campaign data for CSV
  const csvData = filteredCampaigns.map(campaign => [
    // Escape quotes in text fields to prevent CSV formatting issues
    `"${campaign.name.replace(/"/g, '""')}"`, 
    `"${(campaign.description || 'No description').replace(/"/g, '""')}"`,
    campaign.audienceSize,
    campaign.sent,
    campaign.status,
    new Date(campaign.createdAt).toLocaleDateString(),
    campaign._id
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
  const filename = `campaigns-export-${timestamp}.csv`;
  
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

  const handleCreateCampaign = async (campaignData) => {
    try {
      await addCampaign(campaignData);
      fetchAllData(); // Refresh all data after campaign creation
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCampaign}
        previewAudience={previewCampaignAudience}
        generateAIContent={generateAIContent}
      />
      
      <CampaignLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        campaign={selectedCampaign}
        logs={campaignLogs}
        loading={logsLoading}
      />
      
      {/* AI Content Modal */}
      {aiContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {aiContentType === 'summary' && (
                  <>
                    <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                    AI Campaign Summary
                  </>
                )}
                {aiContentType === 'optimal-time' && (
                  <>
                    <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                    Optimal Send Times
                  </>
                )}
                {aiContentType === 'variants' && (
                  <>
                    <MessageSquare className="h-5 w-5 text-teal-600 mr-2" />
                    AI Message Variants
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setAiContent(null);
                  setAiContentType('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {aiContentType === 'summary' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{aiContent}</p>
                </div>
              )}
              
              {aiContentType === 'optimal-time' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h4 className="font-medium text-indigo-800 mb-2">Best Times to Send</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiContent.best_times.map((time, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2">Avoid Sending At</h4>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {aiContent.worst_time}
                    </span>
                  </div>
                  
                  <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Rationale</h4>
                    <p className="text-gray-600 whitespace-pre-line">{aiContent.rationale}</p>
                  </div>
                </div>
              )}
              
              {aiContentType === 'variants' && (
                <div className="space-y-6">
                  {aiContent.map((variant, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-teal-600" />
                        Variant {i + 1}
                      </h4>
                      
                      <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                        <p className="text-gray-700 whitespace-pre-line">{variant.message}</p>
                      </div>
                      
                      <div className="bg-teal-50 p-3 rounded mb-3">
                        <h5 className="text-sm font-medium text-teal-800 mb-1 flex items-center">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Image Idea
                        </h5>
                        <p className="text-sm text-teal-700">{variant.imageIdea}</p>
                      </div>
                      
                      <div className="bg-gray-100 p-3 rounded">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Rationale</h5>
                        <p className="text-sm text-gray-600">{variant.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={() => {
                  setAiContent(null);
                  setAiContentType('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-xl mr-3">
            <Megaphone className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
            <p className="text-sm text-gray-500">Manage your marketing campaigns and communications</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Campaign
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
            onClick={() => {
              setSelectedCampaign(null);
              setCampaignLogs(communicationLogs);
              setShowLogsModal(true);
            }}
          >
            <List className="h-5 w-5 mr-2" />
            View All Logs
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
                placeholder="Search campaigns by name or description..."
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
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                  <option value="completed">Completed</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <button 
  className="px-3 py-2 bg-white border border-gray-300 rounded-lg flex items-center text-gray-600 hover:bg-gray-50 transition-colors"
  onClick={exportCampaignsToCSV}
>
  <Download className="h-4 w-4 mr-1" />
  Export
</button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {currentCampaigns.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Campaign Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('audienceSize')}
                  >
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Audience
                      {sortBy === 'audienceSize' && (
                        <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sent')}
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Sent
                      {sortBy === 'sent' && (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Tools
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCampaigns.map(campaign => (
                  <tr key={campaign._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Megaphone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-xs text-gray-500">ID: #{campaign._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 line-clamp-2">{campaign.description || 'No description'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{campaign.audienceSize.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {campaign.sent.toLocaleString()} / {campaign.audienceSize.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(campaign.sent / campaign.audienceSize) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                        campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 rounded-md text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => generateAISummary(campaign)}
                          title="AI Summary"
                        >
                          <Sparkles className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors"
                          onClick={() => getOptimalSendTime(campaign)}
                          title="Optimal Time"
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                        <button
                          className="p-1 rounded-md text-teal-600 hover:bg-teal-50 transition-colors"
                          onClick={() => generateMessageVariants(campaign)}
                          title="Message Variants"
                        >
                          <MessageSquare className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => viewCampaignLogs(campaign._id)}
                          title="View Logs"
                        >
                          <List className="h-5 w-5" />
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
                <Megaphone className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No campaigns found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or create a new campaign</p>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Campaign
              </button>
            </div>
          )}
        </div>
        
        {currentCampaigns.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2 sm:mb-0">
              Showing <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCampaigns.length)}</span> of <span className="font-medium">{filteredCampaigns.length}</span> campaigns
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

export default Campaigns;