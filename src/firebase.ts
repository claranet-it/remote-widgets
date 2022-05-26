import firebase, { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEW_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

let app: firebase.FirebaseApp | null = null;

export default function initFirebase(): firebase.FirebaseApp {
    if (app) {
        return app;
    }

    app = initializeApp(firebaseConfig, "remote-tools-app");

    return app;
}