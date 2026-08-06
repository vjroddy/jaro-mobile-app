# JARO Mobile App (Expo + Firebase) - minimal scaffold

This repo contains a minimal Expo + TypeScript scaffold for a mobile MVP using Firebase (Auth, Firestore, Storage).

Run locally
1. Install expo-cli if you don't have it: npm install -g expo-cli
2. Clone and install dependencies:
   npm install
3. Copy environment example and fill Firebase values:
   cp .env.example .env
4. Start the dev server:
   npm start
   or
   npm run android

Notes
- Fill in Firebase config values in src/firebase/config.ts or use a secure secrets flow.
- This is a starter scaffold: implement features, screens, and backend rules as needed.

Files added
- package.json, tsconfig.json, app.json
- src/ with basic screens and firebase config

