import React, { useEffect, useState } from "react";
import {
  clientConfirm,
  clientCounter,
  myAppointments,
} from "../../api/appointmentsApi";
import { useLocation, Link } from "react-router-dom";
import { initiateAppointmentEsewa } from "../../api/paymentApi";
import NegotiationChat from "../../components/layout/NegotiationChat";

/* ================= MESSAGE COMPONENT ================= */
const MessageList = ({ messages, type }) => {
  const filtered = (messages || []).filter((m) => m.message_type === type);

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
    const val = Number(counterMap[id]);
    if (!val || val <= 0) return;

    await clientCounter(id, { proposed_fee: val });
    load();
  };

  const acceptOffer = async (id, last_offered_by) => {
    if (last_offered_by !== "lawyer") return;

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
          Payment successful
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">

        {/* ================= ACTIVE ================= */}
        <div className="col-span-3 space-y-6">
          {items.map((a) => {
            const isActive = ["approved", "completed"].includes(a.status);
            if (!isActive) return null;

            return (
              <div key={a.appointment_id} className="bg-white rounded-3xl p-6 shadow-lg border">
                <h2 className="text-xl font-semibold">{a.subject}</h2>

                <div className="bg-gray-50 p-4 rounded-xl mt-4">
                  <MessageList messages={a.messages} type="chat" />
                  <NegotiationChat appointmentId={a.appointment_id} status={a.status} />
                </div>
                {
                  a.status !== "completed" &&
                  <div className="mt-4">
                    <input
                      type="file"
                      onChange={(e) =>
                        setFileMap({
                          ...fileMap,
                          [a.appointment_id]: e.target.files[0],
                        })
                      }
                    />
                    <button onClick={() => uploadDoc(a.appointment_id)} className="ml-3 btn">
                      Upload
                    </button>
                  </div>

                }
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {items.map((a) => {
            const isPending = !["approved", "completed"].includes(a.status);
            if (!isPending) return null;

            const showPay = a.status === "awaiting_payment";
            const canAccept = a.last_offered_by === "lawyer";

            return (
              <div key={a.appointment_id} className="bg-white p-5 rounded-2xl shadow border border-yellow-100">

                <h2 className="font-semibold">{a.subject}</h2>

                <div className="text-sm mt-1">
                  Lawyer:{" "}
                  <Link
                    to={`/lawyers/${a.lawyer_id}`}
                    className="text-blue-600 underline"
                  >
                    {a.lawyer_name}
                  </Link>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                  <h3 className="text-sm font-semibold mb-2">Negotiation</h3>

                  <div className="text-sm space-y-1">
                    <div>Proposed: Rs.{a.proposed_fee}</div>
                    <div>Offered: Rs.{a.offered_fee}</div>
                    <div>Offered By: {a.last_offered_by}</div>
                  </div>

                  <MessageList messages={a.messages} type="negotiation" />

                  <div className="flex flex-col gap-2 mt-3">

                    {!showPay && (
                      <>
                        <input
                          type="number"
                          placeholder="Enter counter offer"
                          className="px-3 py-2 border rounded-lg"
                          onChange={(e) =>
                            setCounterMap({
                              ...counterMap,
                              [a.appointment_id]: e.target.value,
                            })
                          }
                        />

                        {canAccept && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => counter(a.appointment_id)}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                            >
                              Counter
                            </button>

                            <button
                              onClick={() =>
                                acceptOffer(a.appointment_id, a.last_offered_by)
                              }
                              className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                            >
                              Accept
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {showPay && (
                      <button
                        onClick={() => handlePay(a.appointment_id)}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Profile;