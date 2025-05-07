import axios from 'axios';

const api = axios.create({
  baseURL: 'https://xeno-backend-seven.vercel.app/api',
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
export const getOrdersByCustomer = (customerId) => api.get(`/orders/customer/${customerId}`);
export const createOrder = (order) => api.post('/orders', order);
export const updateOrder = (id, order) => api.put(`/orders/${id}`, order);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Campaigns API
export const getCampaigns = () => api.get('/campaigns');
export const getCampaignById = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (campaign) => api.post('/campaigns', campaign);
export const previewAudience = (segmentRules) => api.post('/campaigns/preview-audience', { segmentRules });
export const getCampaignLogs = (id) => api.get(`/campaigns/${id}/logs`);