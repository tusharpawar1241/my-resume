import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';

export const saveProfileData = async (userId: string, profileData: any) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { profile: profileData }, { merge: true });
};

export const getProfileData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data()?.profile || null;
  }
  return null;
};

export const toggleSavedTemplate = async (userId: string, templateId: string, isSaving: boolean) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    savedTemplates: isSaving ? arrayUnion(templateId) : arrayRemove(templateId)
  }, { merge: true });
};

export const getSavedTemplates = async (userId: string): Promise<string[]> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data()?.savedTemplates || [];
  }
  return [];
};
