import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config';
import { checkIsNewUser, createInitialUserDoc } from '../../services/userService';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleUserRouting = useCallback(async (uid: string, email: string | null, phoneNumber: string | null) => {
    try {
      const isNew = await checkIsNewUser(uid);
      if (isNew) {
        // Option to pre-create doc, but wizard can handle it
        await createInitialUserDoc(uid, { email, phone: phoneNumber });
        navigate('/profile-setup');
      } else {
        navigate('/home');
      }
    } catch (e) {
      console.error(e);
      navigate('/home'); // Fallback
    }
  }, [navigate]);

  // Auto-redirect if somehow already logged in and context registers it
  useEffect(() => {
    if (user) {
      handleUserRouting(user.uid, user.email, user.phoneNumber);
    }
  }, [user, handleUserRouting]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      await handleUserRouting(res.user.uid, res.user.email, res.user.phoneNumber);
    } catch (error) {
      console.error(error);
      alert('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full p-6 bg-slate-50">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 px-4 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

