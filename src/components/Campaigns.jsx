import { useAppContext } from '../context/AppContext';
import { 
  Megaphone, 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  BarChart3 
} from 'lucide-react';

const Campaigns = () => {
  const { campaigns, loading, error } = useAppContext();
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex">
        <XCircle className="h-6 w-6 text-red-500 mr-3" />
        <p className="text-red-800">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-8">
        <Megaphone className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div 
            key={campaign._id} 
            className="bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 ml-3">{campaign.name}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 line-clamp-2">{campaign.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    Audience
                  </p>
                  <p className="font-medium text-navy-900">{campaign.audienceSize.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Sent
                  </p>
                  <p className="font-medium text-green-600">{campaign.sent.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center">
                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                    Failed
                  </p>
                  <p className="font-medium text-red-500">{campaign.failed.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{Math.round((campaign.sent / campaign.audienceSize) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(campaign.sent / campaign.audienceSize) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <span className={`text-xs font-medium px-3 py-1 rounded-full
                ${campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                campaign.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                'bg-blue-100 text-blue-800'}`}>
                {campaign.status}
              </span>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Updated 2d ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;