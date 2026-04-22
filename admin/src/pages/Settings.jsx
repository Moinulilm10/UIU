import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Bell, Shield, Palette, Globe } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage your admin preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <Card hover={false} className="!p-2">
            <div className="space-y-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                    ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === "general" && (
              <Card hover={false}>
                <h3 className="text-base font-bold text-text-primary mb-6">General Settings</h3>
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
                  <div className="pt-2">
                    <Button><Save size={16} /> Save Changes</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card hover={false}>
                <h3 className="text-base font-bold text-text-primary mb-6">Notification Preferences</h3>
                <div className="space-y-4 max-w-lg">
                  {["Email notifications for new enrollments", "SMS alerts for batch capacity warnings", "Weekly summary reports", "Student migration alerts"].map((item) => (
                    <label key={item} className="flex items-center justify-between p-3 rounded-xl bg-surface-alt/50 cursor-pointer group hover:bg-surface-alt transition-all">
                      <span className="text-sm text-text-primary">{item}</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary cursor-pointer" />
                    </label>
                  ))}
                  <div className="pt-2">
                    <Button><Save size={16} /> Save Preferences</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card hover={false}>
                <h3 className="text-base font-bold text-text-primary mb-6">Security Settings</h3>
                <div className="space-y-4 max-w-lg">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" />
                  <div className="pt-2">
                    <Button><Shield size={16} /> Update Password</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card hover={false}>
                <h3 className="text-base font-bold text-text-primary mb-6">Appearance</h3>
                <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-secondary">Theme</label>
                    <div className="flex gap-3">
                      {[{ label: "Dark", active: true }, { label: "Light", active: false }, { label: "System", active: false }].map((theme) => (
                        <button key={theme.label}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${theme.active ? "bg-primary/10 text-primary border border-primary/30" : "bg-surface-alt text-text-secondary border border-border hover:text-text-primary"}`}>
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-secondary">Accent Color</label>
                    <div className="flex gap-3">
                      {["#E29B41", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"].map((color) => (
                        <button key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${color === "#E29B41" ? "border-white scale-110" : "border-transparent hover:scale-110"}`}
                          style={{ backgroundColor: color }} />
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
