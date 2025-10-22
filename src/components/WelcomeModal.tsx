import { Rocket, Sparkles } from 'lucide-react';
import { User } from '../types';

interface WelcomeModalProps {
  user: User;
  onTakeTour: () => void;
  onSkip: () => void;
}

export default function WelcomeModal({ user, onTakeTour, onSkip }: WelcomeModalProps) {
  const username = user.email?.split('@')[0] || 'there';

  return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-purple-500/30">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to 404Dashboard!
            </h2>
            <p className="text-gray-300 text-lg">
              Hey {username}! 👋
            </p>
          </div>
  
          <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Never lose a resource again</h3>
                <p className="text-gray-400 text-sm">
                  Save, organize, and search your favorite dev tools across all your devices.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Smart categorization</h3>
                <p className="text-gray-400 text-sm">
                  Organize by Documentation, Tools, APIs, and more with powerful search and filtering.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-white font-semibold mb-1">Real-time sync</h3>
                <p className="text-gray-400 text-sm">
                  Your resources are always up to date, whether you're on your laptop, desktop, or phone.
                </p>
              </div>
            </div>
          </div>
  
          <div className="space-y-3">
            <button
              onClick={onTakeTour}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Take a Tour (Add Sample Resources)
            </button>
            <button
              onClick={onSkip}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-gray-300 font-semibold rounded-lg transition-colors border border-white/20"
            >
              Skip & Start Fresh
            </button>
          </div>
  
          <p className="text-gray-500 text-xs text-center mt-4">
            You can always add resources manually later
          </p>
        </div>
      </div>
    );
}