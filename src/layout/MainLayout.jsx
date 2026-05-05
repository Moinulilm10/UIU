import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Book,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";

import logoBlack from "../assets/logos/uiu-logo-black.png";
import logoWhite from "../assets/logos/uiu_logo_white.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { notifications } from "../data/mockData";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/curriculum", label: "Curriculum", icon: Book },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/classes", label: "Classes", icon: Video },
  { to: "/teachers", label: "Teachers", icon: User },
  { to: "/batches", label: "Batch Management", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/resources", label: "Resources", icon: FileText },
  { to: "/notices", label: "Notices", icon: Megaphone, hasBadge: true },
  { to: "/settings", label: "Settings", icon: Settings },
];

/**
 * MainLayout — fixed sidebar + scrollable header/content.
 * Includes theme toggle, profile dropdown with logout, and responsive hamburger.
 */
export default function MainLayout() {
  "use no memo";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Load notifications from mock data
  useEffect(() => {
    setNotificationsList(notifications || []);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    const segments = path.split("/").filter(Boolean);
    return segments
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" / ");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-surface border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center px-6 h-20 border-b border-border shrink-0">
          <div className="flex items-center justify-start w-full">
            <img
              src={isDark ? logoWhite : logoBlack}
              alt="UIU Logo"
              className="h-10 w-auto object-contain transition-all duration-300"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-2 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary lg:hidden transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          <p className="px-4 pb-3 text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-80">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300
                 ${
                   isActive
                     ? "bg-primary/10 text-primary shadow-sm"
                     : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={
                        isActive
                          ? "text-primary"
                          : "text-text-muted group-hover:text-text-primary transition-colors"
                      }
                    />
                    {label === "Notices" && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface animate-pulse shadow-sm" />
                    )}
                  </div>
                  <span className="flex-1">{label}</span>
                  {label === "Notices" && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-tighter">
                      3
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom user card */}
        <div className="px-4 py-6 border-t border-border shrink-0 bg-surface/50">
          <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-surface-alt/50 border border-border/50 group transition-all duration-300">
            <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:scale-105 transition-transform">
                {user?.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate mb-1 group-hover:text-primary transition-colors">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[11px] text-text-muted truncate font-medium">
                  {user?.email || "admin@edulearn.com"}
                </p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-6 lg:px-10 gap-5 shrink-0 z-30">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary lg:hidden transition-all cursor-pointer shadow-sm border border-border/50"
          >
            <Menu size={22} />
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center">
            <img
              src={isDark ? logoWhite : logoBlack}
              alt="UIU Logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-text-primary tracking-tight">
              {getBreadcrumb()}
            </h2>
          </div>

          {/* Search bar — hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-alt border border-border w-64 lg:w-80 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
            <Search size={16} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all duration-300 cursor-pointer border border-border/50"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer border border-border/50 relative ${
                  notificationsOpen
                    ? "bg-surface-alt text-primary border-primary/50 shadow-lg shadow-primary/5"
                    : "text-text-muted hover:bg-surface-alt hover:text-text-primary"
                }`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-surface rounded-full shadow-sm animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-surface rounded-2xl border border-border shadow-2xl shadow-black/20 overflow-hidden z-50 flex flex-col"
                  >
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-surface-alt/20">
                      <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-widest">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] font-black text-primary hover:text-primary-dark uppercase tracking-tighter cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-none">
                      {notificationsList.length > 0 ? (
                        <div className="divide-y divide-border">
                          {notificationsList.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`px-5 py-4 flex gap-4 hover:bg-surface-alt transition-colors cursor-pointer group ${!notif.read ? "bg-primary/[0.02]" : ""}`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                  notif.type === "enrollment"
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : notif.type === "assignment"
                                      ? "bg-blue-500/10 text-blue-500"
                                      : notif.type === "class"
                                        ? "bg-orange-500/10 text-orange-500"
                                        : "bg-purple-500/10 text-purple-500"
                                }`}
                              >
                                {notif.type === "enrollment" ? (
                                  <GraduationCap size={18} />
                                ) : notif.type === "assignment" ? (
                                  <ClipboardList size={18} />
                                ) : notif.type === "class" ? (
                                  <Video size={18} />
                                ) : (
                                  <User size={18} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p
                                    className={`text-xs font-bold truncate ${!notif.read ? "text-text-primary" : "text-text-muted"}`}
                                  >
                                    {notif.title}
                                  </p>
                                  {!notif.read && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <p className="text-[11px] text-text-muted font-medium line-clamp-2 leading-relaxed mb-1.5">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-black uppercase tracking-tighter opacity-60">
                                  <Clock size={10} />
                                  <span>{notif.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-10 py-16 text-center">
                          <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center text-text-muted mx-auto mb-4 border border-border/50">
                            <Bell size={24} />
                          </div>
                          <p className="text-sm font-bold text-text-primary">
                            No notifications yet
                          </p>
                          <p className="text-xs text-text-muted mt-1 font-medium">
                            When you have alerts, they will appear here.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="px-5 py-3 border-t border-border bg-surface-alt/10 text-center">
                      <button className="text-[11px] font-bold text-text-muted hover:text-primary transition-colors cursor-pointer">
                        View All Activity
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1.5 pl-1.5 pr-3 rounded-2xl hover:bg-surface-alt transition-all duration-300 cursor-pointer border border-border/50"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.name?.[0] || "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-text-primary leading-none mb-0.5">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                  <p className="text-[10px] text-text-muted font-medium leading-none">
                    Super Admin
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-text-muted transition-transform duration-300 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-64 bg-surface rounded-2xl border border-border shadow-2xl shadow-black/20 overflow-hidden z-50"
                  >
                    {/* User info */}
                    <div className="px-5 py-4 border-b border-border bg-surface-alt/30">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-[11px] text-text-muted truncate mt-0.5 font-medium">
                        {user?.email || "admin@edulearn.com"}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-200 cursor-pointer text-left"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-200 cursor-pointer text-left"
                      >
                        <Settings size={16} />
                        Account Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-border">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
