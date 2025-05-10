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
  Clock
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

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
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
      alert(`AI Campaign Summary:\n\n${summary}`);
    } catch (err) {
      console.error('Error generating summary:', err);
      alert('Failed to generate AI summary. Please try again.');
    }
  };

  const getOptimalSendTime = async (campaign) => {
    try {
      const result = await generateAIContent('optimal-time', {
        rules: campaign.segmentRules,
        description: campaign.description
      });
      alert(`Optimal Send Times:\n\nBest Times: ${result.best_times.join(', ')}\nWorst Time: ${result.worst_time}\n\n${result.rationale}`);
    } catch (err) {
      console.error('Error getting optimal time:', err);
      alert('Failed to get optimal send time. Please try again.');
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      await addCampaign(campaignData);
      fetchAllData(); // Refresh all data after campaign creation
    } catch (err) {
      console.error('Error creating campaign:', err);
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
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Megaphone className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Campaign
          </button>
          
          <button 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => {
              setSelectedCampaign(null);
              setCampaignLogs(communicationLogs);
              setShowLogsModal(true);
            }}
          >
            <List className="h-5 w-5 mr-2" />
            View All Logs
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns by name or description..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              className="px-3 py-2 bg-gray-100 rounded-md text-gray-600 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="sent">Sent</option>
              <option value="completed">Completed</option>
            </select>
            
            <button className="px-3 py-2 bg-gray-100 rounded-md flex items-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </button>
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
                    Campaign Name
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'name' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'name' ? 'opacity-100' : 'opacity-0'}`} />
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
                    Audience
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'audienceSize' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'audienceSize' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sent')}
                >
                  <div className="flex items-center">
                    Sent
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'sent' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'sent' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ChevronDown className={`h-4 w-4 ml-1 transform ${sortBy === 'status' && sortOrder === 'desc' ? 'rotate-180' : ''} ${sortBy === 'status' ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map(campaign => (
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
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm font-medium">{campaign.audienceSize.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-blue-400" />
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => viewCampaignLogs(campaign._id)}
                        title="View Logs"
                      >
                        <List className="h-5 w-5" />
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCampaigns.length}</span> of <span className="font-medium">{campaigns.length}</span> campaigns
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
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Communication Logs</h2>
          <p className="text-sm text-gray-500">Latest message delivery attempts</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {communicationLogs.slice(0, 5).map(log => (
                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.campaign?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                        {log.customer?.name ? log.customer.name.charAt(0).toUpperCase() : 'N'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.customer?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{log.customer?.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${log.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      log.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.sentAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;