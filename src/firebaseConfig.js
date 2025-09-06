// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXjh1at8CYB6MU4YT3U7WmGvoEqLb_gT8",
  authDomain: "upload-64416.firebaseapp.com",
  projectId: "upload-64416",
  storageBucket: "upload-64416.firebasestorage.app",
  messagingSenderId: "431535926036",
  appId: "1:431535926036:web:ff30a4e244a94f0ea87001",
  measurementId: "G-DK8Y7Z543K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);