// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyAZLoqwiML3Dk_YXYgGq-dSAQAiIRqGBCc",
    authDomain: "pantrypal-6aeac.firebaseapp.com",
    projectId: "pantrypal-6aeac",
    storageBucket: "pantrypal-6aeac.appspot.com",
    messagingSenderId: "651475018944",
    appId: "1:651475018944:web:26f2f4e0365f6e54a9b925",
    measurementId: "G-ZLWSFQDJLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);