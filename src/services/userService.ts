import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const checkIsNewUser = async (userId: string): Promise<boolean> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return !userSnap.exists();
};

export const createInitialUserDoc = async (userId: string, authData: { email?: string | null; phone?: string | null }) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    createdAt: new Date(),
    ...authData,
  }, { merge: true });
};
