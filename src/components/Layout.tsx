import React from 'react';
import { Dumbbell, LayoutDashboard, List, Activity, LogOut, Menu, X } from 'lucide-react';
import { ViewState } from '../App';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function Layout({ children, currentView, setCurrentView, currentUser, onLogout }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'routines', label: 'Routines', icon: List },
    { id: 'progress', label: 'Progress', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setCurrentView(currentUser ? 'dashboard' : 'home')}
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Dumbbell size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Forge<span className="text-indigo-600">Fitness</span></span>
          </div>

          {currentUser ? (
            <>
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-8">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as ViewState)}
                      className={`flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
                        currentView === item.id 
                          ? 'text-indigo-600 bg-indigo-50' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm font-semibold text-slate-800">{currentUser.name}</span>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-slate-500 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              {currentView !== 'login' && currentView !== 'signup' && (
                <>
                  <button 
                    onClick={() => setCurrentView('login')}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => setCurrentView('signup')}
                    className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Nav Dropdown */}
        {currentUser && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as ViewState);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg text-left ${
                      currentView === item.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg text-left text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
