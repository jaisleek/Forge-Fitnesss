import { ViewState } from '../App';
import { Routine, WorkoutLog } from '../types';
import { ArrowRight, Calendar, Activity, Play } from 'lucide-react';
import { format, isThisWeek } from 'date-fns';
import { motion } from 'motion/react';

interface DashboardProps {
  setCurrentView: (view: ViewState) => void;
  routines: Routine[];
  logs: WorkoutLog[];
}

export function Dashboard({ setCurrentView, routines, logs }: DashboardProps) {
  const thisWeekLogs = logs.filter(log => isThisWeek(log.date));
  
  const totalWorkouts = logs.length;
  const thisWeekCount = thisWeekLogs.length;
  
  const recentLogs = [...logs].sort((a, b) => b.date - a.date).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-1">Track your progress and start your next workout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">This Week</h3>
          </div>
          <div className="mt-auto">
            <span className="text-4xl font-bold text-slate-900">{thisWeekCount}</span>
            <span className="text-slate-500 ml-2">workouts</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="font-semibold text-slate-800">Total Workouts</h3>
          </div>
          <div className="mt-auto">
            <span className="text-4xl font-bold text-slate-900">{totalWorkouts}</span>
            <span className="text-slate-500 ml-2">all time</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-indigo-900 p-6 rounded-2xl flex flex-col relative overflow-hidden shadow-xl shadow-indigo-200"
        >
          <div className="absolute -right-4 -bottom-4 text-indigo-400/30">
            <Play size={100} />
          </div>
          <h3 className="font-semibold text-white mb-2 relative z-10">Ready to train?</h3>
          <p className="text-indigo-200 text-sm mb-6 relative z-10">Select a routine and start pushing your limits.</p>
          <button 
            onClick={() => setCurrentView('routines')}
            className="mt-auto bg-white text-indigo-900 font-bold py-2.5 px-4 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors relative z-10 w-full"
          >
            <span>View Routines</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <button 
              onClick={() => setCurrentView('progress')}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
            >
              View all
            </button>
          </div>
          
          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div>
                    <h4 className="font-bold text-slate-800">{log.routineName}</h4>
                    <p className="text-sm text-slate-500">{format(log.date, 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600">{log.durationMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No workouts recorded yet.</p>
              <button 
                onClick={() => setCurrentView('routines')}
                className="mt-2 text-indigo-600 font-medium hover:underline"
              >
                Start your first routine
              </button>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Routines</h2>
            <button 
              onClick={() => setCurrentView('routines')}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
            >
              Manage
            </button>
          </div>
          
          {routines.length > 0 ? (
            <div className="space-y-4">
              {routines.slice(0, 3).map((routine) => (
                <div key={routine.id} className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800">{routine.name}</h4>
                  <p className="text-sm text-slate-500 mb-3">{routine.exercises.length} exercises</p>
                  <button 
                    onClick={() => setCurrentView('routines')}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg transition-colors"
                  >
                    Start Workout
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>You haven't created any routines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
