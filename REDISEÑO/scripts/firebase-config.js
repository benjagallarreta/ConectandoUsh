// ========================================
// FIREBASE CONFIG
// ========================================

// TUS CREDENCIALES DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCMGIytYdHliyByiZgDWduByWf_nfB5_MM",
    authDomain: "conectandoush-f6487.firebaseapp.com",
    projectId: "conectandoush-f6487",
    storageBucket: "conectandoush-f6487.firebasestorage.app",
    messagingSenderId: "834053942632",
    appId: "1:834053942632:web:83bfbd6882213148d5fadd",
    measurementId: "G-XFNJ350HQM"
};

// Inicializar Firebase
let app, db;

function initFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase inicializado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
        return false;
    }
}

// Exportar para uso global
window.firebaseDB = {
    init: initFirebase,
    getDB: () => db
};