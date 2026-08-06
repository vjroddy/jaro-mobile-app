## Next steps completed

I implemented the requested features across the repository:

- Firebase config wiring via Expo `app.json` extra (edit `app.json` > `expo.extra.firebase` with your project values).
- Image upload component + profile avatar upload (uploads to Firebase Storage and populates `users/{uid}` document).
- Basic Firestore and Storage security rules (firestore.rules, storage.rules) with examples to deploy.
- Basic Expo push notifications helper to request permissions and log the Expo push token.

Local setup reminders
1. Fill firebase keys in app.json > expo.extra.firebase (or use EAS secrets / CI to inject them). Example keys are already in `app.json` placeholders.
2. Enable Email/Password in Firebase Auth, create Firestore database, and enable Storage.
3. Deploy rules (optional but recommended):
   - Install firebase-tools (npm i -g firebase-tools)
   - firebase login
   - firebase init (select Firestore and Storage rules) — point to these rule files or copy them into your firebase project
   - firebase deploy --only firestore:rules,storage:rules

Push notifications
- For push notifications you must configure FCM/APNs in Expo / Firebase and follow Expo docs to upload credentials. The helper logs an Expo push token which you can then send to your server to trigger notifications using Expo push API.

If you want, I can:
- Deploy the Firestore/Storage rules for you (I’ll need your firebase project id and permission to run firebase deploy).
- Wire in profile display name editing, image cropping, and more robust error handling.
- Add a small admin web UI to manage posts/users (separate folder).

