/**
 * Firebase Configuration & Settings
 * Подключено к вашему проекту Firebase: raspisanie-3a39d
 */

window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyAfL3MHPlGS1mCo9B4b6z5p3UqgAQXaYlo",
    authDomain: "raspisanie-3a39d.firebaseapp.com",
    projectId: "raspisanie-3a39d",
    storageBucket: "raspisanie-3a39d.firebasestorage.app",
    messagingSenderId: "996391179431",
    appId: "1:996391179431:web:21ad8477ec5fe27f84b782",
    measurementId: "G-DW9WZGNFVK"
};

// Список email-адресов администраторов
// И ТОЛЬКО ЭТИ EMAIL имеют права Администратора!
window.ADMIN_EMAILS = [
    "roganinstepan36@gmail.com",
    "steamvichsteam@gmail.com",
    "m69227503@gmail.com"
];

// Проверка: заполнен ли конфиг Firebase пользователем
window.isFirebaseConfigured = function() {
    return window.FIREBASE_CONFIG && 
           window.FIREBASE_CONFIG.apiKey && 
           !window.FIREBASE_CONFIG.apiKey.startsWith("PASTE_");
};
