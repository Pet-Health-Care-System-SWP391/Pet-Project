// src/Components/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "veterinaryclinic-422805.firebaseapp.com",
  projectId: "veterinaryclinic-422805",
  storageBucket: "veterinaryclinic-422805.appspot.com",
  messagingSenderId: "385189370632",
  appId: "1:385189370632:web:9dc871608f26d8a2f02abd",
  measurementId: "G-B42DEKS32T",
  databaseURL: "https://veterinaryclinic-422805-default-rtdb.firebaseio.com/",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const imageDb = getStorage(app);

export { auth, provider, imageDb, database };
