import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link} from 'react-router-dom';
const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock client data
  const clientData = {
    id: "CL-2024-001",
    name: "Neema Yasmin",
    email: "neema.yasmin@email.com",
    phone: "+977 984-1234567",
    address: "Kathmandu, Nepal",
    joinDate: "January 15, 2024",
    status: "Active",
    photo: "https://ui-avatars.com/api/?name=Neema+Yasmin&size=200&background=142768&color=fff"
  };

  const caseHistory = [
    { id: 1, title: "Property Dispute Case", lawyer: "John Adams", status: "Active", date: "2024-12-01", type: "Civil" },
    { id: 2, title: "Contract Review", lawyer: "Emma Wilson", status: "Completed", date: "2024-10-15", type: "Corporate" },
    { id: 3, title: "Family Matter", lawyer: "John Adams", status: "In Progress", date: "2024-11-20", type: "Family" }
  ];

  const appointments = [
    { id: 1, date: "2025-01-10", time: "2:00 PM", lawyer: "John Adams", type: "Consultation", status: "Confirmed" },
    { id: 2, date: "2025-01-15", time: "10:00 AM", lawyer: "Emma Wilson", type: "Follow-up", status: "Pending" },
    { id: 3, date: "2025-01-20", time: "3:30 PM", lawyer: "John Adams", type: "Court Hearing", status: "Scheduled" }
  ];

  const documents = [
    { id: 1, name: "Contract Agreement.pdf", uploadDate: "2024-12-05", size: "2.4 MB", type: "Contract" },
    { id: 2, name: "Property Documents.pdf", uploadDate: "2024-12-01", size: "5.1 MB", type: "Legal" },
    { id: 3, name: "ID Proof.pdf", uploadDate: "2024-11-28", size: "1.2 MB", type: "Identity" }
  ];

  const billingHistory = [
    { month: "Jan", amount: 15000 },
    { month: "Feb", amount: 12000 },
    { month: "Mar", amount: 18000 },
    { month: "Apr", amount: 14000 },
    { month: "May", amount: 20000 },
    { month: "Jun", amount: 16000 }
  ];

  const StatusBadge = ({ status }) => {
    const colors = {
      Active: "bg-green-500",
      Completed: "bg-emerald-600",
      "In Progress": "bg-blue-500",
      Confirmed: "bg-emerald-500",
      Pending: "bg-amber-500",
      Scheduled: "bg-indigo-500"
    };
    return (
      <span className={`px-3 py-1 text-xs text-white rounded-full ${colors[status] || 'bg-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to='/home' className="text-[#142768] hover:underline mb-4">← Back to Home</Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Photo */}
            <img 
              src={clientData.photo} 
              alt={clientData.name}
              className="w-24 h-24 rounded-full border-4 border-[#142768]"
            />
            
            {/* Client Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{clientData.name}</h1>
                <StatusBadge status={clientData.status} />
              </div>
              <p className="text-gray-600 mb-1">Client ID: {clientData.id}</p>
              <p className="text-sm text-gray-500">Member since {clientData.joinDate}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#142768] text-white rounded-lg hover:bg-[#1a3189] transition">
                Schedule Appointment
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {["overview", "cases", "appointments", "documents", "billing"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "bg-[#142768] text-white shadow-lg" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard title="Email" value={clientData.email} icon="📧" />
              <InfoCard title="Phone" value={clientData.phone} icon="📱" />
              <InfoCard title="Address" value={clientData.address} icon="📍" />
              <InfoCard title="Status" value={clientData.status} icon="✓" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Cases" value={caseHistory.length} color="blue" />
              <StatCard title="Active Cases" value={caseHistory.filter(c => c.status === "Active").length} color="green" />
              <StatCard title="Upcoming Appointments" value={appointments.filter(a => a.status !== "Completed").length} color="amber" />
              <StatCard title="Documents" value={documents.length} color="purple" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Cases</h2>
              <div className="space-y-3">
                {caseHistory.slice(0, 3).map(caseItem => (
                  <div key={caseItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                      <p className="text-sm text-gray-600">Lawyer: {caseItem.lawyer}</p>
                    </div>
                    <StatusBadge status={caseItem.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASES TAB */}
        {activeTab === "cases" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Case History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Case Title</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Lawyer</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {caseHistory.map(caseItem => (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{caseItem.title}</td>
                      <td className="p-4">{caseItem.type}</td>
                      <td className="p-4">{caseItem.lawyer}</td>
                      <td className="p-4">{caseItem.date}</td>
                      <td className="p-4"><StatusBadge status={caseItem.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Lawyer</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{apt.date}</td>
                      <td className="p-4">{apt.time}</td>
                      <td className="p-4">{apt.lawyer}</td>
                      <td className="p-4">{apt.type}</td>
                      <td className="p-4"><StatusBadge status={apt.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Documents</h2>
              <button className="px-4 py-2 bg-[#142768] text-white rounded-lg hover:bg-[#1a3189] transition">
                Upload Document
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {documents.map(doc => (
                <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">📄</div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.type}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Size: {doc.size}</p>
                  <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 text-sm px-3 py-1 bg-[#142768] text-white rounded hover:bg-[#1a3189]">
                      View
                    </button>
                    <button className="flex-1 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Billed" value="रू 95,000" color="blue" />
              <StatCard title="Outstanding" value="रू 12,000" color="amber" />
              <StatCard title="Paid" value="रू 83,000" color="green" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Billing Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={billingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="amount" stroke="#142768" strokeWidth={3} dot={{ fill: '#142768', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

const StatCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${colorClasses[color]} opacity-10`}></div>
      </div>
    </div>
  );
};

export default ClientProfile;