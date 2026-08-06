import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '<FIREBASE_API_KEY>',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '<FIREBASE_AUTH_DOMAIN>',
  projectId: process.env.FIREBASE_PROJECT_ID || '<FIREBASE_PROJECT_ID>',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '<FIREBASE_STORAGE_BUCKET>',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '<FIREBASE_MESSAGING_SENDER_ID>',
  appId: process.env.FIREBASE_APP_ID || '<FIREBASE_APP_ID>'
};

export function initializeFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
