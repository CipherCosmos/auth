import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfile from './UpdateProfile';
import UpdatePassword from './UpdatePassword';
import { LogOut, User, KeyRound } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {state.user?.username}</h1>
              <p className="text-blue-100">{state.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center hover:bg-blue-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeSection === 'profile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection('profile')}
            >
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeSection === 'password'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveSection('password')}
            >
              <div className="flex items-center">
                <KeyRound className="w-4 h-4 mr-2" />
                Update Password
              </div>
            </button>
          </div>
          
          {activeSection === 'profile' ? <UpdateProfile /> : <UpdatePassword />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;