import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, Plus, Search, Filter, Calendar, 
  Target, Edit2, Trash2, ChevronRight, AlertCircle,
  MoreVertical, CheckCircle2, Clock, Book, Layers,
  Bookmark, FileText
} from "lucide-react";
import { subjects, assignments as initialAssignments } from "../data/mockData";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "subject", // subject, module, chapter, topic
    subjectId: "",
    moduleId: "",
    chapterId: "",
    topicId: "",
    dueDate: "",
    points: 100,
    status: "active"
  });

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assignments, searchQuery]);

  // Hierarchical Options
  const subjectOptions = useMemo(() => 
    subjects.map(s => ({ value: s.id, label: s.title })), 
  [subjects]);

  const moduleOptions = useMemo(() => {
    if (!formData.subjectId) return [];
    const subject = subjects.find(s => s.id === formData.subjectId);
    return subject?.modules?.map(m => ({ value: m.id, label: m.title })) || [];
  }, [formData.subjectId]);

  const chapterOptions = useMemo(() => {
    if (!formData.moduleId) return [];
    const subject = subjects.find(s => s.id === formData.subjectId);
    const module = subject?.modules?.find(m => m.id === formData.moduleId);
    return module?.chapters?.map(c => ({ value: c.id, label: c.title })) || [];
  }, [formData.moduleId, formData.subjectId]);

  const topicOptions = useMemo(() => {
    if (!formData.chapterId) return [];
    const subject = subjects.find(s => s.id === formData.subjectId);
    const module = subject?.modules?.find(m => m.id === formData.moduleId);
    const chapter = module?.chapters?.find(c => c.id === formData.chapterId);
    return chapter?.topics?.map(t => ({ value: t.id, label: t.title })) || [];
  }, [formData.chapterId, formData.moduleId, formData.subjectId]);

  const handleOpenModal = (asgn = null) => {
    if (asgn) {
      setEditingAssignment(asgn);
      // Logic to reverse engineer the path would be complex, 
      // but for simplicity in mock, we'll just set what we have
      setFormData({
        ...asgn,
        subjectId: "", // In a real app, targetId would be resolved to a full path
        moduleId: "",
        chapterId: "",
        topicId: ""
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        title: "",
        description: "",
        type: "subject",
        subjectId: "",
        moduleId: "",
        chapterId: "",
        topicId: "",
        dueDate: "",
        points: 100,
        status: "active"
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title) return;

    // Determine targetId based on type
    let targetId = "";
    if (formData.type === "subject") targetId = formData.subjectId;
    else if (formData.type === "module") targetId = formData.moduleId;
    else if (formData.type === "chapter") targetId = formData.chapterId;
    else if (formData.type === "topic") targetId = formData.topicId;

    const newAsgn = {
      ...formData,
      id: editingAssignment?.id || `asgn-${Date.now()}`,
      targetId
    };

    if (editingAssignment) {
      setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? newAsgn : a));
    } else {
      setAssignments(prev => [...prev, newAsgn]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setAssignments(prev => prev.filter(a => a.id !== deleteConfirm.id));
    setDeleteConfirm({ show: false, id: null, title: "" });
  };

  const getTargetName = (type, id) => {
    // Helper to find the name of the attached item with loose equality for type safety
    for (const s of subjects) {
      if (type === "subject" && s.id == id) return s.title;
      for (const m of (s.modules || [])) {
        if (type === "module" && m.id == id) return m.title;
        for (const c of (m.chapters || [])) {
          if (type === "chapter" && c.id == id) return c.title;
          for (const t of (c.topics || [])) {
            if (type === "topic" && t.id == id) return t.title;
          }
        }
      }
    }
    return "Unknown Target";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Assignments</h1>
          <p className="text-text-muted mt-1 font-medium">Create and manage curriculum-based assessments</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/25">
          <Plus size={18} className="mr-2" /> Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 p-2 bg-surface/50 border-border/40">
          <div className="flex items-center gap-3 px-4 py-2">
            <Search size={18} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Search assignments by title or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-medium text-text-primary placeholder:text-text-muted/50"
            />
          </div>
        </Card>
        <div className="flex gap-2">
          <Select 
            placeholder="Sort by"
            options={[
              { value: "recent", label: "Most Recent" },
              { value: "due", label: "Due Date" },
              { value: "points", label: "Points" }
            ]}
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((asgn, index) => (
              <motion.div
                key={asgn.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col group hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${
                        asgn.type === "subject" ? "bg-primary/10 text-primary" :
                        asgn.type === "module" ? "bg-emerald-500/10 text-emerald-500" :
                        asgn.type === "chapter" ? "bg-orange-500/10 text-orange-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        <Target size={24} />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenModal(asgn)} className="p-2 rounded-xl hover:bg-surface-alt text-text-muted hover:text-primary transition-colors cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm({ show: true, id: asgn.id, title: asgn.title })} className="p-2 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{asgn.title}</h3>
                    <p className="text-sm text-text-muted line-clamp-2 font-medium leading-relaxed mb-4">{asgn.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-alt/50 border border-border/40">
                        <div className="text-text-muted">
                          {asgn.type === "subject" ? <Book size={14} /> :
                           asgn.type === "module" ? <Layers size={14} /> :
                           asgn.type === "chapter" ? <Bookmark size={14} /> :
                           <FileText size={14} />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary truncate">
                          {asgn.type}: {getTargetName(asgn.type, asgn.targetId)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <Calendar size={14} />
                          <span>Due {asgn.dueDate}</span>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] uppercase font-black tracking-tighter">
                          {asgn.points} Points
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border/40 bg-surface-alt/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${asgn.status === "active" ? "bg-emerald-500" : "bg-orange-500"}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{asgn.status}</span>
                    </div>
                    <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface-alt flex items-center justify-center text-text-muted mb-4 border border-border/50 shadow-inner">
                <ClipboardList size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">No assignments found</h3>
              <p className="text-sm text-text-muted mt-1 font-medium">Try adjusting your search or create a new assignment.</p>
              <Button onClick={() => handleOpenModal()} className="mt-6" variant="ghost">
                <Plus size={18} className="mr-2" /> Add Your First Assignment
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Assignment Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={editingAssignment ? "Edit Assignment" : "New Assignment"}
        className="max-w-2xl"
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1 scrollbar-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Assignment Title" 
                placeholder="e.g., Final Project Proposal" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1 mb-2">Description</label>
              <textarea 
                className="w-full px-5 py-4 rounded-2xl bg-background border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium text-text-primary min-h-[100px]"
                placeholder="Detailed instructions for students..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Select 
              label="Attachment Level"
              value={formData.type}
              onChange={(val) => setFormData({...formData, type: val, moduleId: "", chapterId: "", topicId: ""})}
              options={[
                { value: "subject", label: "Subject Level" },
                { value: "module", label: "Module Level" },
                { value: "chapter", label: "Chapter Level" },
                { value: "topic", label: "Topic Level" }
              ]}
            />

            <Input 
              label="Due Date" 
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />

            <Select 
              label="Select Subject"
              value={formData.subjectId}
              onChange={(val) => setFormData({...formData, subjectId: val, moduleId: "", chapterId: "", topicId: ""})}
              options={subjectOptions}
            />

            {formData.type !== "subject" && (
              <Select 
                label="Select Module"
                value={formData.moduleId}
                onChange={(val) => setFormData({...formData, moduleId: val, chapterId: "", topicId: ""})}
                options={moduleOptions}
                placeholder={formData.subjectId ? "Select Module" : "Select Subject First"}
              />
            )}

            {(formData.type === "chapter" || formData.type === "topic") && (
              <Select 
                label="Select Chapter"
                value={formData.chapterId}
                onChange={(val) => setFormData({...formData, chapterId: val, topicId: ""})}
                options={chapterOptions}
                placeholder={formData.moduleId ? "Select Chapter" : "Select Module First"}
              />
            )}

            {formData.type === "topic" && (
              <Select 
                label="Select Topic"
                value={formData.topicId}
                onChange={(val) => setFormData({...formData, topicId: val})}
                options={topicOptions}
                placeholder={formData.chapterId ? "Select Topic" : "Select Chapter First"}
              />
            )}

            <Input 
              label="Points" 
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.title}>
              {editingAssignment ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal 
        isOpen={deleteConfirm.show} 
        onClose={() => setDeleteConfirm({ show: false, id: null, title: "" })}
        title="Delete Assignment"
        className="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-text-primary">Remove Assignment?</h4>
            <p className="text-sm text-text-muted mt-2 font-medium">Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm({ show: false, id: null, title: "" })}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} className="bg-red-500">Delete Permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
