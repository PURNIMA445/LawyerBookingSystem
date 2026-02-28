import { useEffect, useState } from "react";
import { FiSend, FiPaperclip, FiCheck, FiCheckCircle, FiUser, FiMoreVertical } from "react-icons/fi";
import { MdGavel } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatBox({ userType, partnerName, partnerRole, accentColor, chatId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // ✅ Listen to real-time messages from Firestore
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // ✅ Send message to Firestore
  const sendMessage = async () => {
    if (!newMsg.trim() || !chatId) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMsg,
      sender: userType,
      createdAt: serverTimestamp(),
      read: false,
    });
    setNewMsg("");
  };

  const isClient = userType === "client";

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: `linear-gradient(135deg, ${accentColor.from}, ${accentColor.to})` }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">
              {isClient ? <MdGavel size={20} /> : <FiUser size={20} />}
            </div>
            <BsCircleFill className="absolute bottom-0 right-0 text-green-400 text-xs" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{partnerName}</p>
            <p className="text-white/70 text-xs">{partnerRole} · Online</p>
          </div>
        </div>
        <FiMoreVertical className="text-white/80 cursor-pointer" size={20} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMine = msg.sender === userType;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isMine
                    ? "text-white rounded-br-sm"
                    : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
                }`}
                style={isMine ? { background: `linear-gradient(135deg, ${accentColor.from}, ${accentColor.to})` } : {}}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                  <span className={`text-xs ${isMine ? "text-white/60" : "text-gray-400"}`}>
                    {msg.createdAt?.toDate
                      ? msg.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Now"}
                  </span>
                  {isMine && (
                    msg.read
                      ? <FiCheckCircle size={11} className="text-white/70" />
                      : <FiCheck size={11} className="text-white/50" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-blue-300 transition-colors">
          <FiPaperclip className="text-gray-400 cursor-pointer hover:text-gray-600 shrink-0" size={18} />
          <input
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${accentColor.from}, ${accentColor.to})` }}
          >
            <FiSend size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}