import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/batches", label: "Batch Management", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

/**
 * MainLayout with fixed sidebar and scrollable content area.
 * Sidebar collapses to hamburger on mobile screens.
 */
export default function MainLayout() {
  "use no memo";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Generate breadcrumb from route
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

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-surface border-r border-border
          flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">EduAdmin</h1>
            <p className="text-[11px] text-text-muted font-medium">Management Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1 rounded-lg text-text-muted hover:bg-surface-alt lg:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200
                 ${
                   isActive
                     ? "bg-primary/10 text-primary shadow-sm"
                     : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Card at Bottom */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-alt">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">Admin User</p>
              <p className="text-[11px] text-text-muted truncate">admin@edulearn.com</p>
            </div>
            <button className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-4 shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-text-muted hover:bg-surface-alt lg:hidden transition-all cursor-pointer"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-text-primary truncate">
              {getBreadcrumb()}
            </h2>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt border border-border w-64">
            <Search size={15} className="text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-text-muted hover:bg-surface-alt transition-all cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
