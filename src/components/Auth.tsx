import React, { useState } from 'react';
import { ViewState } from '../App';
import { User } from '../types';
import { motion } from 'motion/react';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  view: 'login' | 'signup';
  setCurrentView: (view: ViewState) => void;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export function Auth({ view, setCurrentView, setCurrentUser, users, setUsers }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (view === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          // Fetch user details from public.users table
          const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (dbError && dbError.code !== 'PGRST116') {
             console.error("Failed to fetch user data", dbError);
          }

          setCurrentUser({
            id: data.user.id,
            email: data.user.email || email,
            name: userData?.name || data.user.user_metadata?.name || email.split('@')[0],
          });
          setCurrentView('dashboard');
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });

        if (authError) throw authError;

        if (data.user) {
          const newUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: name || email.split('@')[0] || 'User',
          };
          
          // Add to public users table
          const { error: insertError } = await supabase.from('users').insert(newUser);
          if (insertError) {
             console.error("Failed to insert into public.users", insertError);
          }
          
          setCurrentUser(newUser);
          setCurrentView('dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-xl shadow-indigo-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500">
            {view === 'login' 
              ? 'Enter your details to access your account.' 
              : 'Sign up to start tracking your fitness journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm"
          >
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setCurrentView(view === 'login' ? 'signup' : 'login')}
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {view === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 text-center">
          <p>Your fitness data is securely backed up in the cloud.</p>
        </div>
      </motion.div>
    </div>
  );
}
