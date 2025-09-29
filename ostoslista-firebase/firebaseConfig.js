import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJVyEWATeygmA8i_eS1oR4B_YVak4NURQ",
  authDomain: "shoppinglist-86728.firebaseapp.com",
  databaseURL: "https://shoppinglist-86728-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shoppinglist-86728",
  storageBucket: "shoppinglist-86728.firebasestorage.app",
  messagingSenderId: "445761623165",
  appId: "1:445761623165:web:8644d6afbf08c0f9ee8d14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
