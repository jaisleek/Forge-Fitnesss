import { ViewState } from '../App';
import { Activity, Dumbbell, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function Home({ setCurrentView }: { setCurrentView: (view: ViewState) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Forge Your <span className="text-indigo-600">Perfect Body</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          The ultimate daily fitness companion. Build custom routines, track your progression, and achieve your goals with precise logging.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => setCurrentView('signup')}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Your Journey
          </button>
          <button 
            onClick={() => setCurrentView('login')}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-lg rounded-xl transition-all border border-slate-200"
          >
            I Already Have an Account
          </button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        {[
          { icon: Dumbbell, title: 'Custom Routines', desc: 'Design your perfect workout with precise sets and reps.' },
          { icon: Activity, title: 'Daily Tracking', desc: 'Log your performance and hold yourself accountable.' },
          { icon: TrendingUp, title: 'Visual Progress', desc: 'Watch your consistency grow over time with detailed charts.' },
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500">{feature.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
