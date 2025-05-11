import { useAppContext } from '../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  Megaphone, 
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  BarChart2,
  Plus,
  PieChart,
  Mail,
  Activity,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Filter,
  List,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Auth from '../components/Auth';

const Home = () => {
  const { customers, orders, campaigns, communicationLogs, loading } = useAppContext();

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <SignedOut>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-3xl">X</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to <span className="text-blue-600">Xeno CRM</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The all-in-one customer relationship management platform designed to streamline your business operations and boost customer engagement.
            </p>
            
            {/* Auth component for sign-in/sign-up */}
            <div className="flex justify-center mb-12">
              <Auth />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Feature Cards */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Centralized customer database with detailed profiles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track customer interactions and purchase history</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Segment customers for targeted marketing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Megaphone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Marketing Campaigns</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Create and manage multi-channel campaigns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>AI-powered content generation and optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Detailed analytics and performance tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sales & Order Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Process and track customer orders</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time inventory and sales analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated customer follow-ups</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Xeno CRM?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-600">
                    Our platform leverages artificial intelligence to provide smart recommendations.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-Time Analytics</h3>
                  <p className="text-gray-600">
                    Get up-to-the-minute reports on campaign performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Scalable Architecture</h3>
                  <p className="text-gray-600">
                    Our platform grows with you, handling thousands of customers.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <Lightbulb className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Intuitive Interface</h3>
                  <p className="text-gray-600">
                    Designed with user experience in mind for maximum productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Dashboard content for signed in users */}
        {(() => {
          // Calculate stats only when signed in
          const totalRevenue = orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.orderAmount, 0);
          
          const recentOrders = [...orders]
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .slice(0, 5);
          
          const completedOrders = orders.filter(order => order.status === 'completed').length;
          const pendingOrders = orders.filter(order => order.status === 'pending').length;
          const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
          
          const activeCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'scheduled').length;
          const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
          
          const deliveredLogs = communicationLogs.filter(log => log.status === 'DELIVERED').length;
          const failedLogs = communicationLogs.filter(log => log.status === 'FAILED').length;
          const pendingLogs = communicationLogs.filter(log => log.status === 'PENDING').length;
          
          const activeCustomers = customers.filter(c => 
            c.lastVisit && (new Date() - new Date(c.lastVisit) < 30 * 24 * 60 * 60 * 1000)
          ).length;
          
          const highValueCustomers = customers.filter(c => c.totalSpend > 1000).length;

          return (
            <div className="container mx-auto px-4 sm:px-6 py-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">Dashboard Overview</h1>
                  <p className="text-gray-500 text-sm md:text-base">
                    Welcome back! Here's what's happening with your business today.
                  </p>
                </div>
                <div className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  icon={<Users className="h-5 w-5" />}
                  title="Total Customers"
                  value={customers.length}
                  change={`${activeCustomers} active`}
                  link="/customers"
                  color="blue"
                />
                
                <StatCard 
                  icon={<ShoppingBag className="h-5 w-5" />}
                  title="Total Orders"
                  value={orders.length}
                  change={`${((completedOrders / orders.length) * 100 || 0).toFixed(1)}% completed`}
                  link="/orders"
                  color="green"
                />
                
                <StatCard 
                  icon={<Megaphone className="h-5 w-5" />}
                  title="Active Campaigns"
                  value={activeCampaigns}
                  change={`${campaigns.length} total`}
                  link="/campaigns"
                  color="purple"
                />
                
                <StatCard 
                  icon={<DollarSign className="h-5 w-5" />}
                  title="Total Revenue"
                  value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                  change={`${highValueCustomers} high-value customers`}
                  link="/orders"
                  color="red"
                />
              </div>
              
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                        <p className="text-sm text-gray-500 mt-1">Latest customer orders across your store</p>
                      </div>
                      <Link 
                        to="/orders" 
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        View all <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.length > 0 ? (
                          recentOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.customer?.name || 'N/A'}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                                ₹{order.orderAmount.toFixed(2)}
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-5 py-4 text-center text-sm text-gray-500">
                              No recent orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
                    <p className="text-sm text-gray-500 mt-1">Overview of your orders</p>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-5">
                      <div className="grid grid-cols-3 gap-3">
                        <StatMiniCard 
                          count={completedOrders}
                          label="Completed"
                          icon={<CheckCircle className="h-4 w-4" />}
                          color="green"
                        />
                        
                        <StatMiniCard 
                          count={pendingOrders}
                          label="Pending"
                          icon={<Clock className="h-4 w-4" />}
                          color="yellow"
                        />
                        
                        <StatMiniCard 
                          count={cancelledOrders}
                          label="Cancelled"
                          icon={<XCircle className="h-4 w-4" />}
                          color="red"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Order Status Distribution</h3>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                          {orders.length > 0 && (
                            <>
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(completedOrders / orders.length) * 100}%` }}
                              />
                              <div 
                                className="h-full bg-yellow-500" 
                                style={{ width: `${(pendingOrders / orders.length) * 100}%` }}
                              />
                              <div 
                                className="h-full bg-red-500" 
                                style={{ width: `${(cancelledOrders / orders.length) * 100}%` }}
                              />
                            </>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{Math.round((completedOrders / orders.length) * 100)}%</span>
                          <span>{Math.round((pendingOrders / orders.length) * 100)}%</span>
                          <span>{Math.round((cancelledOrders / orders.length) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Campaign Performance</h2>
                        <p className="text-sm text-gray-500 mt-1">Overview of your marketing campaigns</p>
                      </div>
                      <Link 
                        to="/campaigns" 
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        View all <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-5">
                      <div className="grid grid-cols-3 gap-3">
                        <StatMiniCard 
                          count={activeCampaigns}
                          label="Active"
                          icon={<TrendingUp className="h-4 w-4" />}
                          color="blue"
                        />
                        
                        <StatMiniCard 
                          count={draftCampaigns}
                          label="Drafts"
                          icon={<List className="h-4 w-4" />}
                          color="purple"
                        />
                        
                        <StatMiniCard 
                          count={campaigns.length}
                          label="Total"
                          icon={<Megaphone className="h-4 w-4" />}
                          color="indigo"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Delivery Status</h3>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                          {communicationLogs.length > 0 && (
                            <>
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(deliveredLogs / communicationLogs.length) * 100}%` }}
                              />
                              <div 
                                className="h-full bg-red-500" 
                                style={{ width: `${(failedLogs / communicationLogs.length) * 100}%` }}
                              />
                              <div 
                                className="h-full bg-yellow-500" 
                                style={{ width: `${(pendingLogs / communicationLogs.length) * 100}%` }}
                              />
                            </>
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span className="flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                            Delivered: {deliveredLogs}
                          </span>
                          <span className="flex items-center">
                            <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                            Failed: {failedLogs}
                          </span>
                          <span className="flex items-center">
                            <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
                            Pending: {pendingLogs}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer Segments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Customer Segments</h2>
                        <p className="text-sm text-gray-500 mt-1">Key customer groups for targeting</p>
                      </div>
                      <Link 
                        to="/customers" 
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        View all <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-4">
                      <SegmentCard 
                        title="High-Value Customers"
                        count={highValueCustomers}
                        description="Customers with ₹1000+ lifetime spend"
                        icon={<DollarSign className="h-4 w-4" />}
                        color="green"
                      />
                      
                      <SegmentCard 
                        title="Active Customers"
                        count={activeCustomers}
                        description="Customers active in last 30 days"
                        icon={<Activity className="h-4 w-4" />}
                        color="blue"
                      />
                      
                      <SegmentCard 
                        title="Inactive Customers"
                        count={customers.length - activeCustomers}
                        description="No activity in last 30 days"
                        icon={<Clock className="h-4 w-4" />}
                        color="yellow"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
                    <p className="text-sm text-gray-500 mt-1">Common tasks to get started</p>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-3">
                      <QuickAction 
                        icon={<Plus className="h-5 w-5" />}
                        title="Create New Campaign"
                        description="Launch a marketing campaign"
                        link="/campaigns"
                        color="purple"
                      />
                      
                      <QuickAction 
                        icon={<Users className="h-5 w-5" />}
                        title="Add Customer"
                        description="Add a new customer to your database"
                        link="/customers"
                        color="blue"
                      />
                      
                      <QuickAction 
                        icon={<ShoppingBag className="h-5 w-5" />}
                        title="Create Order"
                        description="Record a new customer order"
                        link="/orders"
                        color="green"
                      />
                      
                      <QuickAction 
                        icon={<Sparkles className="h-5 w-5" />}
                        title="AI Recommendations"
                        description="Get AI-powered suggestions"
                        link="/campaigns"
                        color="indigo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </SignedIn>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, change, link, color }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-600',
    green: 'from-green-50 to-emerald-50 border-green-100 text-green-600',
    purple: 'from-purple-50 to-violet-50 border-purple-100 text-purple-600',
    red: 'from-red-50 to-rose-50 border-red-100 text-red-600',
    indigo: 'from-indigo-50 to-blue-50 border-indigo-100 text-indigo-600'
  };
  
  return (
    <Link to={link} className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${color}-100 mr-3`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          </div>
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-600`}>
            {change}
          </span>
        )}
      </div>
    </Link>
  );
};

// Reusable Mini Stat Card
const StatMiniCard = ({ count, label, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  
  return (
    <div className={`${colorClasses[color]} p-3 rounded-lg text-center`}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">{label}</span>
        <span className={`p-1 rounded-full ${colorClasses[color].replace('50', '100')}`}>
          {icon}
        </span>
      </div>
      <p className="text-xl font-bold mt-1">{count}</p>
    </div>
  );
};

// Reusable Status Badge
const StatusBadge = ({ status }) => {
  const statusClasses = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

// Segment Card Component
const SegmentCard = ({ title, count, description, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };
  
  return (
    <div className="flex items-start">
      <div className={`p-2 rounded-lg ${colorClasses[color]} mr-3`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-lg font-bold mt-1">{count} customers</p>
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ icon, title, description, link, color }) => {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  
  return (
    <Link 
      to={link} 
      className={`flex items-start p-3 rounded-lg hover:shadow-sm transition-all ${colorClasses[color]}`}
    >
      <div className={`p-2 rounded-lg ${colorClasses[color].replace('50', '100')} mr-3`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
};

export default Home;