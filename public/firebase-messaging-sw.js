importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyA_Mu4P4X57AMmwzmA8xVYyVxLspIE_GLI",
    authDomain: "lawyerapp-3f257.firebaseapp.com",
    projectId: "lawyerapp-3f257",
    storageBucket: "lawyerapp-3f257.firebasestorage.app",
    messagingSenderId: "60874194958",
    appId: "1:60874194958:web:b2c29c68aa687b2497fc5f",
    measurementId: "G-JNKP982Z5V"
  });
  

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Background message received:", payload);
  
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: "/logo192.png"
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
 