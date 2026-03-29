import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth, googleProvider, setupRecaptcha } from '../../firebase/config';
import { checkIsNewUser, createInitialUserDoc } from '../../services/userService';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Auto-redirect if somehow already logged in and context registers it
  useEffect(() => {
    if (user) {
      handleUserRouting(user.uid, user.email, user.phoneNumber);
    }
  }, [user]);

  const handleUserRouting = async (uid: string, email: string | null, phoneNumber: string | null) => {
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
  };

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

  const handleSendOTP = async () => {
    if (!phone) return;
    try {
      setLoading(true);
      const verifier = setupRecaptcha('recaptcha-container');
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(confirmation);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Ensure phone format is +1234567890.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !confirmationResult) return;
    try {
      setLoading(true);
      const res = await confirmationResult.confirm(otp);
      await handleUserRouting(res.user.uid, res.user.email, res.user.phoneNumber);
    } catch (error) {
      console.error(error);
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full p-6 bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-brand-700">ATC Resume Maker</h1>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>Sign in with Google</span>
        </button>

        <div className="relative pt-4 pb-2">
          <div className="absolute inset-x-0 top-1/2 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-50 text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
          {!confirmationResult ? (
            <>
              <input
                type="tel"
                placeholder="Phone (e.g. +1...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone}
                className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-brand-700 transition-colors font-medium disabled:opacity-50"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 tracking-widest text-center text-xl"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-brand-600 text-white py-3 px-4 rounded-lg shadow-sm hover:bg-brand-700 transition-colors font-medium disabled:opacity-50"
              >
                Verify & Login
              </button>
            </>
          )}
          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
