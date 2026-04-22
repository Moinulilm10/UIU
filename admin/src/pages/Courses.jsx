import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Plus, Search, MoreVertical, Edit2, Trash2, 
  Clock, Award, Users, Layout, CheckCircle, AlertCircle,
  X, Mail, User
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Select from "../components/Select";
import Badge from "../components/Badge";
import { courses as initialCourses, batches, students as initialStudents } from "../data/mockData";

export default function Courses() {
  const [courseList, setCourseList] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Drill-down states
  const [viewingBatchesCourse, setViewingBatchesCourse] = useState(null);
  const [viewingStudentsCourse, setViewingStudentsCourse] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
  });
  const [errors, setErrors] = useState({});

  const levels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "All Levels", label: "All Levels" },
  ];

  const filteredCourses = useMemo(() => {
    return courseList.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseList, searchQuery]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Course title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        duration: course.duration,
        level: course.level,
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: "", description: "", duration: "", level: "Beginner" });
    }
    setErrors({});
    setShowCourseModal(true);
  };

  const handleSaveCourse = () => {
    if (!validateForm()) return;

    if (editingCourse) {
      setCourseList(prev => prev.map(c => 
        c.id === editingCourse.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCourse = {
        id: Date.now(),
        ...formData,
        batchCount: 0,
        studentCount: 0,
      };
      setCourseList(prev => [newCourse, ...prev]);
    }
    setShowCourseModal(false);
  };

  const handleDelete = (id) => {
    // Check if course has active batches
    const hasBatches = batches.some(b => b.courseId === id);
    if (hasBatches) {
      alert("Cannot delete course with active batches. Please remove batches first.");
      setDeleteConfirm(null);
      return;
    }

    setCourseList(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const associatedBatches = useMemo(() => {
    if (!viewingBatchesCourse) return [];
    return batches.filter(b => b.courseId === viewingBatchesCourse.id);
  }, [viewingBatchesCourse]);

  const associatedStudents = useMemo(() => {
    if (!viewingStudentsCourse) return [];
    // Find all batches for this course
    const courseBatchIds = batches.filter(b => b.courseId === viewingStudentsCourse.id).map(b => b.id);
    return initialStudents.filter(s => courseBatchIds.includes(s.batchId));
  }, [viewingStudentsCourse]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Course Management</h1>
          <p className="text-sm text-text-muted mt-1 font-medium opacity-80">
            {courseList.length} total courses · Create and manage educational curriculum
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          size="md" 
          className="sm:w-auto w-full group shadow-lg shadow-primary/20"
        >
          <Plus size={19} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Create New Course</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface/30 p-2 rounded-3xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-bold"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <Card className="h-full flex flex-col group p-0 overflow-hidden hover:border-primary/40 transition-all duration-300">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <BookOpen size={24} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10"
                        onClick={() => handleOpenModal(course)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="p-2 rounded-xl"
                        onClick={() => setDeleteConfirm(course)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-2 mb-6 font-medium leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-text-secondary bg-surface-alt/50 p-2.5 rounded-xl border border-border/50">
                      <Clock size={14} className="text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-bold text-text-secondary bg-surface-alt/50 p-2.5 rounded-xl border border-border/50">
                      <Award size={14} className="text-primary" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-surface-alt/30 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setViewingBatchesCourse(course)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors group/stat" 
                        title="View Batches"
                    >
                      <Layout size={14} className="text-text-muted group-hover/stat:text-primary transition-colors" />
                      <span className="text-xs font-black text-text-primary group-hover/stat:text-primary">{course.batchCount}</span>
                    </button>
                    <button 
                        onClick={() => setViewingStudentsCourse(course)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors group/stat" 
                        title="View Students"
                    >
                      <Users size={14} className="text-text-muted group-hover/stat:text-primary transition-colors" />
                      <span className="text-xs font-black text-text-primary group-hover/stat:text-primary">{course.studentCount}</span>
                    </button>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                    Active
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-surface-alt rounded-3xl flex items-center justify-center text-text-muted mb-6 shadow-inner">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No courses found</h3>
          <p className="text-sm text-text-muted mt-2 max-w-sm font-medium">
            We couldn't find any courses matching your search. Try adjusting your keywords or create a new one.
          </p>
          <Button onClick={() => handleOpenModal()} className="mt-8 rounded-2xl px-8 py-3.5">
            Create New Course
          </Button>
        </div>
      )}

      {/* Course Create/Edit Modal */}
      <Modal 
        isOpen={showCourseModal} 
        onClose={() => setShowCourseModal(false)} 
        title={editingCourse ? "Edit Course" : "Create New Course"}
        className="max-w-xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.15em] px-1">Course Title</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Full-Stack Web Development"
                className={`w-full px-5 py-4 rounded-2xl bg-background border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all ${errors.title ? 'border-red-500' : 'border-border focus:border-primary'}`}
              />
              {errors.title && <div className="flex items-center gap-1 mt-1.5 px-1 text-red-500 text-[10px] font-bold uppercase"><AlertCircle size={12} /> {errors.title}</div>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.15em] px-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              placeholder="Provide a comprehensive description of the course content..."
              className={`w-full px-5 py-4 rounded-2xl bg-background border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none ${errors.description ? 'border-red-500' : 'border-border focus:border-primary'}`}
            />
            {errors.description && <div className="flex items-center gap-1 mt-1.5 px-1 text-red-500 text-[10px] font-bold uppercase"><AlertCircle size={12} /> {errors.description}</div>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-text-secondary uppercase tracking-[0.15em] px-1">Duration</label>
              <input 
                type="text" 
                value={formData.duration} 
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 6 Months"
                className={`w-full px-5 py-4 rounded-2xl bg-background border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all ${errors.duration ? 'border-red-500' : 'border-border focus:border-primary'}`}
              />
              {errors.duration && <div className="flex items-center gap-1 mt-1.5 px-1 text-red-500 text-[10px] font-bold uppercase"><AlertCircle size={12} /> {errors.duration}</div>}
            </div>

            <Select 
              label="Skill Level"
              value={formData.level}
              onChange={(val) => setFormData(prev => ({ ...prev, level: val }))}
              options={levels}
            />
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-border/50">
            <Button variant="ghost" className="rounded-2xl px-6" onClick={() => setShowCourseModal(false)}>Cancel</Button>
            <Button className="rounded-2xl px-10 shadow-lg shadow-primary/20" onClick={handleSaveCourse}>
              {editingCourse ? "Update Course" : "Create Course"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* VIEW BATCHES MODAL */}
      <Modal
        isOpen={!!viewingBatchesCourse}
        onClose={() => setViewingBatchesCourse(null)}
        title={`Batches for ${viewingBatchesCourse?.title}`}
        className="max-w-3xl"
      >
        <div className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {associatedBatches.length > 0 ? associatedBatches.map((batch, i) => {
                        const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                        return (
                            <motion.div 
                                key={batch.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-5 rounded-2xl bg-surface-alt/40 border border-border/50 hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h4 className="font-bold text-text-primary">{batch.name}</h4>
                                    <Badge status={batch.studentCount >= batch.maxLimit ? "closed" : batch.status} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-text-muted tracking-wider">
                                        <span>Capacity</span>
                                        <span>{batch.studentCount} / {batch.maxLimit}</span>
                                    </div>
                                    <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }) : (
                        <div className="col-span-full py-12 text-center opacity-40">
                            <Layout size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">No batches found for this course</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={() => setViewingBatchesCourse(null)} className="rounded-xl">Close View</Button>
            </div>
        </div>
      </Modal>

      {/* VIEW STUDENTS MODAL */}
      <Modal
        isOpen={!!viewingStudentsCourse}
        onClose={() => setViewingStudentsCourse(null)}
        title={`Enrolled Students: ${viewingStudentsCourse?.title}`}
        className="max-w-4xl"
      >
        <div className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {associatedStudents.length > 0 ? associatedStudents.map((student, i) => (
                        <motion.div 
                            key={student.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-surface-alt/40 border border-border/50 group hover:border-primary/30 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                {student.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-text-primary truncate">{student.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] text-text-muted font-bold truncate">
                                        <Mail size={10} /> {student.email}
                                    </span>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                        {batches.find(b => b.id === student.batchId)?.name || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-12 text-center opacity-40">
                            <Users size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">No students enrolled in this course</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={() => setViewingStudentsCourse(null)} className="rounded-xl">Close View</Button>
            </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Course" className="max-w-md">
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-text-primary">Confirm Deletion</h4>
            <p className="text-sm text-text-muted mt-2 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-red-500">{deleteConfirm?.title}</strong>? 
              This will permanently remove the course and all its data.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" className="rounded-2xl px-6" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button 
              variant="danger" 
              className="rounded-2xl px-10 !bg-red-500 hover:!bg-red-600 transition-colors shadow-lg shadow-red-500/20" 
              onClick={() => handleDelete(deleteConfirm?.id)}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
