// pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { clientConfirm, clientCounter, myAppointments } from "../../api/appointmentsApi";
import { Link, useLocation } from "react-router-dom";
import NegotiationChat from "../../components/layout/NegotiationChat";
import { initiateAppointmentEsewa } from "../../api/paymentApi";

const Profile = () => {
    const [items, setItems] = useState([]);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [counterMap, setCounterMap] = useState({});
    const [saving, setSaving] = useState(false);

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const paymentStatus = query.get("payment");

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

    // ✅ Reload after payment
    useEffect(() => {
        if (paymentStatus === "success") {
            load();
        }
    }, [paymentStatus]);

    const counter = async (id) => {
        try {
            await clientCounter(id, {
                proposed_fee: Number(counterMap[id]),
                negotiation_note: "Client counter offer",
            });
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

    const handlePay = async (id) => {
        try {
            setSaving(true);

            const res = await initiateAppointmentEsewa(id);

            const form = document.createElement("form");
            form.method = "POST";
            form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

            const fields = {
                amount: res.amount,
                tax_amount: "0",
                total_amount: res.amount,
                transaction_uuid: res.transaction_uuid,
                product_code: res.product_code,
                product_service_charge: "0",
                product_delivery_charge: "0",
                success_url: res.success_url,
                failure_url: res.failure_url,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                signature: res.signature,
            };

            Object.entries(fields).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (e) {
            setErr(e.message || "Payment failed");
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading profile...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-[#142768]">My Profile</h1>

            {/* ✅ PAYMENT STATUS UI */}
            {paymentStatus === "success" && (
                <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700">
                    Payment successful ✅
                </div>
            )}
            {paymentStatus === "failed" && (
                <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700">
                    Payment failed ❌
                </div>
            )}
            {paymentStatus === "error" && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-100 text-yellow-700">
                    Payment verification error ⚠️
                </div>
            )}

            {err && <div className="mt-4 text-red-600">{err}</div>}

            <div className="mt-6">
                <Link to="/lawyers" className="bg-[#142768] text-white px-5 py-3 rounded-xl">
                    Find Lawyers
                </Link>
            </div>

            <div className="mt-8 grid gap-4">
                {items.map((a) => (
                    <div key={a.appointment_id} className="bg-white border rounded-2xl p-6">

                        <NegotiationChat appointmentId={a.appointment_id} />

                        <div className="font-bold">{a.subject}</div>

                        {/* ✅ PAY BUTTON */}
                        {a.status === "awaiting_payment" && (
                            <button
                                onClick={() => handlePay(a.appointment_id)}
                                disabled={saving}
                                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                {saving ? "Redirecting..." : "Pay Now"}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;