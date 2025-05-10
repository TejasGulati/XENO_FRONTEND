import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Megaphone
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-50 text-gray-800 p-4 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 bg-gray-800 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <span className="text-xl font-semibold hover:text-gray-600 transition-colors">
            Xeno CRM
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-8 items-center">
          <NavItem to="/customers" icon={<Users className="h-5 w-5" />} text="Customers" />
          <NavItem to="/orders" icon={<ShoppingBag className="h-5 w-5" />} text="Orders" />
          <NavItem to="/campaigns" icon={<Megaphone className="h-5 w-5" />} text="Campaigns" />
        </div>
      </div>
    </nav>
  );
};

// Reusable nav link with icon
const NavItem = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-sm font-medium hover:text-gray-600 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
