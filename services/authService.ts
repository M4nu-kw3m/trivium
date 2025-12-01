import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const registerUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    };
  } catch (error: any) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    };
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error.message);
    throw error;
  }
};

export const getCurrentUser = (callback: (user: AuthUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    } else {
      callback(null);
    }
  });
};
