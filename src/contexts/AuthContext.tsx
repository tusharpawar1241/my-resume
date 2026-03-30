import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase/config';

import { AuthContext } from './AuthInstance';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Defer to next tick to avoid synchronous state update warning
      Promise.resolve().then(() => { if (isMounted) setLoading(false); });
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = () => signOut(auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Auth...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook moved to hooks/useAuth.ts

