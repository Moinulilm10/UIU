import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Plus, Search, Calendar, Clock, 
  ExternalLink, Edit2, Trash2, MoreVertical,
  CheckCircle2, AlertCircle, Users, User,
  VideoOff, LayoutGrid, List
} from "lucide-react";
import { classes as initialClasses, teachers, batches } from "../data/mockData";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";

export default function Classes() {
  const [classList, setClassList] = useState(initialClasses);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    batchId: "",
    teacherId: "",
    platform: "Zoom", // Zoom | Google Meet
    link: "",
    date: "",
    time: "",
    status: "upcoming"
  });

  const filteredClasses = useMemo(() => {
    return classList.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classList, searchQuery]);

  const teacherOptions = useMemo(() => 
    teachers.map(t => ({ value: t.id, label: t.name, sublabel: t.designation })), 
  [teachers]);

  const batchOptions = useMemo(() => 
    batches.map(b => ({ value: b.id, label: b.name, sublabel: b.courseName })), 
  [batches]);

  const handleOpenModal = (cls = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ ...cls });
    } else {
      setEditingClass(null);
      setFormData({
        title: "",
        batchId: "",
        teacherId: "",
        platform: "Zoom",
        link: "",
        date: "",
        time: "",
        status: "upcoming"
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.link) return;

    const newClass = {
      ...formData,
      id: editingClass?.id || `cls-${Date.now()}`
    };

    if (editingClass) {
      setClassList(prev => prev.map(c => c.id === editingClass.id ? newClass : c));
    } else {
      setClassList(prev => [...prev, newClass]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setClassList(prev => prev.filter(c => c.id !== deleteConfirm.id));
    setDeleteConfirm({ show: false, id: null, title: "" });
  };

  const getPlatformIcon = (platform) => {
    if (platform === "Zoom") {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <Video size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <Video size={20} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Live Classes</h1>
          <p className="text-text-muted mt-1 font-medium">Schedule and manage virtual classroom sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface p-1 rounded-xl border border-border/50">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-text-primary"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-text-primary"}`}
            >
              <List size={18} />
            </button>
          </div>
          <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/25">
            <Plus size={18} className="mr-2" /> Schedule Class
          </Button>
        </div>
      </div>

      <Card className="p-2 bg-surface/50 border-border/40 max-w-2xl">
        <div className="flex items-center gap-3 px-4 py-2">
          <Search size={18} className="text-text-muted" />
          <input 
            type="text" 
            placeholder="Search classes by title or platform..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-text-primary placeholder:text-text-muted/50"
          />
        </div>
      </Card>

      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        <AnimatePresence mode="popLayout">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <Card className="h-full flex flex-col group hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        {getPlatformIcon(cls.platform)}
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenModal(cls)} className="p-2 rounded-xl hover:bg-surface-alt text-text-muted hover:text-primary transition-colors cursor-pointer">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ show: true, id: cls.id, title: cls.title })} className="p-2 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 mb-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                          <span>{cls.platform}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-text-muted uppercase">{cls.status}</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{cls.title}</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                          <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-secondary">
                            <Users size={14} />
                          </div>
                          <span>{batches.find(b => b.id == cls.batchId)?.name || "All Batches"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                          <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-secondary">
                            <User size={14} />
                          </div>
                          <span>{teachers.find(t => t.id == cls.teacherId)?.name || "Guest Teacher"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border/40 bg-surface-alt/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                          <Calendar size={14} className="text-text-muted" />
                          <span>{cls.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                          <Clock size={14} className="text-text-muted" />
                          <span>{cls.time}</span>
                        </div>
                      </div>
                      <a 
                        href={cls.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-background border border-border hover:border-primary hover:text-primary transition-all text-xs font-black uppercase tracking-widest"
                      >
                        Join Session <ExternalLink size={14} />
                      </a>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      {getPlatformIcon(cls.platform)}
                      <div>
                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{cls.title}</h3>
                        <p className="text-xs font-medium text-text-muted mt-0.5">
                          {batches.find(b => b.id == cls.batchId)?.name} • {teachers.find(t => t.id == cls.teacherId)?.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 px-6 border-x border-border/40">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-bold text-text-primary">{cls.date}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Time</p>
                        <p className="text-sm font-bold text-text-primary">{cls.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <a 
                        href={cls.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Join <ExternalLink size={14} />
                      </a>
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenModal(cls)} className="p-2 rounded-xl hover:bg-surface-alt text-text-muted hover:text-primary transition-colors cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm({ show: true, id: cls.id, title: cls.title })} className="p-2 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface-alt flex items-center justify-center text-text-muted mb-4 border border-border/50 shadow-inner">
                <VideoOff size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">No classes scheduled</h3>
              <p className="text-sm text-text-muted mt-1 font-medium">Schedule a new live session for your students.</p>
              <Button onClick={() => handleOpenModal()} className="mt-6" variant="ghost">
                <Plus size={18} className="mr-2" /> Schedule Your First Class
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Class Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={editingClass ? "Edit Session" : "Schedule Live Session"}
        className="max-w-2xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1 scrollbar-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Session Title" 
                placeholder="e.g., Weekly Q&A or Advanced Topics" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <Select 
              label="Select Batch"
              value={formData.batchId}
              onChange={(val) => setFormData({...formData, batchId: val})}
              options={batchOptions}
            />

            <Select 
              label="Select Teacher"
              value={formData.teacherId}
              onChange={(val) => setFormData({...formData, teacherId: val})}
              options={teacherOptions}
            />

            <Select 
              label="Streaming Platform"
              value={formData.platform}
              onChange={(val) => setFormData({...formData, platform: val})}
              options={[
                { value: "Zoom", label: "Zoom Video Communications" },
                { value: "Google Meet", label: "Google Meet" }
              ]}
            />

            <Input 
              label="Meeting Link" 
              placeholder="https://..." 
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />

            <Input 
              label="Date" 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />

            <Input 
              label="Start Time" 
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />

            <Select 
              label="Status"
              value={formData.status}
              onChange={(val) => setFormData({...formData, status: val})}
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "live", label: "Live Now" },
                { value: "completed", label: "Completed" }
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.link}>
              {editingClass ? "Update Session" : "Schedule Session"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal 
        isOpen={deleteConfirm.show} 
        onClose={() => setDeleteConfirm({ show: false, id: null, title: "" })}
        title="Cancel Session"
        className="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-text-primary">Cancel this class?</h4>
            <p className="text-sm text-text-muted mt-2 font-medium">Are you sure you want to cancel <strong>{deleteConfirm.title}</strong>? Students will be notified.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm({ show: false, id: null, title: "" })}>No, Keep it</Button>
            <Button variant="danger" onClick={handleDelete} className="bg-red-500 text-white">Yes, Cancel Session</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
