import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Please check the URL or navigate back to the home page.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;