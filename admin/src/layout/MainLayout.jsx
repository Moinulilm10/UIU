import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, Users, Settings,
  Menu, X, ChevronRight, Bell, Search, LogOut,
  Sun, Moon, User, ChevronDown, FileText, BookOpen, Book,
  ClipboardList, Video
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/subjects", label: "Subjects", icon: Book },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/classes", label: "Classes", icon: Video },
  { to: "/teachers", label: "Teachers", icon: User },
  { to: "/batches", label: "Batch Management", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/resources", label: "Resources", icon: FileText },
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
        <div className="flex items-center gap-3.5 px-6 h-20 border-b border-border shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-text-primary tracking-tight leading-none mb-1">EduAdmin</h1>
            <p className="text-[11px] text-text-muted font-medium leading-none">Management Portal</p>
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
                 ${isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-primary" : "text-text-muted group-hover:text-text-primary transition-colors"} />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <motion.div layoutId="nav-active" className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar bottom user card */}
        <div className="px-4 py-6 border-t border-border shrink-0 bg-surface/50">
          <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-surface-alt/50 border border-border/50 group cursor-pointer hover:bg-surface-alt transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate leading-none mb-1">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-text-muted truncate leading-none font-medium">{user?.email || "admin@edulearn.com"}</p>
            </div>
            <LogOut size={14} className="text-text-muted group-hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); logout(); }} />
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
            <button className="relative p-2.5 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all duration-300 cursor-pointer border border-border/50">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-surface rounded-full" />
            </button>

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
                  <p className="text-xs font-bold text-text-primary leading-none mb-0.5">{user?.name?.split(' ')[0] || "Admin"}</p>
                  <p className="text-[10px] text-text-muted font-medium leading-none">Super Admin</p>
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
                      <p className="text-sm font-bold text-text-primary truncate">{user?.name || "Admin User"}</p>
                      <p className="text-[11px] text-text-muted truncate mt-0.5 font-medium">{user?.email || "admin@edulearn.com"}</p>
                    </div>

                    {/* Menu items */}
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-200 cursor-pointer">
                        <User size={16} />
                        My Profile
                      </button>
                      <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-200 cursor-pointer">
                        <Settings size={16} />
                        Account Settings
                      </button>
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
