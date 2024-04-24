import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB7dsVx89Dk4zRBnuQXGMIOSygtMxYMxBY",
  authDomain: "tarefasplus-d7e0d.firebaseapp.com",
  projectId: "tarefasplus-d7e0d",
  storageBucket: "tarefasplus-d7e0d.appspot.com",
  messagingSenderId: "238257995504",
  appId: "1:238257995504:web:b3cde5c15cce2570574c35"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db };