import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, Search, Mail, Calendar, UserCheck, Plus, Edit2, Trash2, User } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Select from "../components/Select";
import Input from "../components/Input";
import Pagination from "../components/Pagination";
import { batches as initialBatches, students as initialStudents } from "../data/mockData";

const PAGE_SIZE = 6;

export default function Students() {
  "use no memo";
  const [searchParams] = useSearchParams();
  const preselectedBatch = searchParams.get("batchId");

  const [batchList] = useState(initialBatches);
  const [studentList, setStudentList] = useState(initialStudents);
  const [selectedBatchId, setSelectedBatchId] = useState(
    preselectedBatch ? Number(preselectedBatch) : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // CRUD States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
    batchId: "",
    enrolledDate: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});

  const [migrateStudent, setMigrateStudent] = useState(null);
  const [targetBatchId, setTargetBatchId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, student: null });

  const filteredStudents = useMemo(() => {
    let result = studentList;
    if (selectedBatchId) result = result.filter((s) => s.batchId === selectedBatchId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    return result;
  }, [studentList, selectedBatchId, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getBatchName = (batchId) => batchList.find((b) => b.id === batchId)?.name || "Unknown";
  const getAvailableBatches = (studentBatchId) => batchList.filter((b) => b.id !== studentBatchId && b.studentCount < b.maxLimit);

  const handleMigrate = () => {
    if (!migrateStudent || !targetBatchId) return;
    const tId = Number(targetBatchId);
    const targetBatch = batchList.find((b) => b.id === tId);
    if (!targetBatch || targetBatch.studentCount >= targetBatch.maxLimit) return;
    setStudentList((prev) => prev.map((s) => (s.id === migrateStudent.id ? { ...s, batchId: tId } : s)));
    setMigrateStudent(null);
    setTargetBatchId("");
  };

  const handleOpenStudentModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setStudentFormData({
        name: student.name,
        email: student.email,
        batchId: student.batchId,
        enrolledDate: student.enrolledDate
      });
    } else {
      setEditingStudent(null);
      setStudentFormData({
        name: "",
        email: "",
        batchId: selectedBatchId || "",
        enrolledDate: new Date().toISOString().split('T')[0]
      });
    }
    setFormErrors({});
    setShowStudentModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!studentFormData.name.trim()) errors.name = "Full name is required";
    if (!studentFormData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(studentFormData.email)) errors.email = "Invalid email format";
    if (!studentFormData.batchId) errors.batchId = "Please select a batch";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveStudent = () => {
    if (!validateForm()) return;

    if (editingStudent) {
      setStudentList(prev => prev.map(s => 
        s.id === editingStudent.id ? { ...s, ...studentFormData, batchId: Number(studentFormData.batchId) } : s
      ));
    } else {
      const newStudent = {
        id: Date.now(),
        ...studentFormData,
        batchId: Number(studentFormData.batchId)
      };
      setStudentList(prev => [newStudent, ...prev]);
    }
    setShowStudentModal(false);
  };

  const handleDeleteStudent = () => {
    setStudentList(prev => prev.filter(s => s.id !== deleteConfirm.student.id));
    setDeleteConfirm({ show: false, student: null });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Student Directory</h1>
          <p className="text-sm text-text-muted font-medium opacity-80">
            Viewing {filteredStudents.length} enrolled student{filteredStudents.length !== 1 ? "s" : ""} across all batches
          </p>
        </div>
        <Button 
          onClick={() => handleOpenStudentModal()}
          className="shadow-lg shadow-primary/20 rounded-2xl py-3 px-6"
        >
          <Plus size={20} className="mr-2" />
          <span>Onboard New Student</span>
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-surface/30 p-2 rounded-3xl border border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border flex-1 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text" placeholder="Search by student name or email address..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-medium"
          />
        </div>
        <div className="w-full lg:w-64">
            <Select
                value={selectedBatchId || ""}
                onChange={(val) => { setSelectedBatchId(val ? Number(val) : null); setCurrentPage(1); }}
                options={[{ value: "", label: "All Batches" }, ...batchList.map(b => ({ value: b.id, label: b.name, sublabel: b.courseName }))]}
                placeholder="Filter by batch"
            />
        </div>
      </div>

      {/* Table */}
      <Card hover={false} className="overflow-hidden !p-0 border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-alt/30 border-b border-border">
                <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Student Identity</th>
                <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em] hidden sm:table-cell">Contact Details</th>
                <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em] text-center">Current Batch</th>
                <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em] hidden md:table-cell">Enrollment Date</th>
                <th className="text-right px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <AnimatePresence mode="popLayout">
                {paginatedStudents.map((student, i) => (
                    <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="hover:bg-surface-alt/30 transition-colors group"
                    >
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-black text-xs shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{student.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-text-secondary hidden sm:table-cell">
                        <div className="flex items-center gap-2 font-medium opacity-80">
                        <Mail size={14} className="text-text-muted shrink-0" />
                        <span className="truncate">{student.email}</span>
                        </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                        <span className="inline-flex px-3 py-1 rounded-xl bg-surface-alt border border-border/50 text-[10px] font-black uppercase tracking-wider text-text-primary">
                        {getBatchName(student.batchId)}
                        </span>
                    </td>
                    <td className="px-6 py-5 text-text-secondary hidden md:table-cell">
                        <div className="flex items-center gap-2 font-semibold opacity-70 whitespace-nowrap">
                        <Calendar size={14} className="text-text-muted shrink-0" />
                        {new Date(student.enrolledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-2 rounded-xl cursor-pointer text-text-muted hover:text-primary" 
                                onClick={() => handleOpenStudentModal(student)}
                                title="Edit Student"
                            >
                                <Edit2 size={16} />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-2 rounded-xl cursor-pointer text-text-muted hover:text-primary" 
                                onClick={() => { setMigrateStudent(student); setTargetBatchId(""); }}
                                title="Migrate Batch"
                            >
                                <ArrowRightLeft size={16} />
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                className="p-2 rounded-xl cursor-pointer" 
                                onClick={() => setDeleteConfirm({ show: true, student })}
                                title="Remove Student"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </td>
                    </motion.tr>
                ))}
              </AnimatePresence>
              {paginatedStudents.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                        <Search size={48} />
                        <p className="text-sm font-bold">No students matched your criteria</p>
                    </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-6 bg-surface-alt/10 border-t border-border/50">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal 
        isOpen={showStudentModal} 
        onClose={() => setShowStudentModal(false)} 
        title={editingStudent ? "Update Student Profile" : "Onboard New Student"}
        className="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <User size={40} />
            </div>
            <p className="text-xs font-black text-text-muted uppercase tracking-widest">
                {editingStudent ? "Editing Existing Record" : "Creating New Enrollment"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
                label="Full Name" 
                placeholder="e.g. John Doe"
                value={studentFormData.name}
                onChange={(e) => setStudentFormData({...studentFormData, name: e.target.value})}
                error={formErrors.name}
            />
            <Input 
                label="Email Address" 
                placeholder="john.doe@example.com"
                type="email"
                value={studentFormData.email}
                onChange={(e) => setStudentFormData({...studentFormData, email: e.target.value})}
                error={formErrors.email}
            />
            <Select 
                label="Assign to Batch"
                value={studentFormData.batchId}
                onChange={(val) => setStudentFormData({...studentFormData, batchId: val})}
                options={batchList.map(b => ({ 
                    value: b.id, 
                    label: b.name, 
                    sublabel: `${b.courseName} (${b.studentCount}/${b.maxLimit})` 
                }))}
                error={formErrors.batchId}
            />
            <Input 
                label="Enrollment Date" 
                type="date"
                value={studentFormData.enrolledDate}
                onChange={(e) => setStudentFormData({...studentFormData, enrolledDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
            <Button variant="ghost" className="rounded-xl px-6" onClick={() => setShowStudentModal(false)}>Cancel</Button>
            <Button className="rounded-xl px-10 shadow-lg shadow-primary/20" onClick={handleSaveStudent}>
                {editingStudent ? "Save Changes" : "Complete Onboarding"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteConfirm.show} 
        onClose={() => setDeleteConfirm({ show: false, student: null })} 
        title="Remove Student"
        className="max-w-md"
      >
        <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-4 shadow-inner">
                    <Trash2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-text-primary">Confirm Removal</h4>
                <p className="text-sm text-text-muted mt-2 font-medium leading-relaxed">
                    Are you sure you want to remove <strong className="text-red-500">{deleteConfirm.student?.name}</strong> from the student directory? This action cannot be undone.
                </p>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="ghost" className="rounded-xl px-6" onClick={() => setDeleteConfirm({ show: false, student: null })}>Cancel</Button>
                <Button variant="danger" className="rounded-xl px-8 !bg-red-500 !text-white shadow-lg shadow-red-500/20" onClick={handleDeleteStudent}>Confirm Removal</Button>
            </div>
        </div>
      </Modal>

      {/* Migrate Modal */}
      <Modal isOpen={!!migrateStudent} onClose={() => setMigrateStudent(null)} title="Student Migration">
        {migrateStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface-alt/50 border border-border/50">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserCheck size={24} />
                </div>
                <div>
                    <p className="text-sm font-black text-text-primary">{migrateStudent.name}</p>
                    <p className="text-xs text-text-muted font-bold mt-0.5">Currently in {getBatchName(migrateStudent.batchId)}</p>
                </div>
            </div>

            <Select
                label="Target Batch Selection"
                value={targetBatchId}
                onChange={setTargetBatchId}
                options={getAvailableBatches(migrateStudent.batchId).map((b) => ({
                    value: b.id,
                    label: b.name,
                    sublabel: `${b.courseName} (${b.studentCount}/${b.maxLimit} Students)`
                }))}
                placeholder="Select a destination batch..."
            />

            {targetBatchId && (() => {
                const tb = batchList.find((b) => b.id === Number(targetBatchId));
                return tb && tb.studentCount >= tb.maxLimit ? (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-black uppercase text-center tracking-wider">
                        ⚠ Selected batch is at max capacity
                    </div>
                ) : null;
            })()}

            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button variant="ghost" className="rounded-xl" onClick={() => setMigrateStudent(null)}>Cancel</Button>
              <Button className="rounded-xl px-10" onClick={handleMigrate} disabled={!targetBatchId}>Complete Migration</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
