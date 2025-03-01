import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Send } from 'lucide-react';

const UpdatePassword: React.FC = () => {
  const { state, requestPasswordReset, updatePassword } = useAuth();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestOtp = async () => {
    if (!state.user?.email) return;
    
    setError(null);
    setSuccess(null);
    setIsRequestingOtp(true);
    
    try {
      await requestPasswordReset(state.user.email);
      setOtpRequested(true);
      setSuccess('OTP sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request OTP');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user?.email) return;
    
    setError(null);
    setSuccess(null);
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      await updatePassword(state.user.email, parseInt(otp), newPassword);
      setSuccess('Password updated successfully');
      
      // Reset form
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpRequested(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Update Your Password</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {!otpRequested ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            To update your password, we'll send a one-time password (OTP) to your email address.
          </p>
          
          <button
            onClick={handleRequestOtp}
            disabled={isRequestingOtp}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isRequestingOtp ? (
              'Sending OTP...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Request OTP
              </>
            )}
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="123456"
            />
          </div>
          
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setOtpRequested(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUpdatingPassword ? (
                'Updating...'
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdatePassword;