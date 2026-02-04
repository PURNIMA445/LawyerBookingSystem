import React, { useEffect, useState } from "react";
import { clientConfirm, clientCounter, myAppointments } from "../../api/appointmentsApi";
import { Link } from "react-router-dom";
import NegotiationChat from "../../components/layout/NegotiationChat";


const Profile = () => {
    const [items, setItems] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [counterMap, setCounterMap] = useState({});

    const load = async () => {
        try {
            setLoading(true);
            setErr("");
            const data = await myAppointments();
            setItems(data || []);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const counter = async (id) => {
        try {
            await clientCounter(id, { proposed_fee: Number(counterMap[id]), negotiation_note: "Client counter offer" });
            await load();
        } catch (e) {
            setErr(e.message);
        }
    };

    const acceptOffer = async (id) => {
        try {
            await clientConfirm(id);
            await load();
        } catch (e) {
            setErr(e.message);
        }
    };

    if (loading) return <div className="p-6">Loading profile...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-[#142768]">My Profile</h1>
            <p className="text-gray-600 mt-2">Appointment history and negotiations.</p>

            {err ? <div className="mt-4 text-red-600">{err}</div> : null}

            <div className="mt-6">
                <Link to="/lawyers" className="inline-block bg-[#142768] text-white px-5 py-3 rounded-xl hover:opacity-95 transition">
                    Find Lawyers
                </Link>
            </div>

            <div className="mt-8 grid gap-4">
                {items.map((a) => (
                    <div key={a.appointment_id} className="bg-white border rounded-2xl shadow-sm p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="mt-6">
                                    <NegotiationChat appointmentId={a.appointment_id} title="Negotiation / Updates" />
                                </div>

                                <div className="text-lg font-bold text-[#142768]">{a.subject}</div>
                                <div className="text-sm text-gray-600">
                                    Lawyer: <span className="font-semibold">{a.lawyer_name}</span> • {a.appointment_date} {a.appointment_time}
                                </div>
                                {a.details ? <div className="text-sm text-gray-700 mt-2">{a.details}</div> : null}
                            </div>

                            <div className={`text-xs px-3 py-1 rounded-full ${a.status === "approved" ? "bg-green-100 text-green-700" :
                                    a.status === "rejected" ? "bg-red-100 text-red-700" :
                                        a.status === "negotiating" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-blue-100 text-blue-700"
                                }`}>
                                {a.status}
                            </div>
                        </div>

                        <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                            <div className="border rounded-xl p-3">
                                <div className="text-gray-500">Your Proposed</div>
                                <div className="font-semibold">${Number(a.proposed_fee || 0).toFixed(2)}</div>
                            </div>
                            <div className="border rounded-xl p-3">
                                <div className="text-gray-500">Lawyer Offer</div>
                                <div className="font-semibold">${Number(a.offered_fee || 0).toFixed(2)}</div>
                            </div>
                            <div className="border rounded-xl p-3">
                                <div className="text-gray-500">Final Fee</div>
                                <div className="font-semibold">${Number(a.final_fee || 0).toFixed(2)}</div>
                            </div>
                        </div>

                        {a.status === "negotiating" && a.offered_fee != null ? (
                            <div className="mt-4 flex flex-wrap gap-3 items-center">
                                <button
                                    onClick={() => acceptOffer(a.appointment_id)}
                                    className="bg-[#142768] text-white px-4 py-2 rounded-xl hover:opacity-95 transition"
                                >
                                    Accept Offer (${Number(a.offered_fee).toFixed(2)})
                                </button>

                                <input
                                    className="border rounded-xl px-3 py-2 w-48"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Counter fee"
                                    value={counterMap[a.appointment_id] ?? ""}
                                    onChange={(e) => setCounterMap((p) => ({ ...p, [a.appointment_id]: e.target.value }))}
                                />
                                <button
                                    onClick={() => counter(a.appointment_id)}
                                    className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
                                >
                                    Counter Offer
                                </button>
                            </div>
                        ) : null}
                    </div>
                ))}

                {!items.length ? <div className="text-gray-600">No appointments yet.</div> : null}
            </div>
        </div>
    );
};

export default Profile;
