/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useStore } from './store';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Routines } from './components/Routines';
import { Progress } from './components/Progress';

export type ViewState = 'home' | 'login' | 'signup' | 'dashboard' | 'routines' | 'progress';

export default function App() {
  const { currentUser, setCurrentUser, users, setUsers, routines, setRoutines, logs, setLogs } = useStore();
  const [currentView, setCurrentView] = useState<ViewState>(currentUser ? 'dashboard' : 'home');

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  if (!currentUser && (currentView === 'dashboard' || currentView === 'routines' || currentView === 'progress')) {
    setCurrentView('home');
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} currentUser={currentUser} onLogout={handleLogout}>
      {currentView === 'home' && <Home setCurrentView={setCurrentView} />}
      {(currentView === 'login' || currentView === 'signup') && (
        <Auth 
          view={currentView} 
          setCurrentView={setCurrentView} 
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard 
          setCurrentView={setCurrentView} 
          routines={routines.filter(r => r.userId === currentUser?.id)} 
          logs={logs.filter(l => l.userId === currentUser?.id)} 
        />
      )}
      {currentView === 'routines' && currentUser && (
        <Routines 
          routines={routines.filter(r => r.userId === currentUser.id)}
          setRoutines={setRoutines}
          currentUser={currentUser}
        />
      )}
      {currentView === 'progress' && currentUser && (
        <Progress 
          logs={logs.filter(l => l.userId === currentUser.id)} 
        />
      )}
    </Layout>
  );
}

