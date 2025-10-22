import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
      ) : (
        <AuthPage />
      )}
    </>
  );
}

export default App;