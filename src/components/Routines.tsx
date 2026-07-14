import React, { useState } from 'react';
import { Routine, Exercise, User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit2, Play, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';

interface RoutinesProps {
  routines: Routine[];
  setRoutines: (routines: Routine[]) => void;
  currentUser: User;
}

export function Routines({ routines, setRoutines, currentUser }: RoutinesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Track active workout
  const { logs, setLogs } = useStore();
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: uuidv4(), name: '', sets: 3, reps: 10 }]);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSaveRoutine = async () => {
    if (!name.trim()) return;
    setIsSaving(true);

    try {
      if (editingId) {
        await supabase.from('routines').update({
          name,
          description,
          exercises: exercises as any
        }).eq('id', editingId);

        setRoutines(routines.map(r => r.id === editingId ? {
          ...r, name, description, exercises
        } : r));
      } else {
        const newRoutine = {
          id: uuidv4(),
          userId: currentUser.id,
          name,
          description,
          exercises,
          createdAt: Date.now()
        };

        await supabase.from('routines').insert({
          id: newRoutine.id,
          user_id: newRoutine.userId,
          name: newRoutine.name,
          description: newRoutine.description,
          exercises: newRoutine.exercises as any
        });

        setRoutines([...routines, newRoutine]);
      }

      setIsCreating(false);
      setEditingId(null);
      setName('');
      setDescription('');
      setExercises([]);
    } catch (error) {
      console.error('Failed to save routine', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      await supabase.from('routines').delete().eq('id', id);
      setRoutines(routines.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete routine', error);
    }
  };

  const startWorkout = (routine: Routine) => {
    setActiveRoutine(routine);
    setWorkoutStartTime(Date.now());
  };

  const finishWorkout = async () => {
    if (!activeRoutine || !workoutStartTime) return;
    setIsSaving(true);
    
    try {
      const durationMs = Date.now() - workoutStartTime;
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000));

      const newLog = {
        id: uuidv4(),
        userId: currentUser.id,
        routineId: activeRoutine.id,
        routineName: activeRoutine.name,
        date: Date.now(),
        durationMinutes
      };

      await supabase.from('workout_logs').insert({
        id: newLog.id,
        user_id: newLog.userId,
        routine_id: newLog.routineId,
        routine_name: newLog.routineName,
        date: new Date(newLog.date).toISOString(),
        duration_minutes: newLog.durationMinutes
      });

      setLogs([...logs, newLog]);

      setActiveRoutine(null);
      setWorkoutStartTime(null);
    } catch (error) {
      console.error('Failed to save workout log', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (activeRoutine) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-indigo-600">Workout in Progress</h2>
              <p className="text-slate-900 font-bold text-xl mt-1">{activeRoutine.name}</p>
            </div>
            <div className="animate-pulse flex items-center space-x-2 text-indigo-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-bold">Active</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {activeRoutine.exercises.map((ex, idx) => (
              <div key={ex.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{ex.name}</h4>
                    <p className="text-slate-500 text-sm">{ex.sets} sets × {ex.reps} reps {ex.weight ? `@ ${ex.weight}kg` : ''}</p>
                  </div>
                </div>
                {/* In a fuller app we'd track each set here */}
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveRoutine(null)}
              className="flex-1 py-3 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
            >
              Cancel Workout
            </button>
            <button 
              onClick={finishWorkout}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Finish & Save Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isCreating || editingId) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {editingId ? 'Edit Routine' : 'Create Routine'}
          </h1>
          <button 
            onClick={() => { setIsCreating(false); setEditingId(null); }}
            className="text-slate-400 hover:text-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Routine Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Upper Body Power"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Description (Optional)</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              placeholder="Focus on chest and back..."
            />
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Exercises</h3>
              <button 
                onClick={handleAddExercise}
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-bold"
              >
                <Plus size={16} />
                <span>Add Exercise</span>
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {exercises.map((ex, index) => (
                  <motion.div 
                    key={ex.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group"
                  >
                    <button 
                      onClick={() => removeExercise(ex.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-6">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Exercise Name</label>
                        <input 
                          type="text" 
                          value={ex.name}
                          onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-indigo-600 outline-none"
                          placeholder="Bench Press"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Sets</label>
                        <input 
                          type="number" 
                          value={ex.sets}
                          onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Reps</label>
                        <input 
                          type="number" 
                          value={ex.reps}
                          onChange={(e) => updateExercise(ex.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={ex.weight || ''}
                          onChange={(e) => updateExercise(ex.id, 'weight', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-indigo-600 outline-none"
                          placeholder="--"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {exercises.length === 0 && (
                <div className="text-center py-6 text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No exercises added yet.
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleSaveRoutine}
            disabled={!name.trim() || exercises.length === 0}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-sm disabled:shadow-none flex items-center justify-center space-x-2"
          >
            <Save size={18} />
            <span>Save Routine</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Routines</h1>
          <p className="text-slate-500 mt-1">Manage and start your custom workouts.</p>
        </div>
        <button 
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setName('');
            setDescription('');
            setExercises([]);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Routine</span>
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Plus size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No routines yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Create your first custom workout routine to start tracking your progress.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
          >
            Create Routine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <motion.div 
              key={routine.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingId(routine.id);
                    setName(routine.name);
                    setDescription(routine.description || '');
                    setExercises(routine.exercises);
                    setIsCreating(true);
                  }}
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1 pr-16">{routine.name}</h3>
              {routine.description && (
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{routine.description}</p>
              )}
              
              <div className="mt-4 space-y-2 mb-6 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Exercises ({routine.exercises.length})</p>
                {routine.exercises.slice(0, 3).map((ex) => (
                  <div key={ex.id} className="text-sm text-slate-600 flex justify-between">
                    <span>{ex.name}</span>
                    <span className="text-slate-400">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <div className="text-sm text-indigo-600 font-medium pt-1">+ {routine.exercises.length - 3} more</div>
                )}
              </div>

              <button 
                onClick={() => startWorkout(routine)}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors border border-indigo-100"
              >
                <Play size={18} />
                <span>Start Workout</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
