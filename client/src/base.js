import firebase from "firebase";
import "firebase/auth";
require("dotenv").config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnfCKwNIlYhChOoTmcMYM2GCwOzb5vbZI",
  authDomain: "tickaholic-15be5.firebaseapp.com",
  projectId: "tickaholic-15be5",
  storageBucket: "tickaholic-15be5.appspot.com",
  messagingSenderId: "579064064349",
  appId: "1:579064064349:web:0fdaec43beabce19ce20b4",
  measurementId: "G-2K05EEYWCM",
};
const app = firebase.initializeApp(firebaseConfig);

export default app;
