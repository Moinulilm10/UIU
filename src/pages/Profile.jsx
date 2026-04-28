import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Camera,
  Check,
  Edit3,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Admin Profile Page
 * Enhanced with functional mock photo upload for profile and banner.
 * Replicated premium design system from student portal with admin-specific context.
 */
export default function Profile() {
  const { user } = useAuth();

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(null); // 'profile' or 'banner'
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "Admin User",
    phone: user?.phone || "+880 1712-000000",
    address: "UIU Campus, Badda, Dhaka",
    department: "Administration",
    designation: "Super Admin",
    bio: "Passionate about educational excellence and platform management.",
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Mock delay for upload
        setTimeout(() => {
          if (type === "profile") setProfileImage(reader.result);
          if (type === "banner") setBannerImage(reader.result);
          setIsUploading(null);
          showToast(
            `${type === "profile" ? "Profile photo" : "Cover image"} updated successfully!`,
          );
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      showToast("Profile identity updated successfully!");
      console.log("Saving changes:", formData);
    }, 1200);
  };

  const infoGroups = [
    {
      title: "Professional Details",
      icon: Briefcase,
      items: [
        {
          label: "Employee ID",
          value: "ADM-2026-001",
          icon: Shield,
          editable: false,
        },
        {
          label: "Designation",
          value: formData.designation,
          icon: Award,
          editable: true,
          key: "designation",
        },
        {
          label: "Department",
          value: formData.department,
          icon: BookOpen,
          editable: true,
          key: "department",
        },
        {
          label: "Joined Date",
          value: "January 01, 2024",
          icon: Calendar,
          editable: false,
        },
      ],
    },
    {
      title: "Contact & Bio",
      icon: Mail,
      items: [
        {
          label: "Official Email",
          value: user?.email || "admin@uiu.edu",
          icon: Mail,
          editable: false,
        },
        {
          label: "Phone Number",
          value: formData.phone,
          icon: Phone,
          editable: true,
          key: "phone",
        },
        {
          label: "Office Address",
          value: formData.address,
          icon: MapPin,
          editable: true,
          key: "address",
        },
      ],
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Profile Header Card */}
      <div className="relative group/header">
        {/* Banner Section */}
        <div className="h-48 sm:h-72 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-[2.5rem] border border-border/50 overflow-hidden relative shadow-inner">
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          )}

          {/* Banner Upload Progress */}
          <AnimatePresence>
            {isUploading === "banner" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white z-20"
              >
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3 shadow-lg" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">
                  Updating Cover
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Banner Edit Trigger */}
          <div className="absolute top-6 right-6 opacity-0 group-hover/header:opacity-100 transition-all duration-500 scale-90 group-hover/header:scale-100">
            <input
              type="file"
              ref={bannerInputRef}
              onChange={(e) => handleImageUpload(e, "banner")}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-black/30 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-black/50 transition-all cursor-pointer shadow-2xl font-bold text-xs uppercase tracking-widest"
            >
              <ImageIcon size={16} />{" "}
              {bannerImage ? "Change Cover" : "Upload Cover"}
            </button>
          </div>
        </div>

        {/* Profile Identity Section */}
        <div className="px-8 sm:px-12 -mt-16 sm:-mt-24 flex flex-col sm:flex-row items-end gap-6 relative z-10">
          <div className="relative group/avatar">
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[3rem] bg-surface border-[8px] border-background shadow-2xl flex items-center justify-center text-primary overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                  />
                ) : (
                  <User size={80} className="opacity-80" />
                )}

                {/* Profile Upload Progress */}
                <AnimatePresence>
                  {isUploading === "profile" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                    >
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Uploading
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <input
              type="file"
              ref={profileInputRef}
              onChange={(e) => handleImageUpload(e, "profile")}
              className="hidden"
              accept="image/*"
            />

            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute bottom-3 right-4 p-2.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 hover:scale-110 transition-transform cursor-pointer border-4 border-background group-hover/avatar:shadow-primary/50 z-30"
            >
              <Camera size={20} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 ">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-3xl sm:text-5xl font-black text-text-primary tracking-tighter bg-surface-alt/50 border border-primary/30 rounded-2xl px-5 py-2 outline-none focus:ring-8 focus:ring-primary/5 transition-all w-full max-w-lg shadow-inner"
                />
              ) : (
                <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tighter truncate">
                  {formData.name}
                </h1>
              )}
              <span className="inline-flex px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-primary/20 self-center sm:self-auto shrink-0 shadow-sm backdrop-blur-md">
                Super Admin
              </span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-sm text-text-muted font-bold tracking-tight opacity-90 mt-3">
              <span className="flex items-center gap-2 bg-surface-alt/50 px-3 py-1 rounded-lg border border-border/50">
                <MapPin size={16} className="text-primary" /> Dhaka, BD
              </span>
              <span className="flex items-center gap-2 bg-surface-alt/50 px-3 py-1 rounded-lg border border-border/50">
                <Shield size={16} className="text-primary" /> Full Access
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-4 bg-surface-alt border border-border text-text-muted rounded-[1.25rem] font-bold text-sm hover:bg-surface transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-4 bg-primary text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-4 bg-surface border border-border text-text-primary rounded-[1.25rem] font-bold text-sm hover:bg-surface-alt transition-all cursor-pointer flex items-center gap-3 shadow-sm hover:border-primary/30 group/edit"
              >
                <Edit3
                  size={18}
                  className="text-primary group-hover/edit:rotate-12 transition-transform"
                />{" "}
                Edit Identity
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-surface border border-border shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-primary/10 text-primary"}`}
            >
              <Check size={16} />
            </div>
            <p className="text-xs font-bold text-text-primary">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-2 sm:px-0">
        {infoGroups.map((group, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
          >
            <div className="px-10 py-8 border-b border-border bg-surface-alt/10 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <group.icon size={24} />
              </div>
              <h2 className="text-xl font-black text-text-primary tracking-tight">
                {group.title}
              </h2>
            </div>
            <div className="p-10 space-y-8">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div
                    className={`w-12 h-12 rounded-2xl ${isEditing && item.editable ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5" : "bg-surface-alt text-text-muted border-transparent"} border flex items-center justify-center transition-all duration-300`}
                  >
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 opacity-70">
                      {item.label}
                    </p>
                    {isEditing && item.editable ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.key]: e.target.value,
                          })
                        }
                        className="w-full bg-surface-alt/50 border border-border focus:border-primary/50 focus:ring-8 focus:ring-primary/5 rounded-[1.25rem] px-5 py-3 text-sm font-bold text-text-primary outline-none transition-all shadow-inner"
                      />
                    ) : (
                      <p className="text-base font-bold text-text-primary leading-tight truncate group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Admin Performance Card */}
      <div className="bg-surface rounded-[2.5rem] border border-border p-10 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
          <Shield size={200} />
        </div>
        <h2 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Shield size={22} />
          </div>
          System Access Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              label: "Managed Courses",
              value: "24",
              color: "text-primary",
              bg: "bg-primary/5",
            },
            {
              label: "Active Students",
              value: "1,240",
              color: "text-emerald-500",
              bg: "bg-emerald-500/5",
            },
            {
              label: "System Health",
              value: "99.9%",
              color: "text-blue-500",
              bg: "bg-blue-500/5",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2rem] ${stat.bg} border border-border/50 text-center group hover:scale-[1.02] transition-all cursor-default`}
            >
              <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 opacity-60">
                {stat.label}
              </p>
              <p
                className={`text-4xl font-black ${stat.color} tracking-tighter tabular-nums`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
