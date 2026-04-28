import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  Users, 
  BookOpen, 
  Layers as Layer3,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { batches } from "../data/mockData";

/**
 * Notice Management Page
 * Features:
 * - Functional notice creation and deletion
 * - Specific Batch targeting with dynamic dropdown
 * - Severity-based styling
 * - Premium Slide-over panel
 */
export default function Notices() {
  // State for notices list
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Scheduled Maintenance: Server Update",
      content: "We will be performing a scheduled server maintenance this Saturday from 2:00 AM to 4:00 AM UTC.",
      type: "warning",
      target: "Global",
      status: "published",
      views: 1240,
      acknowledged: 850,
      createdAt: new Date().toISOString(),
      expiryDate: "2026-05-01"
    },
    {
      id: 2,
      title: "Urgent: Final Exam Schedule Change",
      content: "The final exams for Batch Alpha have been moved forward by one week due to public holidays.",
      type: "critical",
      target: "Batch Alpha",
      status: "published",
      views: 450,
      acknowledged: 440,
      createdAt: new Date().toISOString(),
      expiryDate: "2026-05-10"
    }
  ]);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    targetScope: "Global",
    targetBatch: "",
    startDate: "",
    expiryDate: ""
  });

  const getTypeStyles = (type) => {
    switch (type) {
      case "critical": return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20", icon: AlertCircle };
      case "warning": return { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", icon: Clock };
      default: return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: Info };
    }
  };

  const handleCreateNotice = (status = "published") => {
    if (!formData.title || !formData.content) {
      alert("Please fill in the title and content.");
      return;
    }

    const newNotice = {
      id: Date.now(),
      ...formData,
      target: formData.targetScope === "Specific Batch" ? formData.targetBatch : formData.targetScope,
      status,
      views: 0,
      acknowledged: 0,
      createdAt: new Date().toISOString()
    };

    setNotices([newNotice, ...notices]);
    setIsSidebarOpen(false);
    // Reset form
    setFormData({
      title: "",
      content: "",
      type: "info",
      targetScope: "Global",
      targetBatch: "",
      startDate: "",
      expiryDate: ""
    });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || n.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Notice Board</h1>
          <p className="text-text-muted mt-1 font-medium">Manage and broadcast critical updates to your institution.</p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Create New Notice
        </button>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Notices", value: notices.filter(n => n.status === 'published').length, icon: Megaphone, color: "text-primary" },
          { label: "Total Reach", value: notices.reduce((acc, n) => acc + n.views, 0), icon: Users, color: "text-emerald-500" },
          { label: "Avg. Read Rate", value: "88%", icon: CheckCircle2, color: "text-blue-500" }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-surface border border-border flex items-center gap-5 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-text-primary mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-surface/50 p-4 rounded-3xl border border-border/50">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search notices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {['all', 'critical', 'warning', 'info'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border shrink-0 ${
                  filterType === type 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-surface text-text-muted border-border hover:border-text-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotices.map((notice, index) => {
            const styles = getTypeStyles(notice.type);
            const Icon = styles.icon;
            
            return (
              <motion.div
                key={notice.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-3xl bg-surface border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${styles.bg.replace('/10', '')}`} />
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl ${styles.bg} ${styles.text} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles.bg} ${styles.text}`}>
                        {notice.type}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1">
                        <Users size={12} /> {notice.target}
                      </span>
                      {notice.status === 'draft' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-surface-alt text-text-muted border border-border">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-text-primary truncate mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-1 font-medium opacity-80">
                      {notice.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 lg:px-8 lg:border-l border-border/50 h-10">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Views</p>
                      <p className="text-sm font-black text-text-primary">{notice.views}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Read Rate</p>
                      <p className="text-sm font-black text-emerald-500">
                        {notice.views > 0 ? Math.round((notice.acknowledged / notice.views) * 100) : 0}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(notice.id)}
                      className="p-2.5 rounded-xl text-text-muted hover:bg-surface-alt hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-3 bg-surface-alt text-text-primary rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer group/btn shadow-sm">
                      <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CREATE NOTICE POPUP (MODAL) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-surface rounded-[32px] shadow-2xl z-[101] flex flex-col max-h-[90vh] overflow-hidden border border-border/50"
            >
              {/* Header */}
              <div className="p-8 border-b border-border flex items-center justify-between bg-surface-alt/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">Compose Notice</h2>
                    <p className="text-sm text-text-muted font-medium">Configure and broadcast a new announcement.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-3 rounded-2xl text-text-muted hover:bg-surface-alt hover:text-text-primary transition-all cursor-pointer bg-surface border border-border shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
                {/* Notice Type */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Notice Severity</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'info', label: 'General', icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
                      { id: 'warning', label: 'Warning', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                      { id: 'critical', label: 'Critical', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all bg-surface cursor-pointer group relative overflow-hidden ${
                          formData.type === type.id 
                            ? "border-primary ring-4 ring-primary/5 shadow-xl" 
                            : "border-border hover:border-primary/40 hover:bg-surface-alt/30"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl ${type.bg} ${type.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                          <type.icon size={24} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">{type.label}</span>
                        {formData.type === type.id && (
                          <motion.div 
                            layoutId="active-type"
                            className="absolute top-2 right-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary shadow-sm" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Headline</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Server Maintenance Update"
                        className="w-full px-6 py-4 bg-surface-alt/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold placeholder:font-medium transition-all focus:bg-surface focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Content</label>
                    <textarea 
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your notice details here..."
                      className="w-full px-6 py-4 bg-surface-alt/30 border border-border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium leading-relaxed placeholder:font-normal transition-all focus:bg-surface focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Targeting */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest px-1">Advanced Targeting</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-border bg-surface-alt/10 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Layer3 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Target Scope</span>
                      </div>
                      <select 
                        value={formData.targetScope}
                        onChange={(e) => setFormData({ ...formData, targetScope: e.target.value, targetBatch: "" })}
                        className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer border-b border-border pb-1 focus:border-primary transition-colors"
                      >
                        <option value="Global">Global (Everywhere)</option>
                        <option value="Specific Batch">Specific Batch</option>
                        <option value="Students">Students Only</option>
                        <option value="Teachers">Teachers Only</option>
                      </select>
                    </div>

                    <AnimatePresence>
                      {formData.targetScope === "Specific Batch" && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3"
                        >
                          <div className="flex items-center gap-2 text-primary">
                            <BookOpen size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Select Batch</span>
                          </div>
                          <select 
                            value={formData.targetBatch}
                            onChange={(e) => setFormData({ ...formData, targetBatch: e.target.value })}
                            className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer border-b border-primary/20 pb-1"
                          >
                            <option value="">Choose a Batch...</option>
                            {batches.map(batch => (
                              <option key={batch.id} value={batch.name}>{batch.name} ({batch.courseName})</option>
                            ))}
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="p-6 rounded-[24px] bg-surface-alt/30 border border-border border-dashed space-y-5">
                  <div className="flex items-center gap-3 text-text-muted">
                    <Calendar size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Publication Schedule</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Start Date</p>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-surface border border-border px-4 py-2 rounded-xl text-xs font-bold outline-none w-full cursor-pointer focus:border-primary transition-all" 
                      />
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-surface-alt border border-border mt-5">
                      <ArrowRight size={14} className="text-text-muted" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Expiry Date</p>
                      <input 
                        type="date" 
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="bg-surface border border-border px-4 py-2 rounded-xl text-xs font-bold outline-none w-full cursor-pointer focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-border bg-surface-alt/20 flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <button 
                  className="w-full sm:flex-1 px-6 py-4 rounded-2xl border border-border bg-surface font-bold text-text-muted hover:bg-surface-alt transition-all cursor-pointer text-sm shadow-sm"
                  onClick={() => handleCreateNotice("draft")}
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleCreateNotice("published")}
                  className="w-full sm:flex-[1.5] px-6 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer text-sm"
                >
                  Publish Announcement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
