import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,  } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCDgATgq6C9y2wnNxkBKdkzqvSVMj0QVIw",
    authDomain: "venture-carrier.firebaseapp.com",
    projectId: "venture-carrier",
    storageBucket: "venture-carrier.appspot.com",
    messagingSenderId: "280655136527",
    appId: "1:280655136527:web:9d545f1c74abee7993607a",
    measurementId: "G-Q640QW48VQ"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(); 
const auth = getAuth();

export { app, db, auth }