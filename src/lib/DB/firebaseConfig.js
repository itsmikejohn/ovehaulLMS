// @ts-nocheck

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYvLKe-AmHrAV1T3D1YGOG4GLmob7ka94",
  authDomain: "learningsystem-ca3f3.firebaseapp.com",
  projectId: "learningsystem-ca3f3",
  storageBucket: "learningsystem-ca3f3.appspot.com",
  messagingSenderId: "672421147198",
  appId: "1:672421147198:web:b6ae6301dad22203e1d76f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { writable } from "svelte/store";

export const auth = writable(getAuth(app));
export const db = writable(getFirestore(app));
export const storage = writable(getStorage(app));
//www.youtube.com/@mikeSharesCode



