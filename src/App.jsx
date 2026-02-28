import React from "react";
import MyRoute from "./MyRoute";
import { useFCMToken } from "./hooks/useFCMToken";

function App() {
  const lawyerId = "lawyer123"; // replace with real auth user id later
  useFCMToken(lawyerId);       // saves FCM token to Firestore for lawyer

  return <MyRoute />;
}

export default App;