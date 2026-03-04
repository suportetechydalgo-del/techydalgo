import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADWdtxpdQjgckTl09QqoBOPv-PYCWm6Ow",
  authDomain: "techydalgo.firebaseapp.com",
  projectId: "techydalgo",
  storageBucket: "techydalgo.firebasestorage.app",
  messagingSenderId: "192638237601",
  appId: "1:192638237601:web:15e766b7ea14e35001a9e0",
  measurementId: "G-YEXN4QZV6T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);