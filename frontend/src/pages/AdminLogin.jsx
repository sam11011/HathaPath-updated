import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/dashboard');
    } catch (error) {
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const handleSetup = async () => {
    try {
      const response = await axios.post(`${API}/admin/setup`);
      toast.success(response.data.message);
      if (response.data.password) {
        toast.info(`Default credentials: ${response.data.username} / ${response.data.password}`);
      }
    } catch (error) {
      toast.error('Setup failed');
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
            <span className="font-display text-2xl text-charcoal">Hatha Path</span>
          </a>
          <p className="text-charcoal/60 mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-sand-200" data-testid="login-card">
          <h1 className="font-display text-2xl text-charcoal text-center mb-6" data-testid="login-title">
            Welcome Back
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-11 bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
                required
                data-testid="login-username"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 bg-sand-50 border-sand-200 focus:border-terracotta-500 rounded-lg py-3"
                required
                data-testid="login-password"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
              data-testid="login-submit-btn"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Setup link (for first-time setup) */}
          <div className="mt-6 text-center">
            <button
              onClick={handleSetup}
              className="text-sm text-charcoal/50 hover:text-terracotta-500 transition-colors"
              data-testid="setup-btn"
            >
              First time? Click to setup admin
            </button>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-charcoal/60 hover:text-terracotta-500 transition-colors"
            data-testid="back-to-site"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
