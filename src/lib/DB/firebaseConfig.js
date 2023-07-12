
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjF6n73puhZX2Y8pigL-INMrQwj_fZ6TQ",
  authDomain: "learning-system-d2f92.firebaseapp.com",
  projectId: "learning-system-d2f92",
  storageBucket: "learning-system-d2f92.appspot.com",
  messagingSenderId: "203475376901",
  appId: "1:203475376901:web:d91c6f0ff0c0af0467b56c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { writable } from "svelte/store";

export const auth = writable(getAuth(app));
export const db = writable(getFirestore(app));
export const storage = writable(getStorage(app));