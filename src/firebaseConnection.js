    import {initializeApp} from 'firebase/app'
    import {getFirestore} from 'firebase/firestore'
    import {getAuth} from 'firebase/auth'

const firebaseConfig = {

    apiKey: "AIzaSyBTRkSdQ6Iqy_rQT8aJqU_T08dvrv1SUEY",
    authDomain: "curso-91ce9.firebaseapp.com",
    projectId: "curso-91ce9",
    storageBucket: "curso-91ce9.appspot.com",
    messagingSenderId: "243754922172",
    appId: "1:243754922172:web:9ed4cbba13cef94cbb60b9",
    measurementId: "G-1CKTSR5HZN"

};
//inicializou o firebase
const firebaseApp = initializeApp(firebaseConfig)
//inicializou o banco
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export {db, auth}