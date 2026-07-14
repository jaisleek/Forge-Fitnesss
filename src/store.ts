import { useState, useEffect } from 'react';
import { User, Routine, WorkoutLog } from './types';
import { supabase } from './lib/supabase';

// Simple persistence wrapper for local storage
const loadData = <T,>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveData = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadData('forge_user', null));
  const [users, setUsers] = useState<User[]>([]);
  const [routines, setRoutines] = useState<Routine[]>(() => loadData('forge_routines', []));
  const [logs, setLogs] = useState<WorkoutLog[]>(() => loadData('forge_logs', []));

  useEffect(() => {
    saveData('forge_user', currentUser);
    
    if (currentUser) {
      // Fetch routines from Supabase
      supabase.from('routines')
        .select('*')
        .eq('user_id', currentUser.id)
        .then(({ data }) => {
          if (data) {
            const mappedRoutines = data.map(r => ({
              id: r.id,
              userId: r.user_id,
              name: r.name,
              description: r.description,
              exercises: typeof r.exercises === 'string' ? JSON.parse(r.exercises) : r.exercises,
              createdAt: new Date(r.created_at).getTime()
            }));
            setRoutines(mappedRoutines);
          }
        });

      // Fetch logs from Supabase
      supabase.from('workout_logs')
        .select('*')
        .eq('user_id', currentUser.id)
        .then(({ data }) => {
          if (data) {
            const mappedLogs = data.map(l => ({
              id: l.id,
              userId: l.user_id,
              routineId: l.routine_id,
              routineName: l.routine_name,
              date: new Date(l.date).getTime(),
              durationMinutes: l.duration_minutes
            }));
            setLogs(mappedLogs);
          }
        });
    } else {
      setRoutines([]);
      setLogs([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (routines.length > 0) saveData('forge_routines', routines);
  }, [routines]);

  useEffect(() => {
    if (logs.length > 0) saveData('forge_logs', logs);
  }, [logs]);

  return {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    routines,
    setRoutines,
    logs,
    setLogs,
  };
};
