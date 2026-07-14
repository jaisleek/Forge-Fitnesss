import React, { useMemo } from 'react';
import { WorkoutLog } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Activity, Flame, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Progress({ logs }: { logs: WorkoutLog[] }) {
  // Generate last 7 days of data
  const weeklyData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayLogs = logs.filter(log => isSameDay(new Date(log.date), day));
      const duration = dayLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      
      return {
        name: format(day, 'EEE'), // Mon, Tue, etc.
        fullDate: format(day, 'MMM d, yyyy'),
        workouts: dayLogs.length,
        duration,
      };
    });
  }, [logs]);

  const totalDuration = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const avgDuration = logs.length > 0 ? Math.round(totalDuration / logs.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Progress</h1>
        <p className="text-slate-500 mt-1">Visualize your consistency and dedication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center space-x-4 shadow-sm"
        >
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Total Workouts</p>
            <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center space-x-4 shadow-sm"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Total Time</p>
            <p className="text-2xl font-bold text-slate-900">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center space-x-4 shadow-sm"
        >
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Avg Duration</p>
            <p className="text-2xl font-bold text-slate-900">{avgDuration}m</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Workouts (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                />
                <Bar dataKey="workouts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Duration (Minutes)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="duration" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
