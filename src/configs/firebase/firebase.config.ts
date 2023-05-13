// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALx5Nk2KmtlkmZmIfktMFSK187mOIv1Hs",
  authDomain: "test-data-afb93.firebaseapp.com",
  projectId: "test-data-afb93",
  storageBucket: "test-data-afb93.appspot.com",
  messagingSenderId: "772499827542",
  appId: "1:772499827542:web:6363027efc4f66032a44f7",
  measurementId: "G-E6LCK1S592"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


