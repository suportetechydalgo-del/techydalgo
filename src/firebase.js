import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFVOL-hFP5SRN-Zzhl2hGvAEWDoS5LGeU",
  authDomain: "techydalgo.firebaseapp.com",
  projectId: "techydalgo",
  storageBucket: "techydalgo.firebasestorage.app",
  messagingSenderId: "192638237601",
  appId: "1:192638237601:web:8d4bd59e4c8d873601a9e0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);