import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCf0sODEOvoW9bUevK9efOBeodjb-TiwHw",
    authDomain: "mern-blog-website-551c9.firebaseapp.com",
    projectId: "mern-blog-website-551c9",
    storageBucket: "mern-blog-website-551c9.appspot.com",
    messagingSenderId: "717671981716",
    appId: "1:717671981716:web:4c6e203d07ede634634a81"
};

const app = initializeApp(firebaseConfig);


// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider) 
    .then((result) => {
        user = result.user;
    })
    .catch((err) => {
        console.log(err);
    })

    return user;
}