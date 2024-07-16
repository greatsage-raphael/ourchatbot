// lib/firebaseConfig.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4cREXQMgzJ8OWYaVflxjzfp2hP2cGCfE",
  authDomain: "red-delight-414207.firebaseapp.com",
  projectId: "red-delight-414207",
  storageBucket: "red-delight-414207.appspot.com",
  messagingSenderId: "459049003749",
  appId: "1:459049003749:web:5b17d017c3425e6164820c"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore: Firestore = getFirestore(app);




export { storage, firestore };

