import { Link } from 'react-router-dom';
import {
  Users,
  ShoppingBag,
  Megaphone,
  Home
} from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">X</span>
          </div>
          <span className="text-xl font-bold hover:text-blue-200 transition-colors">Xeno CRM</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <NavItem to="/customers" icon={<Users className="h-4 w-4" />} text="Customers" />
          <NavItem to="/orders" icon={<ShoppingBag className="h-4 w-4" />} text="Orders" />
          <NavItem to="/campaigns" icon={<Megaphone className="h-4 w-4" />} text="Campaigns" />
        </div>
      </div>
    </nav>
  );
};

// Reusable nav link with icon
const NavItem = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 hover:text-blue-200 transition-colors text-sm font-medium"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
