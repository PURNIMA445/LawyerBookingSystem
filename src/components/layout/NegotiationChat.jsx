import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../api/messagesApi";

const NegotiationChat = ({ appointmentId, title = "Negotiation" }) => {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setErr("");
      const data = await getMessages(appointmentId);
      setMsgs(data || []);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    if (!appointmentId) return;
    load();
    const t = setInterval(load, 4000); 
    return () => clearInterval(t);
  }, [appointmentId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await sendMessage(appointmentId, text.trim());
      setText("");
      await load();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-4 bg-white">
      <div className="font-semibold text-[#142768]">{title}</div>

      {err ? <div className="text-sm text-red-600 mt-2">{err}</div> : null}

      <div className="mt-3 max-h-64 overflow-auto border rounded-xl p-3 bg-gray-50">
        {msgs.length ? (
          msgs.map((m) => (
            <div key={m.message_id} className="mb-3">
              <div className="text-xs text-gray-500">
                {m.sender_role.toUpperCase()} • {new Date(m.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-gray-800">{m.message}</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-600">No messages yet.</div>
        )}
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          className="flex-1 border rounded-xl px-3 py-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-[#142768] text-white px-4 py-2 rounded-xl hover:opacity-95"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default NegotiationChat;
