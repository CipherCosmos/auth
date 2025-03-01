import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthTabs from './components/AuthTabs';
import Dashboard from './components/Dashboard';
import { KeyRound } from 'lucide-react';

const AppContent: React.FC = () => {
  const { state } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {state.isAuthenticated && state.user ? (
        <Dashboard />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Auth System</h1>
              <p className="text-gray-600 mt-2">Sign in to access your account</p>
            </div>
            
            <AuthTabs />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;