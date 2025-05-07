import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  Megaphone, 
  TrendingUp, 
  Calendar, 
  PieChart, 
  BarChart3, 
  ActivitySquare, 
  ArrowUp, 
  ArrowDown,
  DollarSign,
  Clock
} from 'lucide-react';

const Home = () => {
  const { customers, orders, campaigns, loading } = useAppContext();
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderAmount, 0);
  
  // Get recent orders
  const recentOrders = orders.slice(0, 5);
  
  // Calculate stats
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center text-sm font-medium text-blue-600">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Customers</p>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">{customers.length}</h2>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                12%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">{orders.length}</h2>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                8%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-light-blue-400 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Megaphone className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">{campaigns.length}</h2>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                5%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-400 flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">${totalRevenue.toFixed(2)}</h2>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                15%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">View All</button>
            </div>
            <p className="text-sm text-gray-500">Latest customer orders across your store</p>
          </div>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${order.orderAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Order Summary</h2>
            <p className="text-sm text-gray-500">30-day overview of your orders</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                    <span className="text-green-600 bg-green-100 rounded-full h-6 w-6 flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{completedOrders}</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Pending</span>
                    <span className="text-yellow-600 bg-yellow-100 rounded-full h-6 w-6 flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{pendingOrders}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Revenue Trend</h3>
                <div className="h-32 w-full bg-gray-50 rounded-lg flex items-end justify-around px-2 pb-2">
                  {[40, 65, 50, 80, 60, 55, 90].map((height, index) => (
                    <div key={index} className="w-6 bg-blue-600 rounded-t-sm" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full py-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This is a simple check circle icon for the completed orders
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Home;