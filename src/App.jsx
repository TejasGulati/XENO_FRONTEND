import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Campaigns from './components/Campaigns';
import NotFound from './components/NotFound';

// Scroll to Top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

// Protect routes for signed-in users only
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
