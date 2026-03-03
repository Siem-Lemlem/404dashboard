/*
 * Copyright (c) 2025 Siem Lemlem
 * This file is part of 404Dashboard.
 * Licensed under the GNU Affero General Public License v3.0 or later.
 * See the LICENSE file for more details.
 */


import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Toaster } from 'react-hot-toast';
import { auth, db } from './firebase';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userProfileRef = doc(db, 'users', currentUser.uid, 'profile', 'info');

        try {
          const profileSnap = await getDoc(userProfileRef);

          if (!profileSnap.exists()) {
            console.log('New user detected, creating profile...');

            await setDoc(userProfileRef, {
              email: currentUser.email,
              displayName: currentUser.displayName || null,
              photoURL: currentUser.photoURL || null,
              createdAt: serverTimestamp(),
              hasCompletedOnboarding: false
            });

            setShowWelcome(true);
          } else {
            const profileData = profileSnap.data();

            if (!profileData.hasCompletedOnboarding) {
              setShowWelcome(true);
            }
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }

        setLoading(false);
      } else {
        setUser(null);
        setShowWelcome(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#a78bfa',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Landing Page - Public */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Page - Only if not logged in */}
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        
        {/* Dashboard - Protected Route */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;