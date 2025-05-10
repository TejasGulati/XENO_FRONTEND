import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft, Mail } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center shadow-inner">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-3">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-6">
            The page you're looking for doesn't exist or has been moved. 
            Please check the URL or navigate back to the home page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
        </div>
      </div>
    </div>
  );
};

export default NotFound;