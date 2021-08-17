import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMNFJAS8nFpvHdtu3aYgAj9aUSfpFY4AY",
  authDomain: "graph-library-kl.firebaseapp.com",
  databaseURL:
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "graph-library-kl",
  storageBucket: "graph-library-kl.appspot.com",
  messagingSenderId: "858908929542",
  appId: "1:858908929542:web:6129b5e9b033604e481d87",
};

export const app = firebase.initializeApp(firebaseConfig);
