import { useState } from 'react';
import {
  X,
  Users,
  Megaphone,
  Sparkles,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Tag
} from 'lucide-react';

const CreateCampaignModal = ({ isOpen, onClose, onCreate, previewAudience, generateAIContent }) => {
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    objective: '',
    messageTemplate: '',
    useAIMessage: false,
    segmentRules: [],
    status: 'draft',
    tags: []
  });
  
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaign(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addSegmentRule = () => {
    setCampaign(prev => ({
      ...prev,
      segmentRules: [
        ...prev.segmentRules,
        { field: 'totalSpend', operator: 'GREATER_THAN', value: '', logicalOperator: 'AND' }
      ]
    }));
  };

  const updateSegmentRule = (index, field, value) => {
    const updatedRules = [...campaign.segmentRules];
    updatedRules[index][field] = value;
    setCampaign(prev => ({ ...prev, segmentRules: updatedRules }));
  };

  const removeSegmentRule = (index) => {
    const updatedRules = [...campaign.segmentRules];
    updatedRules.splice(index, 1);
    setCampaign(prev => ({ ...prev, segmentRules: updatedRules }));
  };

  const handlePreviewAudience = async () => {
    setLoading(true);
    setError(null);
    try {
      const preview = await previewAudience(campaign.segmentRules);
      setPreviewData(preview);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIMessage = async () => {
    setAiLoading(true);
    try {
      const message = await generateAIContent('message', {
        campaignObjective: campaign.objective,
        audienceDescription: campaign.description,
        baseMessage: campaign.messageTemplate
      });
      setCampaign(prev => ({ ...prev, messageTemplate: message }));
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const generateTags = async () => {
    setAiLoading(true);
    try {
      const tags = await generateAIContent('tags', {
        name: campaign.name,
        objective: campaign.objective,
        messageTemplate: campaign.messageTemplate
      });
      setCampaign(prev => ({ ...prev, tags }));
    } catch (err) {
      setError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onCreate(campaign);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <div className="flex">
                <XCircle className="h-6 w-6 text-red-500 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
          
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'audience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('audience')}
            >
              Audience
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    name="name"
                    value={campaign.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={campaign.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={campaign.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Objective</label>
                  <input
                    type="text"
                    name="objective"
                    value={campaign.objective}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={campaign.tags.join(', ')}
                      readOnly
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={generateTags}
                      disabled={aiLoading || !campaign.name}
                      className={`px-3 py-2 rounded-md text-sm ${aiLoading ? 'bg-purple-300 text-white' : !campaign.name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      {aiLoading ? 'Generating...' : 'Generate Tags'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'audience' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800">Audience Segmentation</h3>
                  <button
                    type="button"
                    onClick={addSegmentRule}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </button>
                </div>
                
                {campaign.segmentRules.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 text-center">
                    <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No segmentation rules added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Add rules to target specific customer segments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaign.segmentRules.map((rule, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">Rule #{index + 1}</h4>
                          {campaign.segmentRules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSegmentRule(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Field</label>
                            <select
                              value={rule.field}
                              onChange={(e) => updateSegmentRule(index, 'field', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="totalSpend">Total Spend</option>
                              <option value="visitCount">Visit Count</option>
                              <option value="lastVisit">Last Visit</option>
                              <option value="email">Email Domain</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Operator</label>
                            <select
                              value={rule.operator}
                              onChange={(e) => updateSegmentRule(index, 'operator', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="EQUALS">Equals</option>
                              <option value="NOT_EQUALS">Not Equals</option>
                              <option value="GREATER_THAN">Greater Than</option>
                              <option value="LESS_THAN">Less Than</option>
                              <option value="CONTAINS">Contains</option>
                              <option value="DAYS_AGO">Days Ago</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                            <input
                              type={rule.operator === 'DAYS_AGO' ? 'number' : 'text'}
                              value={rule.value}
                              onChange={(e) => updateSegmentRule(index, 'value', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          {index > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Logic</label>
                              <select
                                value={rule.logicalOperator}
                                onChange={(e) => updateSegmentRule(index, 'logicalOperator', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="AND">AND</option>
                                <option value="OR">OR</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handlePreviewAudience}
                    disabled={loading}
                    className={`flex items-center px-4 py-2 rounded-md text-sm ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : 'Preview Audience'}
                  </button>
                </div>
                
                {previewData && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">Audience Preview</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Estimated audience size: {previewData.audienceSize}
                    </p>
                    {previewData.sampleCustomers && previewData.sampleCustomers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-blue-600 font-medium mb-1">Sample customers:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {previewData.sampleCustomers.map((customer, i) => (
                            <li key={i}>{customer.name} ({customer.email})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'content' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800">Message Content</h3>
                  <div className="flex items-center">
                    <label className="flex items-center text-sm text-gray-700 mr-4">
                      <input
                        type="checkbox"
                        name="useAIMessage"
                        checked={campaign.useAIMessage}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Use AI-generated message
                    </label>
                    {campaign.useAIMessage && (
                      <button
                        type="button"
                        onClick={generateAIMessage}
                        disabled={aiLoading || !campaign.objective}
                        className={`flex items-center px-3 py-1 rounded-md text-sm ${aiLoading ? 'bg-purple-300 text-white' : !campaign.objective ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {aiLoading ? 'Generating...' : 'Generate'}
                      </button>
                    )}
                  </div>
                </div>
                
                <textarea
                  name="messageTemplate"
                  value={campaign.messageTemplate}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message template here. Use {name} for personalization."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Personalize messages with customer fields like {'{name}'}, {'{email}'}, etc.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;