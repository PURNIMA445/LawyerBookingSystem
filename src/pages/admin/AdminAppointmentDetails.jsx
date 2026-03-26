import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const AdminAppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("pp_auth");

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const { data } = await axios.get(`${API}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointment(data.appointment);
      console.log(data.appointment)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(
        `${API}/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAppointment();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading appointment...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Appointment not found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Appointment Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        {/* Status Badge */}
        <div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            appointment.status === "approved"
              ? "bg-green-100 text-green-700"
              : appointment.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : appointment.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}>
            {appointment.status}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Client Info */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Client</h2>
            <p>Name: {appointment.client?.name}</p>
            <p>Email: {appointment.client?.email}</p>
          </div>

          {/* Lawyer Info */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Lawyer</h2>
            <p>Name: {appointment.lawyer?.name}</p>
            <p>Specialization: {appointment.lawyer?.specialization}</p>
          </div>

          {/* Schedule */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Schedule</h2>
            <p>Date: {appointment.appointment_date}</p>
            <p>Time: {appointment.appointment_time}</p>
          </div>

          {/* Fees */}
          <div className="border rounded-xl p-4">
            <h2 className="font-semibold mb-2">Fees</h2>
            <p>Proposed: Rs. {appointment.proposed_fee}</p>
            <p>Offered: Rs. {appointment.offered_fee}</p>
            <p>Final: Rs. {appointment.final_fee}</p>
          </div>
        </div>

        {/* Notes */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Notes</h2>
          <p>{appointment.notes || "No notes provided"}</p>
        </div>

        {/* Actions */}
        {/* <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => updateStatus("approved")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90"
          >
            Approve
          </button>

          <button
            onClick={() => updateStatus("rejected")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90"
          >
            Reject
          </button>

          <button
            onClick={() => updateStatus("completed")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90"
          >
            Mark Completed
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AdminAppointmentDetails;