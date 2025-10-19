import React, { useState } from 'react';
import { Mail, Lock, Chrome } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthPage() {
  // STATE MANAGEMENT
  const [isLogin, setIsLogin] = useState(true);
  
  // Form inputs - using controlled components (React pattern)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  
  // Loading state - prevent double submissions, show feedback
  const [loading, setLoading] = useState(false);

  // EMAIL/PASSWORD AUTH HANDLER
  const handleEmailAuth = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    setError(''); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      if (isLogin) {
        // LOGIN: check if email/password match existing user
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // SIGNUP: create new user account
        await createUserWithEmailAndPassword(auth, email, password);
      }

    } catch (err) {
      // Firebase errors are cryptic, let's make them user-friendly
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false); // Always turn off loading, even if error
    }
  };

  // GOOGLE AUTH HANDLER
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      // GoogleAuthProvider creates the popup window
      const provider = new GoogleAuthProvider();
      // signInWithPopup opens Google's OAuth page
      await signInWithPopup(auth, provider);
      // Firebase handles the rest - token exchange, user creation, etc.
    } catch (err) {
      // User closed popup or something went wrong
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Full screen centered container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      
      {/* Auth card - glassmorphic design matching dashboard */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">404Dashboard</h1>
          <p className="text-gray-300">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Google Sign-in Button - should be first/most prominent */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Email/Password Form */}
        <div className="space-y-4">
          {/* Error message display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email input with icon */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password input with icon */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleEmailAuth}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        {/* Toggle between login/signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(''); // Clear errors when switching modes
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}