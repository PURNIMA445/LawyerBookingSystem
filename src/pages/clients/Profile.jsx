import React, { useEffect, useState } from "react";
import {
  clientConfirm,
  clientCounter,
  myAppointments,
} from "../../api/appointmentsApi";
import { useLocation } from "react-router-dom";
import { initiateAppointmentEsewa } from "../../api/paymentApi";
import NegotiationChat from "../../components/layout/NegotiationChat";

/* ================= MESSAGE COMPONENT ================= */
const MessageList = ({ messages, type }) => {
  const filtered = messages.filter((m) => m.message_type === type);

  return (
    <div className="space-y-3">
      {filtered.map((m) => (
        <div
          key={m.message_id}
          className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm
            ${m.sender_role === "client"
              ? "bg-blue-600 text-white ml-auto"
              : "bg-gray-100 text-gray-800"}
          `}
        >
          <div className="text-xs opacity-70 mb-1">{m.sender_role}</div>
          {m.message}
        </div>
      ))}
    </div>
  );
};

/* ================= MAIN ================= */
const Profile = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterMap, setCounterMap] = useState({});
  const [fileMap, setFileMap] = useState({});

  const { search } = useLocation();
  const paymentStatus = new URLSearchParams(search).get("payment");

  const load = async () => {
    const data = await myAppointments();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (paymentStatus === "success") load();
  }, [paymentStatus]);

  const counter = async (id) => {
    await clientCounter(id, {
      proposed_fee: Number(counterMap[id]),
    });
    load();
  };

  const acceptOffer = async (id) => {
    await clientConfirm(id);
    load();
  };

  const handlePay = async (id) => {
    const res = await initiateAppointmentEsewa(id);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.entries(res).forEach(([k, v]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const uploadDoc = async (appointmentId) => {
    const file = fileMap[appointmentId];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointment_id", appointmentId);
    formData.append("message_type", "document");

    await fetch("/api/messages/upload", {
      method: "POST",
      body: formData,
    });

    load();
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-[#142768] mb-8">
        My Cases Dashboard
      </h1>

      {paymentStatus === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-700 shadow">
          Payment successful ✅
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {/* ================= ACTIVE (PAID) ================= */}
        <div className="col-span-3 space-y-6">
          {items.map((a) => {
            const isPaid = ["paid", "completed"].includes(a.status);
            if (!isPaid) return null;

            return (
              <div
                key={a.appointment_id}
                className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {a.subject}
                  </h2>
                  <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    Active Case
                  </span>
                </div>

                {/* CHAT */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <MessageList messages={a.messages || []} type="chat" />
                  <NegotiationChat appointmentId={a.appointment_id} />
                </div>

                {/* DOCUMENT */}
                <div className="mt-5">
                  <h3 className="font-semibold mb-2">📎 Upload Document</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      className="text-sm"
                      onChange={(e) =>
                        setFileMap({
                          ...fileMap,
                          [a.appointment_id]: e.target.files[0],
                        })
                      }
                    />
                    <button
                      onClick={() => uploadDoc(a.appointment_id)}
                      className="px-4 py-2 bg-[#142768] text-white rounded-lg hover:bg-blue-800 transition"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {/* DOCUMENT LIST */}
                <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold mb-2">📂 Documents</h3>
                  <MessageList messages={a.messages || []} type="document" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= PENDING ================= */}
        <div className="space-y-6">
          {items.map((a) => {
            const isPaid = ["paid", "completed"].includes(a.status);
            if (isPaid) return null;

            return (
              <div
                key={a.appointment_id}
                className="bg-white p-5 rounded-2xl shadow border border-yellow-100"
              >
                <h2 className="font-semibold mb-3 text-gray-800">
                  {a.subject}
                </h2>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  {console.log(a)}
                  <h3 className="text-sm font-semibold mb-2">Negotiation</h3>
                  <h3>Proposed Fee: Rs.{a.proposed_fee}</h3>
                  <h3>Offered Fee: Rs.{a.offered_fee}</h3>
                  <h3>Final Fee: Rs.{a.final_fee}</h3>
                  <h3>last_offered by: {a.last_offered_by}</h3>

                  <MessageList
                    messages={a.messages || []}
                    type="negotiation"
                  />

                  <div className="flex flex-col gap-2 mt-3">
                    <input
                      type="number"
                      placeholder="Enter counter offer"
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) =>
                        setCounterMap({
                          ...counterMap,
                          [a.appointment_id]: e.target.value,
                        })
                      }
                    />
                    {
                      a.status != "approved" ?
                        <div className="flex gap-2">
                          <button
                            onClick={() => counter(a.appointment_id)}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Counter
                          </button>

                          <button
                            onClick={() => acceptOffer(a.appointment_id)}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                        </div>
                        :
                        <button
                          onClick={() => handlePay(a.appointment_id)}
                          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Pay Now
                        </button>

                    }
                  </div>
                </div>

                {/* {a.status === "awaiting_payment" && (
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;