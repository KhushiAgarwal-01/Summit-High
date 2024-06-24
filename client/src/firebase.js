// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "summithigh-mern.firebaseapp.com",
  projectId: "summithigh-mern",
  storageBucket: "summithigh-mern.appspot.com",
  messagingSenderId: "988611046578",
  appId: "1:988611046578:web:551066431ea75bcee3edab"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);