import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2, Eye, LayoutGrid, List, Search } from "lucide-react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { batches as initialBatches } from "../data/mockData";

export default function BatchManagement() {
  "use no memo";
  const navigate = useNavigate();
  const [batchList, setBatchList] = useState(() =>
    initialBatches.map((b) => ({
      ...b,
      status: b.studentCount >= b.maxLimit ? "closed" : b.status,
    }))
  );
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editBatch, setEditBatch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: "", courseName: "", maxLimit: "" });

  const filteredBatches = useMemo(() => {
    if (!searchQuery) return batchList;
    const q = searchQuery.toLowerCase();
    return batchList.filter(
      (b) => b.name.toLowerCase().includes(q) || b.courseName.toLowerCase().includes(q)
    );
  }, [batchList, searchQuery]);

  const openCreate = () => {
    setForm({ name: "", courseName: "", maxLimit: "" });
    setShowCreateModal(true);
  };
  const openEdit = (batch) => {
    setForm({ name: batch.name, courseName: batch.courseName, maxLimit: String(batch.maxLimit) });
    setEditBatch(batch);
  };
  const handleSave = () => {
    if (!form.name || !form.courseName || !form.maxLimit) return;
    if (editBatch) {
      setBatchList((prev) =>
        prev.map((b) =>
          b.id === editBatch.id
            ? { ...b, name: form.name, courseName: form.courseName, maxLimit: Number(form.maxLimit), status: b.studentCount >= Number(form.maxLimit) ? "closed" : "open" }
            : b
        )
      );
      setEditBatch(null);
    } else {
      setBatchList((prev) => [...prev, { id: Date.now(), name: form.name, courseName: form.courseName, studentCount: 0, maxLimit: Number(form.maxLimit), status: "open" }]);
      setShowCreateModal(false);
    }
  };
  const handleDelete = (id) => {
    setBatchList((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Batch Management</h1>
          <p className="text-sm text-text-muted mt-1 font-medium opacity-80">{batchList.length} batches total · Manage schedules and capacity</p>
        </div>
        <Button onClick={openCreate} size="md" className="sm:w-auto w-full"><Plus size={18} /> Create New Batch</Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-surface/30 p-2 rounded-3xl border border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-border flex-1 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <Search size={18} className="text-text-muted shrink-0" />
          <input type="text" placeholder="Search by batch or course name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-medium" />
        </div>
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-border self-start sm:self-auto">
          <button onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary"}`}>
            <LayoutGrid size={16} /> Grid
          </button>
          <button onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary"}`}>
            <List size={16} /> List
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredBatches.map((batch, i) => {
            const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
            const isFull = batch.studentCount >= batch.maxLimit;
            return (
              <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full flex flex-col group">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">{batch.name}</h3>
                      <p className="text-xs text-text-muted mt-1 font-semibold truncate uppercase tracking-wider">{batch.courseName}</p>
                    </div>
                    <Badge status={isFull ? "closed" : batch.status} className="scale-110" />
                  </div>
                  
                  <div className="flex-1 mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Enrollment Status</span>
                      <span className="text-xs font-black text-text-primary tabular-nums">{batch.studentCount} / {batch.maxLimit}</span>
                    </div>
                    <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-border/20 p-0.5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-inner ${isFull ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} />
                    </div>
                    <p className="text-[10px] text-text-muted mt-2 font-bold text-right opacity-60">{pct}% Capacity Filled</p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-border/50">
                    <Button variant="secondary" size="sm" className="flex-1 rounded-xl" onClick={() => navigate(`/students?batchId=${batch.id}`)}>
                      <Eye size={16} /> View Students
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => openEdit(batch)}><Edit3 size={16} /></Button>
                    <Button variant="danger" size="sm" className="rounded-xl" onClick={() => setDeleteConfirm(batch)}><Trash2 size={16} /></Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card hover={false} className="overflow-hidden !p-0 border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-alt/30 border-b border-border">
                  <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Batch Identity</th>
                  <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em] hidden sm:table-cell">Associated Course</th>
                  <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Capacity Usage</th>
                  <th className="text-left px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em] hidden md:table-cell text-center">Status</th>
                  <th className="text-right px-6 py-5 text-xs font-black text-text-muted uppercase tracking-[0.2em]">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredBatches.map((batch) => {
                  const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                  const isFull = batch.studentCount >= batch.maxLimit;
                  return (
                    <tr key={batch.id} className="hover:bg-surface-alt/30 transition-colors group">
                      <td className="px-6 py-5">
                         <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{batch.name}</p>
                      </td>
                      <td className="px-6 py-5 text-text-secondary font-medium hidden sm:table-cell">{batch.courseName}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-24 sm:w-32 h-2 bg-surface-alt rounded-full overflow-hidden border border-border/20">
                            <div className={`h-full rounded-full ${isFull ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-black text-text-primary tabular-nums">{batch.studentCount}/{batch.maxLimit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell text-center"><Badge status={isFull ? "closed" : batch.status} /></td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="p-2 rounded-xl" onClick={() => navigate(`/students?batchId=${batch.id}`)}><Eye size={18} /></Button>
                          <Button variant="ghost" size="sm" className="p-2 rounded-xl" onClick={() => openEdit(batch)}><Edit3 size={18} /></Button>
                          <Button variant="danger" size="sm" className="p-2 rounded-xl" onClick={() => setDeleteConfirm(batch)}><Trash2 size={18} /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Batch">
        <div className="space-y-6">
          <Input label="Batch Name" placeholder="e.g. Batch Lambda" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Course Name" placeholder="e.g. React Advanced" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          <Input label="Max Limit" type="number" placeholder="e.g. 30" value={form.maxLimit} onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" className="rounded-xl" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button className="rounded-xl px-8" onClick={handleSave}>Create Batch</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={!!editBatch} onClose={() => setEditBatch(null)} title="Edit Batch Details">
        <div className="space-y-6">
          <Input label="Batch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Course Name" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          <Input label="Max Limit" type="number" value={form.maxLimit} onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" className="rounded-xl" onClick={() => setEditBatch(null)}>Cancel</Button>
            <Button className="rounded-xl px-8" onClick={handleSave}>Update Batch</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Deletion">
        <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-bold text-center leading-relaxed">
                    Are you sure you want to delete <strong className="text-red-500 underline underline-offset-4">{deleteConfirm?.name}</strong>?
                    <br />This action is permanent and cannot be undone.
                </p>
            </div>
            <div className="flex justify-end gap-3">
            <Button variant="ghost" className="rounded-xl" onClick={() => setDeleteConfirm(null)}>Keep Batch</Button>
            <Button variant="danger" className="rounded-xl px-8 !bg-red-500 !text-white" onClick={() => handleDelete(deleteConfirm.id)}>Delete Permanently</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
}
