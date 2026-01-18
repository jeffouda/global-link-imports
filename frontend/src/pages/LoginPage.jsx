import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'forgot'
  const [forgotStep, setForgotStep] = useState(1); // 1 = Email, 2 = Verify Code
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(formData.email);
      setForgotStep(2);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(formData.email, formData.code, formData.newPassword);
      setCurrentView('login');
      setError('Password reset successfully. Please log in.');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">GlobalLink Imports</h1>
          <p className="text-gray-600">Your trusted logistics partner</p>
        </div>

        {/* Toggle */}
        <div className="bg-gray-100 rounded-lg p-1 mb-6 flex">
          <Link
            to="/login"
            className="flex-1 text-center py-2 px-4 rounded-md bg-slate-900 text-white font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex-1 text-center py-2 px-4 rounded-md text-gray-600 hover:text-gray-900 transition"
          >
            Sign Up
          </Link>
        </div>

        {currentView === 'login' && (
          <>
            <form onSubmit={handleLogin}>
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </form>
            <p className="text-gray-600 mt-6 text-center text-sm">
              Forgot your password?{' '}
              <button
                onClick={() => setCurrentView('forgot')}
                className="text-teal-500 hover:underline"
              >
                Reset it here
              </button>
            </p>
          </>
        )}

        {currentView === 'forgot' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
            {forgotStep === 1 && (
              <>
                <p className="text-gray-600 mb-6 text-center text-sm">Enter your email to receive a reset code</p>
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </form>
              </>
            )}
            {forgotStep === 2 && (
              <>
                <p className="text-gray-600 mb-6 text-center text-sm">Enter the verification code and your new password</p>
                <form onSubmit={handleResetPassword}>
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="code"
                      placeholder="6-digit code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </form>
              </>
            )}
            <p className="text-gray-600 mt-6 text-center text-sm">
              <button
                onClick={() => { setCurrentView('login'); setForgotStep(1); }}
                className="text-teal-500 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-teal-500 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
