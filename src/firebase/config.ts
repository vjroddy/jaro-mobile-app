// Firebase config — reads values from Expo Constants (app.json > extra.firebase)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

const expoExtra = Constants.expoConfig?.extra as any;
const firebaseExtra = expoExtra?.firebase || {};

const firebaseConfig = {
  apiKey: firebaseExtra.apiKey || '<FIREBASE_API_KEY>',
  authDomain: firebaseExtra.authDomain || '<FIREBASE_AUTH_DOMAIN>',
  projectId: firebaseExtra.projectId || '<FIREBASE_PROJECT_ID>',
  storageBucket: firebaseExtra.storageBucket || '<FIREBASE_STORAGE_BUCKET>',
  messagingSenderId: firebaseExtra.messagingSenderId || '<FIREBASE_MESSAGING_SENDER_ID>',
  appId: firebaseExtra.appId || '<FIREBASE_APP_ID>'
};

export function initializeFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
