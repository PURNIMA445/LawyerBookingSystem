import React, { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link} from 'react-router-dom';
const LawyerProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock lawyer data
  const lawyerData = {
    id: "BH98beam53GO36d",
    name: "John Adams",
    email: "john.adams@lawfirm.com",
    phone: "+977 985-7654321",
    specialization: "Criminal & Civil Law",
    experience: "12 years",
    barNumber: "BAR-2012-5678",
    education: "LLB, Harvard Law School",
    status: "Active",
    rating: 4.8,
    photo: "https://ui-avatars.com/api/?name=John+Adams&size=200&background=142768&color=fff"
  };

  const activeCases = [
    { id: 1, title: "Property Dispute Case", client: "Neema Yasmin", status: "Active", type: "Civil", startDate: "2024-12-01" },
    { id: 2, title: "Criminal Defense", client: "Ruthressa Soemoro", status: "In Progress", type: "Criminal", startDate: "2024-11-15" },
    { id: 3, title: "Family Matter", client: "Alice Cooper", status: "Active", type: "Family", startDate: "2024-11-20" }
  ];

  const completedCases = [
    { id: 1, title: "Contract Review", client: "Bob Martin", completedDate: "2024-10-15", outcome: "Favorable" },
    { id: 2, title: "Business Incorporation", client: "Sarah Johnson", completedDate: "2024-09-22", outcome: "Successful" },
    { id: 3, title: "Employment Dispute", client: "Michael Chen", completedDate: "2024-08-30", outcome: "Settled" }
  ];

  const schedule = [
    { id: 1, time: "09:00 AM", client: "Neema Yasmin", type: "Consultation", date: "2025-01-10" },
    { id: 2, time: "11:00 AM", client: "Alice Cooper", type: "Court Hearing", date: "2025-01-10" },
    { id: 3, time: "02:00 PM", client: "Bob Martin", type: "Follow-up", date: "2025-01-10" },
    { id: 4, time: "04:00 PM", client: "Sarah Johnson", type: "Case Review", date: "2025-01-10" }
  ];

  const casesByType = [
    { name: "Criminal", value: 25, color: "#142768" },
    { name: "Civil", value: 35, color: "#3b82f6" },
    { name: "Family", value: 15, color: "#10b981" },
    { name: "Corporate", value: 20, color: "#f59e0b" }
  ];

  const monthlyPerformance = [
    { month: "Jan", cases: 8, won: 6 },
    { month: "Feb", cases: 12, won: 10 },
    { month: "Mar", cases: 10, won: 8 },
    { month: "Apr", cases: 15, won: 12 },
    { month: "May", cases: 11, won: 9 },
    { month: "Jun", cases: 13, won: 11 }
  ];

  const reviews = [
    { id: 1, client: "Neema Yasmin", rating: 5, comment: "Excellent service! Very professional and knowledgeable.", date: "2024-12-20" },
    { id: 2, client: "Bob Martin", rating: 5, comment: "Helped me win my case. Highly recommend!", date: "2024-11-15" },
    { id: 3, client: "Alice Cooper", rating: 4, comment: "Great lawyer, very responsive and helpful.", date: "2024-10-30" }
  ];

  const StatusBadge = ({ status }) => {
    const colors = {
      Active: "bg-green-500",
      "In Progress": "bg-blue-500",
      Completed: "bg-emerald-600",
      Pending: "bg-amber-500"
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
          <Link to='/home' className="text-[#142768] hover:underline mb-4">← Back to Homepage</Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Photo */}
            <img 
              src={lawyerData.photo} 
              alt={lawyerData.name}
              className="w-24 h-24 rounded-full border-4 border-[#142768]"
            />
            
            {/* Lawyer Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{lawyerData.name}</h1>
                <StatusBadge status={lawyerData.status} />
              </div>
              <p className="text-lg text-gray-700 mb-1">{lawyerData.specialization}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⭐ {lawyerData.rating} Rating</span>
                <span>•</span>
                <span>{lawyerData.experience} Experience</span>
                <span>•</span>
                <span>Bar: {lawyerData.barNumber}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-[#142768] text-white rounded-lg hover:bg-[#1a3189] transition">
                Assign Case
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {["overview", "cases", "schedule", "performance", "reviews"].map(tab => (
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
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard title="Email" value={lawyerData.email} icon="📧" />
              <InfoCard title="Phone" value={lawyerData.phone} icon="📱" />
              <InfoCard title="Education" value={lawyerData.education} icon="🎓" />
              <InfoCard title="Bar Number" value={lawyerData.barNumber} icon="⚖️" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Cases" value={activeCases.length} color="blue" />
              <StatCard title="Completed Cases" value={completedCases.length} color="green" />
              <StatCard title="Win Rate" value="85%" color="purple" />
              <StatCard title="Client Rating" value={lawyerData.rating} color="amber" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cases by Type */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Cases by Type</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={casesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
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

              {/* Recent Cases */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Active Cases</h2>
                <div className="space-y-3">
                  {activeCases.map(caseItem => (
                    <div key={caseItem.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                        <StatusBadge status={caseItem.status} />
                      </div>
                      <p className="text-sm text-gray-600">Client: {caseItem.client}</p>
                      <p className="text-xs text-gray-500">Type: {caseItem.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASES TAB */}
        {activeTab === "cases" && (
          <div className="space-y-6">
            {/* Active Cases */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Active Cases</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Case Title</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Client</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Start Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCases.map(caseItem => (
                      <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{caseItem.title}</td>
                        <td className="p-4">{caseItem.client}</td>
                        <td className="p-4">{caseItem.type}</td>
                        <td className="p-4">{caseItem.startDate}</td>
                        <td className="p-4"><StatusBadge status={caseItem.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Completed Cases */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Completed Cases</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-700">Case Title</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Client</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Completed Date</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedCases.map(caseItem => (
                      <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{caseItem.title}</td>
                        <td className="p-4">{caseItem.client}</td>
                        <td className="p-4">{caseItem.completedDate}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 text-xs text-white bg-green-500 rounded-full">
                            {caseItem.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Today's Schedule</h2>
              <p className="text-sm text-gray-600 mt-1">January 10, 2025</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {schedule.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="bg-[#142768] text-white px-3 py-2 rounded-lg text-center min-w-20">
                      <p className="text-xs font-semibold">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.type}</h3>
                      <p className="text-sm text-gray-600">Client: {item.client}</p>
                    </div>
                    <button className="text-sm text-[#142768] hover:underline">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Cases Handled" value="95" color="blue" />
              <StatCard title="Cases Won" value="81" color="green" />
              <StatCard title="Success Rate" value="85%" color="purple" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Performance</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="cases" fill="#142768" name="Total Cases" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="won" fill="#10b981" name="Cases Won" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#142768]">{lawyerData.rating}</div>
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                  <p className="text-sm text-gray-600 mt-2">Based on {reviews.length} reviews</p>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm w-12">{star} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400"
                            style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.client}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
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
    <p className="font-semibold text-gray-900 text-sm">{value}</p>
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

export default LawyerProfile;