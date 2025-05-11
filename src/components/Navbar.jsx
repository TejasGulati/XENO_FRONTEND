import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Megaphone
} from 'lucide-react';
import Auth from './Auth';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transition-all group-hover:from-blue-700 group-hover:to-indigo-700">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
              Xeno CRM
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Navigation Links - Only visible when signed in */}
            <SignedIn>
              <div className="flex space-x-6">
                <NavItem
                  to="/customers"
                  icon={<Users className="h-5 w-5" />}
                  text="Customers"
                  isActive={location.pathname === '/customers'}
                />
                <NavItem
                  to="/orders"
                  icon={<ShoppingBag className="h-5 w-5" />}
                  text="Orders"
                  isActive={location.pathname === '/orders'}
                />
                <NavItem
                  to="/campaigns"
                  icon={<Megaphone className="h-5 w-5" />}
                  text="Campaigns"
                  isActive={location.pathname === '/campaigns'}
                />
              </div>
            </SignedIn>
            
            {/* Auth Component */}
            <Auth />
          </div>
        </div>
      </div>
    </nav>
  );
};

// NavItem component remains the same
const NavItem = ({ to, icon, text, isActive }) => (
  <Link
    to={to}
    className={`relative flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors
      ${isActive
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
  >
    {icon}
    <span>{text}</span>
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
    )}
  </Link>
);

export default Navbar;