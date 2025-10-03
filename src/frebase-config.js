import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";ute
import {BrowserRouter as Router,Routes,Route,Link} from 'react-router-dom'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABoawYveT5EWcMQ7V5OPeBEIIs_Rm_U6o",
  authDomain: "blogmunity.firebaseapp.com",
  projectId: "blogmunity",
  storageBucket: "blogmunity.firebasestorage.app",
  messagingSenderId: "771439493795",
  appId: "1:771439493795:web:15eeae60e0f774d79d7516"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();