import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [communicationLogs, setCommunicationLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customersRes, ordersRes, campaignsRes, logsRes] = await Promise.all([
        api.getCustomers(),
        api.getOrders(),
        api.getCampaigns(),
        api.getAllLogs()
      ]);
      
      setCustomers(customersRes.data);
      setOrders(ordersRes.data);
      setCampaigns(campaignsRes.data);
      setCommunicationLogs(logsRes.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAllData(); 
  }, []);

  // Customer functions
  const addCustomer = async (customer) => {
    try {
      const res = await api.createCustomer(customer);
      // Handle the 202 Accepted response from the backend
      // The actual data will be added later when we refresh or reload
      setCustomers(prev => [...prev, res.data.data]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateCustomer = async (id, customer) => {
    try {
      const res = await api.updateCustomer(id, customer);
      setCustomers(prev => prev.map(c => c._id === id ? res.data : c));
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c._id !== id));
      
      // Also remove related logs from state
      const customerLogs = communicationLogs.filter(log => log.customer?._id === id);
      setCommunicationLogs(prev => prev.filter(log => 
        !customerLogs.some(l => l._id === log._id)
      ));
    } catch (err) {
      throw err;
    }
  };

  // Order functions
  const addOrder = async (order) => {
    try {
      const res = await api.createOrder(order);
      // Handle the 202 Accepted response from the backend
      // The actual data will be added later when we refresh or reload
      setOrders(prev => [...prev, res.data.data]);
      
      // We don't need to update customer stats here as the backend will handle it through Redis
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateOrder = async (id, order) => {
    try {
      const res = await api.updateOrder(id, order);
      setOrders(prev => prev.map(o => o._id === id ? res.data : o));
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await api.deleteOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id));
      // The backend will handle updating customer stats
    } catch (err) {
      throw err;
    }
  };

  // Campaign functions
  const addCampaign = async (campaign) => {
    try {
      const res = await api.createCampaign(campaign);
      setCampaigns(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const getCampaignLogs = async (id) => {
    try {
      const res = await api.getCampaignLogs(id);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateDeliveryStatus = async (data) => {
    try {
      const res = await api.updateDeliveryReceipt(data);
      // Update logs in state
      setCommunicationLogs(prev => prev.map(log => 
        log._id === data.communicationLogId ? { ...log, ...res.data } : log
      ));
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const previewCampaignAudience = async (segmentRules) => {
    try {
      const res = await api.previewAudience(segmentRules);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // AI functions
  const generateAIContent = async (type, data) => {
    try {
      let result;
      switch (type) {
        case 'message':
          result = await api.generateAIMessage(data);
          return result.data.message;
        case 'segment':
          result = await api.generateSegmentRules(data.naturalLanguage);
          return result.data.rules;
        case 'summary':
          result = await api.generateCampaignSummary(data);
          return result.data.summary;
        case 'variants':
          result = await api.generateMessageVariants(data);
          return result.data.variants;
        case 'performance':
          result = await api.generatePerformanceSummary(data);
          return result.data;
        case 'optimal-time':
          result = await api.getOptimalSendTime(data);
          return result.data;
        case 'lookalike':
          result = await api.generateLookalikeAudience(data);
          return result.data.rules;
        case 'tags':
          result = await api.autoTagCampaign(data);
          return result.data.tags;
        default:
          throw new Error('Invalid AI content type');
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      customers, 
      orders, 
      campaigns, 
      communicationLogs, 
      loading, 
      error,
      addCustomer, 
      updateCustomer, 
      deleteCustomer,
      addOrder, 
      updateOrder, 
      deleteOrder,
      addCampaign, 
      getCampaignLogs,
      updateDeliveryStatus,
      previewCampaignAudience,
      generateAIContent,
      fetchAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);