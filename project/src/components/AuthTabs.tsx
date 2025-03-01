import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

type TabType = 'signin' | 'signup' | 'forgot';

const AuthTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('signin');

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'signin'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('signin')}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'signup'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'forgot'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('forgot')}
        >
          Forgot Password
        </button>
      </div>
      <div className="p-6">
        {activeTab === 'signin' && <SignIn />}
        {activeTab === 'signup' && <SignUp />}
        {activeTab === 'forgot' && <ForgotPassword />}
      </div>
    </div>
  );
};

export default AuthTabs;