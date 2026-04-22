import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { teachers as initialTeachers } from "../data/mockData";

export default function Teachers() {
  const [teacherList, setTeacherList] = useState(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    expertise: "",
  });
  const [errors, setErrors] = useState({});

  const filteredTeachers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return teacherList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q),
    );
  }, [teacherList, searchQuery]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.expertise.trim())
      newErrors.expertise = "At least one expertise is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        designation: teacher.designation,
        department: teacher.department,
        expertise: teacher.expertise.join(", "),
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        expertise: "",
      });
    }
    setErrors({});
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = () => {
    if (!validateForm()) return;

    const teacherData = {
      ...formData,
      expertise: formData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingTeacher) {
      setTeacherList((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id ? { ...t, ...teacherData } : t,
        ),
      );
    } else {
      const newTeacher = {
        id: Date.now(),
        ...teacherData,
        joinedAt: new Date().toISOString().split("T")[0],
      };
      setTeacherList((prev) => [newTeacher, ...prev]);
    }
    setShowTeacherModal(false);
  };

  const handleDelete = (id) => {
    setTeacherList((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Faculty Management
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium opacity-80">
            {teacherList.length} instructors total · Manage teaching staff and
            assignments
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          size="md"
          className="sm:w-auto w-full group shadow-lg shadow-primary/20"
        >
          <Plus
            size={19}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span>Add New Teacher</span>
        </Button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-surface/30 p-2 rounded-3xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, department or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-bold"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTeachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <Card className="h-full flex flex-col group p-0 overflow-hidden hover:border-primary/40 transition-all duration-300">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <User size={28} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 cursor-pointer"
                        onClick={() => handleOpenModal(teacher)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="p-2 rounded-xl cursor-pointer"
                        onClick={() => setDeleteConfirm(teacher)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-5 opacity-80">
                    {teacher.designation}
                  </p>

                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                      <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-muted">
                        <Mail size={14} />
                      </div>
                      <span className="truncate">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                      <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-muted">
                        <Phone size={14} />
                      </div>
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                      <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-text-muted">
                        <Briefcase size={14} />
                      </div>
                      <span>{teacher.department}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {teacher.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-surface-alt border border-border/50 text-text-muted group-hover:border-primary/20 transition-colors"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-surface-alt/30 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-text-muted" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Joined {teacher.joinedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <CheckCircle size={10} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      Active
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showTeacherModal}
        onClose={() => setShowTeacherModal(false)}
        title={
          editingTeacher ? "Update Teacher Profile" : "Onboard New Teacher"
        }
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="e.g. Dr. Jane Smith"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={errors.name}
            />
            <Input
              label="Email Address"
              placeholder="jane.s@edulearn.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              error={errors.phone}
            />
            <Input
              label="Designation"
              placeholder="e.g. Senior Lecturer"
              value={formData.designation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  designation: e.target.value,
                }))
              }
              error={errors.designation}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Department"
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              error={errors.department}
            />
            <div className="space-y-2">
              <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.15em] px-1">
                Expertise (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Python"
                value={formData.expertise}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expertise: e.target.value,
                  }))
                }
                className={`w-full px-5 py-3.5 rounded-2xl bg-background border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all ${errors.expertise ? "border-red-500" : "border-border focus:border-primary"}`}
              />
              {errors.expertise && (
                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 px-1">
                  {errors.expertise}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              className="rounded-2xl px-6"
              onClick={() => setShowTeacherModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-2xl px-10 shadow-lg shadow-primary/20"
              onClick={handleSaveTeacher}
            >
              {editingTeacher ? "Save Changes" : "Confirm Onboarding"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Offboard Teacher"
        className="max-w-md"
      >
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-text-primary">
              Confirm Offboarding
            </h4>
            <p className="text-sm text-text-muted mt-2 leading-relaxed font-medium">
              Are you sure you want to remove{" "}
              <strong className="text-red-500">{deleteConfirm?.name}</strong>{" "}
              from the faculty? This will revoke their access to all assigned
              batches.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              className="rounded-2xl px-6"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="rounded-2xl px-10 !bg-red-500 hover:!bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              onClick={() => handleDelete(deleteConfirm?.id)}
            >
              Confirm Removal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
