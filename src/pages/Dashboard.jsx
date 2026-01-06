import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

/* ================= MOCK DATA ================= */

const appointments = [
  { id: 1, client: "Neema Yasmin", date: "05/05/2025", time: "2:11 GMT", status: "Confirmed" },
  { id: 2, client: "Ruthressa Soemoro", date: "06/05/2025", time: "12:00 PM", status: "Pending" },
  { id: 3, client: "John Smith", date: "07/05/2025", time: "3:30 PM", status: "Confirmed" },
  { id: 4, client: "Sarah Johnson", date: "08/05/2025", time: "10:00 AM", status: "Pending" }
];

const lawyers = [
  { id: "BH98beam53GO36d", name: "John Adams", status: "Active" },
  { id: "A23F98", name: "Milawafasolawlo", status: "Active" },
  { id: "C45D12", name: "Emma Wilson", status: "Active" },
  { id: "E67F34", name: "Michael Brown", status: "Inactive" }
];

const requests = [
  { id: 1, lawyer: "IMAN", client: "Client A", date: "07/08/99", status: "Completed" },
  { id: 2, lawyer: "EXPRESSADGE", client: "Client B", date: "10/05/07", status: "Request Received" },
  { id: 3, lawyer: "John Adams", client: "Alice Cooper", date: "01/06/2025", status: "In Progress" },
  { id: 4, lawyer: "Emma Wilson", client: "Bob Martin", date: "02/06/2025", status: "Completed" }
];

const weeklyActivity = [
  { day: "Mon", appointments: 12, consultations: 8 },
  { day: "Tue", appointments: 15, consultations: 11 },
  { day: "Wed", appointments: 18, consultations: 14 },
  { day: "Thu", appointments: 10, consultations: 7 },
  { day: "Fri", appointments: 22, consultations: 16 },
  { day: "Sat", appointments: 8, consultations: 5 },
  { day: "Sun", appointments: 5, consultations: 3 }
];

const monthlyTrend = [
  { month: "Jan", cases: 45 },
  { month: "Feb", cases: 52 },
  { month: "Mar", cases: 61 },
  { month: "Apr", cases: 58 },
  { month: "May", cases: 70 },
  { month: "Jun", cases: 65 }
];

const casesByType = [
  { name: "Criminal", value: 35, color: "#142768" },
  { name: "Civil", value: 45, color: "#3b82f6" },
  { name: "Corporate", value: 25, color: "#10b981" },
  { name: "Family", value: 30, color: "#f59e0b" }
];

/* ================= HELPERS ================= */

const StatusBadge = ({ status }) => {
  const colors = {
    Confirmed: "bg-emerald-500",
    Pending: "bg-amber-500",
    Completed: "bg-emerald-600",
    "Request Received": "bg-indigo-500",
    "In Progress": "bg-blue-500",
    Active: "bg-green-500",
    Inactive: "bg-gray-400"
  };
  return (
    <span className={`px-3 py-1 text-xs text-white rounded-full ${colors[status] || 'bg-gray-500'}`}>
      {status}
    </span>
  );
};

/* ================= DRAWER ================= */

const DetailDrawer = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50 animate-fadeIn">
      <div className="bg-white w-full sm:w-96 h-full p-6 shadow-2xl animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#142768]">Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-b pb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{key}</p>
              <p className="font-medium text-gray-900">
                {typeof value === "string" ? value : <StatusBadge status={value} />}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN DASHBOARD ================= */

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#142768]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#142768] focus:border-transparent"
        />
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-4 sm:px-6 lg:px-8 py-4 bg-white border-b overflow-x-auto">
        {["overview", "appointments", "lawyers", "requests"].map(tab => (
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

      {/* Content */}
      <main className="p-4 sm:p-6 lg:p-8">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard title="Total Appointments" value={appointments.length} trend="+12%" color="blue" />
              <StatCard title="Active Lawyers" value={lawyers.filter(l => l.status === "Active").length} trend="+5%" color="green" />
              <StatCard title="Pending Requests" value={requests.filter(r => r.status !== "Completed").length} trend="-3%" color="amber" />
              <StatCard title="Cases This Month" value={135} trend="+18%" color="purple" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="appointments" fill="#142768" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="consultations" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Case Distribution Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Cases by Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={casesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {casesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Case Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#142768" 
                    strokeWidth={3}
                    dot={{ fill: '#142768', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Appointments</h2>
            <Table
              headers={["Client", "Date", "Time", "Status"]}
              data={appointments.filter(a =>
                a.client.toLowerCase().includes(search.toLowerCase())
              )}
              onRowClick={setSelectedItem}
              
            />
          </div>
        )}

        {/* LAWYERS */}
        {activeTab === "lawyers" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lawyers</h2>
            <Table
              headers={["ID", "Name", "Status"]}
              data={lawyers.filter(l =>
                l.name.toLowerCase().includes(search.toLowerCase())
              )}
              onRowClick={setSelectedItem}
              showAllFields={true}
            />
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Requests</h2>
            <Table
              headers={["Lawyer", "Client", "Date", "Status"]}
              data={requests}
              onRowClick={setSelectedItem}
            />
          </div>
        )}
      </main>

      <DetailDrawer data={selectedItem} onClose={() => setSelectedItem(null)} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ title, value, trend, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    amber: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600"
  };

  const isPositive = trend?.startsWith('+');

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${colorClasses[color]} opacity-10`}></div>
      </div>
      {trend && (
        <p className={`text-sm mt-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend} from last month
        </p>
      )}
    </div>
  );
};

const Table = ({ headers, data, onRowClick, showAllFields }) => {
  const statusValues = ["Confirmed", "Pending", "Completed", "Request Received", "In Progress", "Active", "Inactive"];
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {headers.map(h => (
                <th key={h} className="text-left p-4 font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              
              const values = showAllFields 
              ? Object.values(row)
              : Object.entries(row)
                  .filter(([key]) => key !== 'id')
                  .map(([_, value]) => value);
                
              
              return (
                <tr
                  key={row.id || i}
                  onClick={() => onRowClick(row)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {values.map((cell, idx) => (
                    <td key={idx} className="p-4">
                      {typeof cell === "string" && !statusValues.includes(cell) 
                        ? cell 
                        : <StatusBadge status={cell} />}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;