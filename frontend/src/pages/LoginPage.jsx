import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Decorative Background */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative bg-gradient-to-br from-secondary to-[#1a1a1a] rounded-2xl p-8 border border-gray-700 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-glow">
              <span className="text-white text-2xl font-bold">▶</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your Stream account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || localError) && (
              <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg text-sm border border-red-700 flex items-center gap-3">
                <span>⚠️</span>
                <span>{error || localError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white font-bold py-3 rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary text-gray-400">or</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:text-red-400 font-semibold transition-colors duration-200">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
