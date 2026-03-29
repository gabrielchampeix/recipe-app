import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYo1QOOhCFyc9a8N6XxzsIvtgz0gtm-5M",
    authDomain: "meal-app-bg.firebaseapp.com",
    projectId: "meal-app-bg",
    storageBucket: "meal-app-bg.firebasestorage.app",
    messagingSenderId: "699845271805",
    appId: "1:699845271805:web:8c42c41b574474a39b9e94"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);