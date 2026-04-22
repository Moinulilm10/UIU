import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Shield, Palette, Globe, Sun, Moon, Monitor } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { useTheme } from "../context/ThemeContext";

export default function SettingsPage() {
  "use no memo";
  const [activeTab, setActiveTab] = useState("general");
  const { theme, toggleTheme, isDark } = useTheme();

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const themeOptions = [
    { key: "dark", label: "Dark", icon: Moon },
    { key: "light", label: "Light", icon: Sun },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">Manage your admin preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
        {/* Tabs — horizontal on mobile, vertical on desktop */}
        <div className="lg:w-52 shrink-0">
          <Card hover={false} className="!p-1.5">
            <div className="flex lg:flex-col gap-0.5 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                    ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"}
                    lg:w-full`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === "general" && (
              <Card hover={false} className="!p-4 sm:!p-6">
                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-5">General Settings</h3>
                <div className="space-y-4 max-w-lg">
                  <Input label="Platform Name" defaultValue="EduAdmin" />
                  <Input label="Admin Email" defaultValue="admin@edulearn.com" type="email" />
                  <Input label="Support URL" defaultValue="https://support.edulearn.com" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-text-secondary">Timezone</label>
                    <select className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer">
                      <option>UTC+6 (Dhaka)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC-5 (New York)</option>
                      <option>UTC+9 (Tokyo)</option>
                    </select>
                  </div>
                  <div className="pt-2"><Button><Save size={16} /> Save Changes</Button></div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card hover={false} className="!p-4 sm:!p-6">
                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-5">Notification Preferences</h3>
                <div className="space-y-3 max-w-lg">
                  {["Email notifications for new enrollments", "SMS alerts for batch capacity warnings", "Weekly summary reports", "Student migration alerts"].map((item) => (
                    <label key={item} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-alt/50 cursor-pointer hover:bg-surface-alt transition-all">
                      <span className="text-sm text-text-primary">{item}</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer shrink-0" />
                    </label>
                  ))}
                  <div className="pt-2"><Button><Save size={16} /> Save Preferences</Button></div>
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card hover={false} className="!p-4 sm:!p-6">
                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-5">Security Settings</h3>
                <div className="space-y-4 max-w-lg">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" />
                  <div className="pt-2"><Button><Shield size={16} /> Update Password</Button></div>
                </div>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card hover={false} className="!p-4 sm:!p-6">
                <h3 className="text-sm sm:text-base font-bold text-text-primary mb-5">Appearance</h3>
                <div className="space-y-6 max-w-lg">
                  {/* Theme selector */}
                  <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-text-secondary">Theme</label>
                    <div className="flex gap-3">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => { if (theme !== opt.key) toggleTheme(); }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                            ${theme === opt.key
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-surface-alt text-text-secondary border border-border hover:text-text-primary"
                            }`}
                        >
                          <opt.icon size={15} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent color */}
                  <div className="space-y-2.5">
                    <label className="block text-sm font-medium text-text-secondary">Accent Color</label>
                    <div className="flex gap-3">
                      {["#E29B41", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer
                            ${color === "#E29B41" ? "border-text-primary scale-110 ring-2 ring-primary/30" : "border-transparent hover:scale-110"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
