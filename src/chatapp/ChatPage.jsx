import { useState, useEffect } from "react";
import { MdOutlineNotificationsActive } from "react-icons/md";
import ChatBox from "./ChatBox";
import NotificationPanel from "./NotificationPanel";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// ─── Fake Users (replace with real auth later) ────────────────────────────────
const FAKE_CLIENT = { id: "client123", name: "Sarah Johnson", role: "Client" };
const FAKE_LAWYER = { id: "lawyer123", name: "James Carter", role: "Attorney" };
const CHAT_ID = `${FAKE_CLIENT.id}_${FAKE_LAWYER.id}`; // unique chat room id

const clientAccent = { from: "#3B82F6", to: "#6366F1" };
const lawyerAccent = { from: "#0F766E", to: "#0369A1" };

export default function ChatPage() {
  const [view, setView] = useState("client"); // "client" | "lawyer"
  const [chatStatus, setChatStatus] = useState("idle"); // "idle" | "pending" | "accepted"
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([]);

  // ✅ Listen to chat request status in real-time
  useEffect(() => {
    const ref = doc(db, "chatRequests", CHAT_ID);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const status = snap.data().status;
        setChatStatus(status);

        // Add notification for lawyer when request is pending
        if (status === "pending") {
          setNotifs([
            {
              id: 1,
              title: "New Chat Request",
              desc: `${FAKE_CLIENT.name} wants to start a chat`,
              time: "Just now",
              unread: true,
            },
          ]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Client sends chat request
  const sendChatRequest = async () => {
    await setDoc(doc(db, "chatRequests", CHAT_ID), {
      from: FAKE_CLIENT.id,
      to: FAKE_LAWYER.id,
      status: "pending",
      createdAt: serverTimestamp(),
    });
  };

  // ✅ Lawyer accepts chat request
  const acceptRequest = async () => {
    await updateDoc(doc(db, "chatRequests", CHAT_ID), {
      status: "accepted",
    });
    setShowNotifs(false);
  };

  // ✅ Lawyer rejects chat request
  const rejectRequest = async () => {
    await updateDoc(doc(db, "chatRequests", CHAT_ID), {
      status: "rejected",
    });
    setNotifs([]);
    setShowNotifs(false);
  };

  const unreadCount = notifs.filter((n) => n.unread).length;
  const clearNotifs = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-start p-6">
      {/* Tab Switcher */}
      <div className="mb-6 flex items-center gap-1 bg-white rounded-xl p-1 shadow-md border border-gray-100">
        <button
          onClick={() => setView("client")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            view === "client" ? "bg-blue-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          👤 Client View
        </button>
        <button
          onClick={() => setView("lawyer")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            view === "lawyer" ? "bg-teal-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⚖️ Lawyer View
        </button>
      </div>

      <div className="w-full max-w-sm relative">
        {/* Lawyer Notification Bell */}
        {view === "lawyer" && (
          <div className="absolute -top-4 right-0 z-10">
            <button
              onClick={() => setShowNotifs((v) => !v)}
              className="relative w-10 h-10 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <MdOutlineNotificationsActive size={20} className="text-teal-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                  <button onClick={clearNotifs} className="text-xs text-blue-500 hover:underline">
                    Mark all read
                  </button>
                </div>
                {notifs.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-6">No notifications</p>
                ) : (
                  notifs.map((n) => (
                    <div key={n.id} className="px-4 py-3 bg-blue-50/40">
                      <p className="text-sm font-medium text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      {/* ✅ Accept / Reject buttons */}
                      {chatStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={acceptRequest}
                            className="flex-1 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={rejectRequest}
                            className="flex-1 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── CLIENT VIEW ─────────────────────────────────────── */}
        {view === "client" && (
          <div className="h-145">
            {chatStatus === "accepted" ? (
              <ChatBox
                userType="client"
                partnerName={FAKE_LAWYER.name}
                partnerRole={FAKE_LAWYER.role}
                accentColor={clientAccent}
                chatId={CHAT_ID}
              />
            ) : chatStatus === "pending" ? (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 gap-3">
                <div className="text-4xl">⏳</div>
                <p className="text-gray-700 font-semibold">Request Sent!</p>
                <p className="text-gray-400 text-sm text-center px-8">
                  Waiting for the lawyer to accept your chat request...
                </p>
              </div>
            ) : chatStatus === "rejected" ? (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 gap-3">
                <div className="text-4xl">❌</div>
                <p className="text-gray-700 font-semibold">Request Rejected</p>
                <button
                  onClick={sendChatRequest}
                  className="mt-2 px-6 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Send Again
                </button>
              </div>
            ) : (
              // idle — client hasn't sent request yet
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 gap-4 px-8">
                <div className="text-5xl">⚖️</div>
                <p className="text-gray-700 font-semibold text-center">
                  Chat with {FAKE_LAWYER.name}
                </p>
                <p className="text-gray-400 text-sm text-center">
                  Send a request to start chatting with your attorney.
                </p>
                <button
                  onClick={sendChatRequest}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)" }}
                >
                  Send Chat Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── LAWYER VIEW ─────────────────────────────────────── */}
        {view === "lawyer" && (
          <div className="h-145">
            {chatStatus === "accepted" ? (
              <ChatBox
                userType="lawyer"
                partnerName={FAKE_CLIENT.name}
                partnerRole={FAKE_CLIENT.role}
                accentColor={lawyerAccent}
                chatId={CHAT_ID}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-gray-100 gap-3">
                <div className="text-4xl">🔔</div>
                <p className="text-gray-700 font-semibold">
                  {chatStatus === "pending" ? "New Chat Request!" : "No active chats"}
                </p>
                <p className="text-gray-400 text-sm text-center px-8">
                  {chatStatus === "pending"
                    ? "Check the notification bell to accept or reject."
                    : "Waiting for a client to send a chat request."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Status: <span className="font-medium capitalize">{chatStatus}</span>
      </p>
    </div>
  );
}