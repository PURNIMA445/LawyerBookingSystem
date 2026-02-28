// src/hooks/useFCMToken.js
import { useEffect } from "react";
import { messaging} from "../firebase";
import { getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

export const useFCMToken = (userId) => {
  useEffect(() => {
    const requestToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: "BMY_FsqTTdqDcfOfImXUZwKKmxCqCf08cM6GdMoC1VSwl4q2EQUHcKv40RPAZIIRbT8ryaUuAjjirDqUvthriKM",
          });
          if (token) {
            await setDoc(doc(db, "users", userId), { fcmToken: token }, { merge: true });
            console.log("FCM token saved", token);
          }
        }
      } catch (error) {
        console.error("FCM error:", error);
      }
    };
    if (userId) requestToken(); // ✅ only run if userId exists
  }, [userId]);
};