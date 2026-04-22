import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Bell, Shield, Palette, Globe, Sun, Moon, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  "use no memo";
  const [activeTab, setActiveTab] = useState("general");
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const themeOptions = [
    { key: "dark", label: "Dark Mode", icon: Moon },
    { key: "light", label: "Light Mode", icon: Sun },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">System Settings</h1>
        <p className="text-sm text-text-muted font-medium opacity-80">Configure your platform preferences and security parameters</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 shrink-0">
          <Card hover={false} className="!p-2 border border-border/50">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap
                    ${activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"}
                    lg:w-full`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "general" && (
                <Card hover={false} className="!p-8 sm:!p-10 border border-border/50">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">General Information</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Basic details about your learning management system</p>
                  </div>
                  <div className="space-y-8 max-w-xl">
                    <Input label="Platform Display Name" defaultValue="EduAdmin Pro" />
                    <Input label="Primary Admin Email" defaultValue="admin@edulearn.com" type="email" />
                    <Input label="Technical Support URL" defaultValue="https://support.edulearn.com" />
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">System Timezone</label>
                        <select className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary cursor-pointer transition-all">
                            <option>UTC+6 (Dhaka Standard Time)</option>
                            <option>UTC+0 (Greenwich Mean Time)</option>
                            <option>UTC-5 (Eastern Standard Time)</option>
                            <option>UTC+9 (Japan Standard Time)</option>
                        </select>
                    </div>
                    <div className="pt-6 border-t border-border/50 flex justify-end">
                        <Button className="px-10"><Save size={18} /> Save General Changes</Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card hover={false} className="!p-8 sm:!p-10 border border-border/50">
                   <div className="mb-8">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Notifications</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Control how and when you receive system alerts</p>
                  </div>
                  <div className="space-y-4 max-w-xl">
                    {[
                        { label: "New Student Enrollments", desc: "Get notified when a new student joins any batch" },
                        { label: "Capacity Threshold Alerts", desc: "Notify when a batch reaches 90% capacity" },
                        { label: "Migration Confirmations", desc: "Receive alerts for successful student migrations" },
                        { label: "Weekly Performance Reports", desc: "Summary of enrollment trends and revenue" }
                    ].map((item) => (
                      <label key={item.label} className="flex items-center justify-between gap-6 p-5 rounded-[1.5rem] bg-surface-alt/40 cursor-pointer hover:bg-surface-alt transition-all group border border-transparent hover:border-border/50">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{item.label}</p>
                          <p className="text-xs text-text-muted font-medium mt-1">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </label>
                    ))}
                    <div className="pt-8 border-t border-border/50 flex justify-end">
                        <Button className="px-10"><Save size={18} /> Save Notification Rules</Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "security" && (
                <Card hover={false} className="!p-8 sm:!p-10 border border-border/50">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Account Security</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Keep your administrative account safe and secure</p>
                  </div>
                  <div className="space-y-8 max-w-xl">
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="New Password" type="password" placeholder="••••••••" />
                        <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
                        <Shield className="text-amber-500 shrink-0" size={20} />
                        <p className="text-xs text-amber-500 font-bold leading-relaxed">
                            Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers and symbols.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-border/50 flex justify-end">
                        <Button variant="primary" className="px-10"><Shield size={18} /> Update Security Profile</Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "appearance" && (
                <Card hover={false} className="!p-8 sm:!p-10 border border-border/50">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">Interface Customization</h3>
                    <p className="text-sm text-text-muted mt-1 font-medium">Adjust the visual experience of your dashboard</p>
                  </div>
                  <div className="space-y-10 max-w-xl">
                    {/* Theme selector */}
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">Global Theme Mode</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {themeOptions.map((opt) => {
                            const isSelected = theme === opt.key;
                            return (
                                <button
                                    key={opt.key}
                                    onClick={() => { if (theme !== opt.key) toggleTheme(); }}
                                    className={`relative flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer group
                                        ${isSelected ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" : "bg-surface-alt/40 border-transparent hover:bg-surface-alt hover:border-border"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-primary text-white" : "bg-surface text-text-muted group-hover:text-text-primary"} transition-colors`}>
                                            <opt.icon size={20} />
                                        </div>
                                        <span className={`text-sm font-bold ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>{opt.label}</span>
                                    </div>
                                    {isSelected && <CheckCircle2 className="text-primary" size={20} />}
                                </button>
                            );
                        })}
                      </div>
                    </div>

                    {/* Accent color */}
                    <div className="space-y-4">
                      <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">Brand Accent Color</label>
                      <div className="flex flex-wrap gap-4 p-5 rounded-[1.5rem] bg-surface-alt/40 border border-transparent">
                        {[
                            { name: "Saffron", hex: "#E29B41" },
                            { name: "Ocean", hex: "#3b82f6" },
                            { name: "Emerald", hex: "#10b981" },
                            { name: "Purple", hex: "#8b5cf6" },
                            { name: "Rose", hex: "#f43f5e" }
                        ].map((color) => (
                          <button
                            key={color.hex}
                            className={`w-12 h-12 rounded-2xl border-4 transition-all cursor-pointer shadow-lg
                              ${color.hex === "#E29B41" ? "border-white dark:border-text-primary scale-110 ring-4 ring-primary/20" : "border-transparent hover:scale-110"}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
