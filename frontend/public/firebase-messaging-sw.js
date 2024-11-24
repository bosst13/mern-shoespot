// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

// importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDJDC83ZIwfBmImdQ2qiTzkeVp7e-pzuAs",
    authDomain: "shoespot-f885d.firebaseapp.com",
    projectId: "shoespot-f885d",
    storageBucket: "shoespot-f885d.firebasestorage.app",
    messagingSenderId: "107379100136",
    appId: "1:107379100136:web:934841a3275a2f3b63bc5d",
    measurementId: "G-6JJ47W8NV5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message: ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
});