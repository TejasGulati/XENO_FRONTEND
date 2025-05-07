import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersRes, ordersRes, campaignsRes] = await Promise.all([
        api.getCustomers(),
        api.getOrders(),
        api.getCampaigns()
      ]);
      setCustomers(customersRes.data);
      setOrders(ordersRes.data);
      setCampaigns(campaignsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addCustomer = async (customer) => {
    try {
      const res = await api.createCustomer(customer);
      setCustomers([...customers, res.data]);
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const updateCustomer = async (id, customer) => {
    try {
      const res = await api.updateCustomer(id, customer);
      setCustomers(customers.map(c => c._id === id ? res.data : c));
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(customers.filter(c => c._id !== id));
    } catch (err) {
      throw err.response?.data?.message || err.message;
    }
  };

  return (
    <AppContext.Provider value={{
      customers, orders, campaigns, loading, error,
      addCustomer, updateCustomer, deleteCustomer,
      fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);