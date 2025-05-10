import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  Megaphone, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

const Home = () => {
  const { customers, orders, campaigns, loading } = useAppContext();
  
  // Calculate total revenue from completed orders only
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.orderAmount, 0);
  
  // Get recent orders sorted by date
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);
  
  // Calculate order stats
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
  
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
            <h2 className="text-2xl font-bold text-gray-800">{customers.length}</h2>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600 flex items-center">
          <div className="bg-green-100 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold text-gray-800">{orders.length}</h2>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full">
            <Megaphone className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
            <h2 className="text-2xl font-bold text-gray-800">{campaigns.length}</h2>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 flex items-center">
          <div className="bg-red-100 p-3 rounded-full">
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <h2 className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</h2>
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
            <p className="text-sm text-gray-500">Overview of your orders</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                    <span className="text-green-600 bg-green-100 rounded-full h-6 w-6 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
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
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Cancelled</span>
                    <span className="text-red-600 bg-red-100 rounded-full h-6 w-6 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{cancelledOrders}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Order Status Distribution</h3>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(completedOrders / orders.length) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${(pendingOrders / orders.length) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(cancelledOrders / orders.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Completed: {completedOrders}</span>
                  <span>Pending: {pendingOrders}</span>
                  <span>Cancelled: {cancelledOrders}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;