import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import api from '@/lib/api';

export interface AppUser {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'BRAND';
  onboardingDone: boolean;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AppUser;
}

/**
 * Login with Google popup → send Firebase token to backend
 */
export async function loginWithGoogle(): Promise<LoginResponse> {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseToken = await result.user.getIdToken();
  const { data } = await api.post('/auth/login', { firebaseToken });
  return data.data;
}

/**
 * Login with email/password via Firebase → send token to backend
 */
export async function loginWithEmail(email: string, password: string): Promise<LoginResponse> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await result.user.getIdToken();
  const { data } = await api.post('/auth/login', { firebaseToken });
  return data.data;
}

/**
 * Register with email/password via Firebase → auto-login to backend
 */
export async function registerWithEmail(email: string, password: string): Promise<LoginResponse> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseToken = await result.user.getIdToken();
  const { data } = await api.post('/auth/login', { firebaseToken });
  return data.data;
}

/**
 * Logout: call backend to blacklist token + clear cookie, then sign out Firebase
 */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    await firebaseSignOut(auth);
  }
}

/**
 * Try to restore session on app load using existing Firebase user
 */
export async function restoreSession(): Promise<LoginResponse | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      unsubscribe();
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      try {
        const firebaseToken = await firebaseUser.getIdToken();
        const { data } = await api.post('/auth/login', { firebaseToken });
        resolve(data.data);
      } catch {
        resolve(null);
      }
    });
  });
}
