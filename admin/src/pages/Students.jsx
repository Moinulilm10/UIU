import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightLeft, Search, Mail, Calendar } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
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
    if (selectedBatchId) {
      result = result.filter((s) => s.batchId === selectedBatchId);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [studentList, selectedBatchId, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getBatchName = (batchId) => {
    const batch = batchList.find((b) => b.id === batchId);
    return batch ? batch.name : "Unknown";
  };

  const getAvailableBatches = (studentBatchId) => {
    return batchList.filter(
      (b) => b.id !== studentBatchId && b.studentCount < b.maxLimit
    );
  };

  const handleMigrate = () => {
    if (!migrateStudent || !targetBatchId) return;
    const tId = Number(targetBatchId);
    const targetBatch = batchList.find((b) => b.id === tId);
    if (!targetBatch || targetBatch.studentCount >= targetBatch.maxLimit) return;

    setStudentList((prev) =>
      prev.map((s) =>
        s.id === migrateStudent.id ? { ...s, batchId: tId } : s
      )
    );
    setMigrateStudent(null);
    setTargetBatchId("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Student Management</h1>
        <p className="text-sm text-text-muted mt-1">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border flex-1">
          <Search size={15} className="text-text-muted shrink-0" />
          <input
            type="text" placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
          />
        </div>
        <select
          value={selectedBatchId || ""}
          onChange={(e) => { setSelectedBatchId(e.target.value ? Number(e.target.value) : null); setCurrentPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <option value="">All Batches</option>
          {batchList.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card hover={false} className="overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Batch</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Enrolled</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-text-primary">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-text-muted" />
                      {student.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-surface-alt text-xs font-medium text-text-primary">
                      {getBatchName(student.batchId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-text-muted" />
                      {new Date(student.enrolledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => { setMigrateStudent(student); setTargetBatchId(""); }}
                    >
                      <ArrowRightLeft size={14} /> Migrate
                    </Button>
                  </td>
                </motion.tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>

      {/* Migrate Modal */}
      <Modal isOpen={!!migrateStudent} onClose={() => setMigrateStudent(null)} title="Migrate Student">
        {migrateStudent && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Move <strong className="text-text-primary">{migrateStudent.name}</strong> from{" "}
              <strong className="text-text-primary">{getBatchName(migrateStudent.batchId)}</strong> to:
            </p>
            <select
              value={targetBatchId}
              onChange={(e) => setTargetBatchId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="">Select target batch...</option>
              {getAvailableBatches(migrateStudent.batchId).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.studentCount}/{b.maxLimit} students)
                </option>
              ))}
            </select>
            {targetBatchId && (() => {
              const tb = batchList.find((b) => b.id === Number(targetBatchId));
              if (tb && tb.studentCount >= tb.maxLimit) {
                return <p className="text-xs text-red-400">⚠ This batch is at max capacity.</p>;
              }
              return null;
            })()}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setMigrateStudent(null)}>Cancel</Button>
              <Button onClick={handleMigrate} disabled={!targetBatchId}>Confirm Migration</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
