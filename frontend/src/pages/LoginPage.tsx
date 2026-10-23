import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Library, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password });
      // Redirect based on role
      if (user.role === 'ADMIN') navigate('/');
      else if (user.role === 'LIBRARIAN') navigate('/');
      else navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-brand-600/20 border border-brand-500/30 shadow-xl shadow-brand-500/10">
            <Library className="w-8 h-8 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Library</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/25 px-3 py-2 text-sm text-rose-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              id="login-email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightElement={
                <button type="button" onClick={() => setShowPw(p => !p)} className="text-slate-400 hover:text-slate-200 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Button type="submit" variant="primary" className="w-full mt-2" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="pt-2 border-t border-slate-700/60">
            <p className="text-xs font-medium text-slate-400 mb-2">Demo Credentials (click to fill):</p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@smartlibrary.com');
                  setPassword('Admin@123');
                }}
                className="px-2 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-center transition-colors font-medium"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('librarian@smartlibrary.com');
                  setPassword('Librarian@123');
                }}
                className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-center transition-colors font-medium"
              >
                Librarian
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('rahul@example.com');
                  setPassword('Password@123');
                }}
                className="px-2 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-center transition-colors font-medium"
              >
                Student
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          New student?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
