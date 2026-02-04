import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { HiOutlineUserAdd } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";

import {
  unreadCount as apiUnreadCount,
  listNotifications,
  markRead,
  markAllRead
}
  from "../../api/notificationsApi";

const readAuth = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const getDisplayName = (auth) => {
  if (!auth) return "";
  return (
    auth?.full_name ||
    auth?.fullName ||
    auth?.name ||
    auth?.user?.full_name ||
    auth?.user?.fullName ||
    auth?.user?.name ||
    auth?.email ||
    "User"
  );
};

const getRole = (auth) => auth?.role || auth?.user?.role || "";

const roleBadge = (role) => {
  if (role === "admin") return { icon: "🛡️", label: "Admin" };
  if (role === "lawyer") return { icon: "⚖️", label: "Lawyer" };
  return { icon: "👤", label: "Client" };
};

const formatTime = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
};

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [auth, setAuth] = useState(readAuth());
  const [unread, setUnread] = useState(0);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifErr, setNotifErr] = useState("");
  const [notifs, setNotifs] = useState([]);

  const notifRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!auth?.token;

  const getDashboardPath = () => {
    const role = getRole(auth);
    if (role === "admin") return "/admin/dashboard";
    if (role === "lawyer") return "/lawyer/dashboard";
    return "/profile";
  };

  const resolveTargetPath = (notification) => {
    const role = getRole(auth);

    if (notification?.appointment_id) {
      if (role === "lawyer") return "/lawyer/dashboard";
      if (role === "admin") return "/admin/dashboard";
      return "/profile";
    }

    return getDashboardPath();
  };

  const fetchUnread = async () => {
    try {
      const authNow = readAuth();
      if (!authNow?.token) {
        setUnread(0);
        return;
      }
      const data = await apiUnreadCount();
      setUnread(Number(data?.unread || 0));
    } catch {
      // silent
    }
  };

  const fetchNotifications = async () => {
    setNotifErr("");
    setNotifLoading(true);
    try {
      const data = await listNotifications();
      setNotifs(Array.isArray(data) ? data : []);
    } catch (e) {
      setNotifErr(e?.message || "Failed to load notifications");
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    const sync = () => {
      setAuth(readAuth());
      fetchUnread();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAuth(readAuth());
    fetchUnread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const onDown = (e) => {
      if (!notifOpen) return;
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [notifOpen]);

  const handleToggle = () => setToggle((p) => !p);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    setUnread(0);
    setNotifs([]);
    setNotifOpen(false);
    setToggle(false);
    navigate("/login");
  };

  const openNotifications = async () => {
    if (!isLoggedIn) return;

    const nextOpen = !notifOpen;
    setNotifOpen(nextOpen);

    if (nextOpen) {
      await fetchNotifications();
      await fetchUnread();
    }
  };

  const onClickNotification = async (n) => {
    try {
      if (!n?.is_read) {
        await markRead(n.notification_id);
        setNotifs((prev) =>
          prev.map((x) =>
            x.notification_id === n.notification_id ? { ...x, is_read: 1 } : x
          )
        );
      }
    } catch {
      // silent
    } finally {
      await fetchUnread();
      setNotifOpen(false);
      navigate(resolveTargetPath(n));
    }
  };

  const onMarkAll = async () => {
    try {
      await markAllRead();
      setNotifs((prev) => prev.map((x) => ({ ...x, is_read: 1 })));
      setUnread(0);
    } catch (e) {
      setNotifErr(e?.message || "Failed to mark all read");
    }
  };

  const navLinks = useMemo(
    () => [
      { to: "/home", label: "Home" },
      { to: "/aboutus", label: "About" },
      { to: "/services", label: "Services" },
      { to: "/lawyers", label: "Lawyers" },
      { to: "/contact", label: "Contact" },
      { to: "/terms", label: "Terms" },
      { to: "/faq", label: "FAQ" },
    ],
    []
  );

  const name = getDisplayName(auth);
  const role = getRole(auth);
  const badge = roleBadge(role);

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:justify-center relative">
          <Link
            to="/"
            className="text-xl font-bold tracking-wide text-[#142768] absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            LEGALCONNECT
          </Link>

          <nav className="hidden lg:flex items-center gap-8 ml-12">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-gray-700 font-medium transition-colors pb-2 ${location.pathname === link.to
                    ? "border-b-4 border-[#142768] text-[#142768]"
                    : "border-b-4 border-transparent hover:border-[#142768] hover:text-[#142768]"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                  <span className="text-base">{badge.icon}</span>
                  <span className="text-sm font-semibold text-[#142768] truncate max-w-[160px]">
                    {name}
                  </span>
                  <span className="text-xs text-[#142768]/70">• {badge.label}</span>
                </div>

                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={openNotifications}
                    className="relative p-2 rounded-md text-[#142768] hover:bg-gray-100 transition-all"
                    title="Notifications"
                  >
                    <IoNotificationsOutline className="w-6 h-6" />
                    {unread > 0 ? (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    ) : null}
                  </button>

                  {notifOpen ? (
                    <div className="absolute right-0 mt-2 w-[360px] bg-white border rounded-2xl shadow-lg overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div className="font-semibold text-[#142768]">Notifications</div>
                        <button
                          type="button"
                          onClick={onMarkAll}
                          className="text-xs font-semibold text-[#142768] hover:underline"
                        >
                          Mark all read
                        </button>
                      </div>

                      {notifErr ? (
                        <div className="px-4 py-3 text-sm text-red-600">{notifErr}</div>
                      ) : null}

                      {notifLoading ? (
                        <div className="px-4 py-4 text-sm text-gray-600">
                          Loading...
                        </div>
                      ) : notifs.length ? (
                        <div className="max-h-[380px] overflow-auto">
                          {notifs.map((n) => (
                            <button
                              key={n.notification_id}
                              type="button"
                              onClick={() => onClickNotification(n)}
                              className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition ${n.is_read ? "bg-white" : "bg-blue-50"
                                }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {n.title}
                                  </div>
                                  {n.body ? (
                                    <div className="text-xs text-gray-700 mt-1 line-clamp-2">
                                      {n.body}
                                    </div>
                                  ) : null}
                                  <div className="text-[11px] text-gray-500 mt-1">
                                    {formatTime(n.created_at)}
                                  </div>
                                </div>
                                {!n.is_read ? (
                                  <span className="mt-1 w-2.5 h-2.5 rounded-full bg-red-600 flex-shrink-0" />
                                ) : null}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-sm text-gray-600">
                          No notifications yet.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <Link
                  to={getDashboardPath()}
                  className="p-2 rounded-md transition-all text-[#142768] hover:bg-gray-100"
                  title="Dashboard"
                >
                  <MdDashboard className="w-6 h-6" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-[#142768] text-white px-4 py-2 rounded-md transition-all hover:opacity-95 active:scale-95"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-[#142768] text-white px-5 py-2 rounded-md transition-all hover:opacity-95"
                >
                  <FiLogIn className="w-5 h-5" />
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center gap-2 border border-[#142768] text-[#142768] px-5 py-2 rounded-md transition-all hover:bg-blue-50"
                >
                  <HiOutlineUserAdd className="w-5 h-5" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          <div className="lg:hidden w-11" />

          <div
            onClick={handleToggle}
            className="lg:hidden cursor-pointer p-2 rounded-md text-gray-800 hover:text-[#142768] hover:bg-gray-100 transition-all duration-200 active:scale-95"
          >
            {toggle ? (
              <IoMdClose className="w-7 h-7" />
            ) : (
              <GiHamburgerMenu className="w-7 h-7" />
            )}
          </div>
        </div>

        {toggle && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-700 font-medium py-2 px-4 rounded-md transition-colors ${location.pathname === link.to
                      ? "bg-blue-100 text-[#142768]"
                      : "hover:bg-gray-50 hover:text-[#142768]"
                    }`}
                  onClick={() => setToggle(false)}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="mt-2 flex items-center justify-center gap-2 border border-[#142768] text-[#142768] py-2 px-4 rounded-md font-medium transition-all hover:bg-blue-50"
                    onClick={() => setToggle(false)}
                  >
                    <MdDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-[#142768] text-white py-2 px-4 rounded-md font-medium transition-all hover:opacity-95 active:scale-95"
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="mt-2 flex items-center justify-center gap-2 bg-[#142768] text-white py-2 px-4 rounded-md font-medium transition-all hover:opacity-95"
                    onClick={() => setToggle(false)}
                  >
                    <FiLogIn className="w-5 h-5" />
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 border border-[#142768] text-[#142768] py-2 px-4 rounded-md font-medium transition-all hover:bg-blue-50"
                    onClick={() => setToggle(false)}
                  >
                    <HiOutlineUserAdd className="w-5 h-5" />
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
