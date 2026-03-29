import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { ProfileData } from '../types/profile';

export const saveProfileData = async (userId: string, profileData: ProfileData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { profile: profileData }, { merge: true });
};

export const getProfileData = async (userId: string): Promise<ProfileData | null> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    const data = snap.data()?.profile;
    if (!data) return null;

    // Normalization / Migration
    const normalized = { ...data };
    if (!Array.isArray(normalized.workExperience)) normalized.workExperience = [];
    if (!Array.isArray(normalized.education)) normalized.education = [];
    if (!Array.isArray(normalized.skills)) normalized.skills = [];
    
    if (typeof normalized.projects === 'string') {
      normalized.projects = normalized.projects ? [{
        id: 'migrated-p1',
        title: 'Project Title',
        subtitle: 'Details',
        dateStr: '',
        description: normalized.projects
      }] : [];
    } else if (!Array.isArray(normalized.projects)) {
      normalized.projects = [];
    }

    return normalized as ProfileData;
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
