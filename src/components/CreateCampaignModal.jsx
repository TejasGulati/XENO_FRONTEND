import { useState, useCallback } from 'react';
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
  Tag,
  MessageSquare,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sliders,
  Calendar,
  GripVertical,
  ArrowRight,
  List,
  BarChart2,
  Mail,
  Filter
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  RULE: 'rule'
};

const RuleItem = ({ rule, index, updateRule, removeRule, moveRule }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.RULE,
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.RULE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRule(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))}
      className={`bg-white p-4 rounded-lg border border-gray-200 mb-3 hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <GripVertical className="h-4 w-4 text-gray-400 mr-2 cursor-move" />
          <h4 className="font-medium text-gray-700">Rule #{index + 1}</h4>
        </div>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeRule(index)}
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
            onChange={(e) => updateRule(index, 'field', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => updateRule(index, 'operator', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EQUALS">Equals</option>
            <option value="NOT_EQUALS">Not Equals</option>
            <option value="GREATER_THAN">Greater Than</option>
            <option value="LESS_THAN">Less Than</option>
            <option value="CONTAINS">Contains</option>
            <option value="NOT_CONTAINS">Not Contains</option>
            <option value="DAYS_AGO">Days Ago</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
          <input
            type={rule.operator === 'DAYS_AGO' ? 'number' : 'text'}
            value={rule.value}
            onChange={(e) => updateRule(index, 'value', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={rule.operator === 'DAYS_AGO' ? 'Number of days' : 'Enter value'}
          />
        </div>
        
        {index > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Combine With</label>
            <select
              value={rule.logicalOperator}
              onChange={(e) => updateRule(index, 'logicalOperator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

const RuleBuilder = ({ rules, updateRule, addRule, removeRule, moveRule }) => {
  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <div key={index} className="relative">
          {index > 0 && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
              {rule.logicalOperator}
            </div>
          )}
          <RuleItem 
            rule={rule} 
            index={index} 
            updateRule={updateRule} 
            removeRule={removeRule}
            moveRule={moveRule}
          />
        </div>
      ))}
    </div>
  );
};

const CreateCampaignModal = ({ isOpen, onClose, onCreate, previewAudience, generateAIContent }) => {
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    objective: '',
    messageTemplate: '',
    useAIMessage: false,
    segmentRules: [{ field: 'totalSpend', operator: 'GREATER_THAN', value: '', logicalOperator: 'AND' }],
    status: 'draft',
    tags: []
  });
  
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

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

  const moveSegmentRule = useCallback((dragIndex, hoverIndex) => {
    const draggedRule = campaign.segmentRules[dragIndex];
    const newRules = [...campaign.segmentRules];
    newRules.splice(dragIndex, 1);
    newRules.splice(hoverIndex, 0, draggedRule);
    setCampaign(prev => ({ ...prev, segmentRules: newRules }));
  }, [campaign.segmentRules]);

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
    setError(null);
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
    setError(null);
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

  const generateRulesFromNaturalLanguage = async () => {
    if (!naturalLanguageInput.trim()) {
      setError('Please enter a description of your target audience');
      return;
    }
    
    setAiLoading(true);
    setError(null);
    try {
      const rules = await generateAIContent('segment', {
        naturalLanguage: naturalLanguageInput
      });
      setCampaign(prev => ({ ...prev, segmentRules: rules }));
      setNaturalLanguageInput('');
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create New Campaign</h2>
              <p className="text-sm text-gray-500">Define your audience and message to start your campaign</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
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
              type="button"
              className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium ${activeTab === 'audience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('audience')}
            >
              Audience
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
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
                    placeholder="e.g. Summer Sale Promotion"
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
                    placeholder="Brief description of your campaign goals"
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
                    placeholder="What do you want to achieve with this campaign?"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-grow relative">
                        {campaign.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] bg-white">
                            {campaign.tags.map((tag, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value=""
                            readOnly
                            placeholder="No tags generated yet"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={generateTags}
                        disabled={aiLoading || !campaign.name}
                        className={`px-3 py-2 rounded-md text-sm flex items-center whitespace-nowrap ${aiLoading ? 'bg-purple-300 text-white' : !campaign.name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                      >
                        {aiLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-1" />
                            Generate Tags
                          </>
                        )}
                      </button>
                    </div>
                    {aiLoading && campaign.tags.length === 0 && (
                      <div className="text-xs text-purple-600 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI is generating relevant tags based on your campaign details...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'audience' && (
              <div className="mb-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Natural Language Segment Builder</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Describe your target audience in plain English
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Customers who spent more than ₹5000 but haven't visited in 30 days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={naturalLanguageInput}
                          onChange={(e) => setNaturalLanguageInput(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateRulesFromNaturalLanguage}
                        disabled={aiLoading || !naturalLanguageInput.trim()}
                        className={`px-3 py-2 rounded-md text-sm flex items-center ${
                          aiLoading 
                            ? 'bg-purple-300 text-white' 
                            : !naturalLanguageInput.trim() 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {aiLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Generate Rules
                          </>
                        )}
                      </button>
                    </div>
                    
                    {aiLoading && (
                      <div className="bg-purple-50 border border-purple-100 rounded-md p-3">
                        <div className="flex items-start">
                          <div className="animate-pulse">
                            <Sparkles className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-purple-800 mb-2">
                              AI is translating your audience description into segment rules...
                            </p>
                            <p className="text-xs text-purple-500 mt-1">This will create precise targeting conditions based on your description.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-800">Advanced Segment Rules</h3>
                    <button
                      type="button"
                      onClick={addSegmentRule}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rule
                    </button>
                  </div>
                  
                  <DndProvider backend={HTML5Backend}>
                    {campaign.segmentRules.length === 0 ? (
                      <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 text-center">
                        <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No segmentation rules added yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add rules to target specific customer segments</p>
                      </div>
                    ) : (
                      <RuleBuilder 
                        rules={campaign.segmentRules}
                        updateRule={updateSegmentRule}
                        addRule={addSegmentRule}
                        removeRule={removeSegmentRule}
                        moveRule={moveSegmentRule}
                      />
                    )}
                  </DndProvider>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handlePreviewAudience}
                    disabled={loading || campaign.segmentRules.length === 0}
                    className={`flex items-center px-4 py-2 rounded-md text-sm ${
                      loading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : campaign.segmentRules.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Audience
                      </>
                    )}
                  </button>
                </div>
                
                {previewData && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">Audience Preview</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Estimated audience size: <span className="font-bold">{previewData.audienceSize.toLocaleString()}</span> customers
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
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                  
                  {campaign.useAIMessage && (
                    <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                        <div className="flex-grow">
                          <p className="text-sm text-purple-800 mb-2">
                            AI can generate a personalized message based on your campaign objective and audience.
                          </p>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={generateAIMessage}
                              disabled={aiLoading || !campaign.objective}
                              className={`flex items-center px-3 py-1.5 rounded-md text-sm ${aiLoading ? 'bg-purple-300 text-white' : !campaign.objective ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            >
                              {aiLoading ? (
                                <>
                                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                  Generating message...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-1" />
                                  Generate Message
                                </>
                              )}
                            </button>
                            {!campaign.objective && (
                              <p className="text-xs text-purple-500 ml-2 self-center">Please define a campaign objective first</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} flex items-center`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </>
                ) : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;