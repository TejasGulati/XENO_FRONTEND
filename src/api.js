// src/context/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://xeno-backend-seven.vercel.app/api',
});

// Customers API
export const getCustomers = () => api.get('/customers');
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (customer) => api.post('/customers', customer);
export const updateCustomer = (id, customer) => api.put(`/customers/${id}`, customer);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Orders API
export const getOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getOrdersByCustomerId = (customerId) => api.get(`/orders/customer/${customerId}`);
export const createOrder = (order) => api.post('/orders', order);
export const updateOrder = (id, order) => api.put(`/orders/${id}`, order);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Campaigns API
export const getCampaigns = () => api.get('/campaigns');
export const getCampaignById = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (campaign) => api.post('/campaigns', campaign);
export const previewAudience = (segmentRules) => api.post('/campaigns/preview-audience', { segmentRules });
export const updateDeliveryReceipt = (data) => api.post('/campaigns/delivery-receipt', data);
export const getCampaignLogs = (id) => api.get(`/campaigns/${id}/logs`);
export const getAllLogs = () => api.get('/campaigns/logs/all');
export const getLogsByCustomer = (customerId) => api.get(`/campaigns/logs/customer/${customerId}`);
export const getLogsByStatus = (status) => api.get(`/campaigns/logs/status/${status}`);

// AI Services
export const generateAIMessage = (data) => api.post('/ai/generate-message', data);
export const generateSegmentRules = (naturalLanguage) => api.post('/ai/generate-segment-rules', { naturalLanguage });
export const generateCampaignSummary = (data) => api.post('/ai/generate-campaign-summary', data);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;