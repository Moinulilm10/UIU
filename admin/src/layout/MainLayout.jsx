import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, Settings,
  Menu, X, ChevronRight, Bell, Search, LogOut,
  Sun, Moon, User, ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/batches", label: "Batch Management", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
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
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close profile dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    const segments = path.split("/").filter(Boolean);
    return segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-surface border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-text-primary tracking-tight leading-tight">EduAdmin</h1>
            <p className="text-[10px] text-text-muted font-medium leading-tight">Management Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text-primary lg:hidden transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                 ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-primary" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom user card */}
        <div className="px-3 py-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-alt">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-text-muted truncate leading-tight mt-0.5">{user?.email || "admin@edulearn.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary lg:hidden transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-text-primary truncate">
              {getBreadcrumb()}
            </h2>
          </div>

          {/* Search bar — hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt border border-border w-56 lg:w-64">
            <Search size={14} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-alt transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.[0] || "A"}
              </div>
              <ChevronDown
                size={14}
                className={`text-text-muted transition-transform duration-200 hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-border shadow-xl shadow-black/10 overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary truncate">{user?.name || "Admin User"}</p>
                    <p className="text-xs text-text-muted truncate mt-0.5">{user?.email || "admin@edulearn.com"}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer">
                      <User size={15} />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer">
                      <Settings size={15} />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-1.5 border-t border-border">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
