// src/components/OrderModal.jsx - Complete Updated File
import { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  ChevronDown,
  Loader2
} from 'lucide-react';

const OrderModal = ({ isOpen, onClose, onSubmit, order, customers, isSubmitting }) => {
  const [formData, setFormData] = useState({
    customer: '',
    orderAmount: 0,
    items: [{ name: '', price: 0, quantity: 1 }],
    status: 'pending',
    orderDate: new Date().toISOString().slice(0, 16)
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      const customerId = order.customer?._id || order.customer || '';
      setFormData({
        ...order,
        customer: customerId,
        items: order.items?.length ? 
          order.items.map(item => ({
            name: item.name || '',
            price: item.price || 0,
            quantity: item.quantity || 1
          })) : 
          [{ name: '', price: 0, quantity: 1 }],
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
      });
    } else {
      setFormData({
        customer: '',
        orderAmount: 0,
        items: [{ name: '', price: 0, quantity: 1 }],
        status: 'pending',
        orderDate: new Date().toISOString().slice(0, 16)
      });
    }
    setErrors({});
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === 'price' || field === 'quantity' ? Number(value) : value;
    
    const orderAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      orderAmount
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', price: 0, quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    const orderAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      orderAmount
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    
    if (formData.orderAmount <= 0) {
      newErrors.orderAmount = 'Order amount must be greater than 0';
    }
    
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.name) {
        newErrors[`items[${i}].name`] = 'Item name is required';
      }
      if (item.price <= 0) {
        newErrors[`items[${i}].price`] = 'Price must be greater than 0';
      }
      if (item.quantity <= 0) {
        newErrors[`items[${i}].quantity`] = 'Quantity must be greater than 0';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions
    if (validate()) {
      onSubmit({
        ...formData,
        orderDate: formData.orderDate || new Date().toISOString()
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {order ? 'Edit Order' : 'Create New Order'}
              </h2>
              <p className="text-sm text-gray-500">
                {order ? 'Update order details' : 'Define order items and customer information'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="text-red-800 font-medium">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-red-700 mt-1">
                    {Object.values(errors).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`pl-10 w-full px-3 py-2 border ${errors.customer ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer._id} value={customer._id}>
                        {customer.name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      name="orderDate"
                      disabled={isSubmitting}
                      value={formData.orderDate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        orderDate: e.target.value
                      }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {formData.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {formData.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                      {formData.status === 'cancelled' && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">Order Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={isSubmitting}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Item #{index + 1}</h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 border ${errors[`items[${index}].name`] ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50`}
                        required
                      />
                      {errors[`items[${index}].name`] && <p className="mt-1 text-xs text-red-600">{errors[`items[${index}].name`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          disabled={isSubmitting}
                          className={`pl-8 w-full px-3 py-2 border ${errors[`items[${index}].price`] ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50`}
                          required
                        />
                      </div>
                      {errors[`items[${index}].price`] && <p className="mt-1 text-xs text-red-600">{errors[`items[${index}].price`]}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 border ${errors[`items[${index}].quantity`] ? 'border-red-300' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50`}
                        required
                      />
                      {errors[`items[${index}].quantity`] && <p className="mt-1 text-xs text-red-600">{errors[`items[${index}].quantity`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-blue-800">Order Summary</h4>
                <div className="text-xl font-bold text-blue-600">
                  ₹{formData.orderAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } flex items-center justify-center min-w-[120px]`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {order ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {order ? 'Update Order' : 'Create Order'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;