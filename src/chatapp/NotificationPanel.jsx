import { FiX } from "react-icons/fi";

export default function NotificationPanel({ notifications, onClose, onClear }) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-gray-800 text-sm">Notifications</span>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-xs text-blue-500 hover:underline">
            Mark all read
          </button>
          <FiX className="text-gray-400 cursor-pointer hover:text-gray-600" size={16} onClick={onClose} />
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/40" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? "bg-blue-500" : "bg-transparent"}`}
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}