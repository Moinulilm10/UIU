import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, Search, Mail, Calendar, UserCheck } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Select from "../components/Select";
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
  const [migrateStudent, setMigrateStudent] = useState(null);
  const [targetBatchId, setTargetBatchId] = useState("");

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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Student Directory</h1>
        <p className="text-sm text-text-muted font-medium opacity-80">
          Viewing {filteredStudents.length} enrolled student{filteredStudents.length !== 1 ? "s" : ""} across all batches
        </p>
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
                        <Button variant="ghost" size="sm" className="px-4 py-2 rounded-xl cursor-pointer" onClick={() => { setMigrateStudent(student); setTargetBatchId(""); }}>
                        <ArrowRightLeft size={16} /> <span className="hidden sm:inline ml-1 font-bold">Migrate</span>
                        </Button>
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
