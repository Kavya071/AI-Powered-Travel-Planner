// src/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth }                        from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyAj0iaLVDb9h8p9zETzY9NvOEJtkm8JgcI",
  authDomain:        "travel-planner-23c7e.firebaseapp.com",
  projectId:         "travel-planner-23c7e",
  storageBucket:     "travel-planner-23c7e.appspot.com",
  messagingSenderId: "848177283497",
  appId:             "1:848177283497:web:ade200d4a3ef473a7584b8",
  measurementId:     "G-G1LNFBJZD2",
};

// Initialize or reuse Firebase app
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Auth instance
export const auth = getAuth(app);

// Firestore with IndexedDB cache + multi‑tab sync
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    // now specify cacheSizeBytes here (instead of top‑level)
    cacheSizeBytes: 40 * 1024 * 1024, // 40 MB
  }),
});
