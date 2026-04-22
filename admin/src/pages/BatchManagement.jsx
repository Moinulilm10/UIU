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
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Batch Management</h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">{batchList.length} batches total</p>
        </div>
        <Button onClick={openCreate} size="md"><Plus size={16} /> Create Batch</Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface border border-border flex-1">
          <Search size={15} className="text-text-muted shrink-0" />
          <input type="text" placeholder="Search batches..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border self-start sm:self-auto">
          <button onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary"}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-primary"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filteredBatches.map((batch, i) => {
            const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
            const isFull = batch.studentCount >= batch.maxLimit;
            return (
              <motion.div key={batch.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="!p-4 sm:!p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-text-primary truncate">{batch.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5 truncate">{batch.courseName}</p>
                    </div>
                    <Badge status={isFull ? "closed" : batch.status} />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-text-muted">Capacity</span>
                      <span className="text-[11px] font-semibold text-text-primary">{batch.studentCount}/{batch.maxLimit}</span>
                    </div>
                    <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                        className={`h-full rounded-full ${isFull ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate(`/students?batchId=${batch.id}`)}>
                      <Eye size={14} /> View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(batch)}><Edit3 size={14} /></Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(batch)}><Trash2 size={14} /></Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card hover={false} className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Batch</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Course</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Capacity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                  const isFull = batch.studentCount >= batch.maxLimit;
                  return (
                    <tr key={batch.id} className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary">{batch.name}</td>
                      <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">{batch.courseName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 sm:w-20 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isFull ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-text-muted whitespace-nowrap">{batch.studentCount}/{batch.maxLimit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><Badge status={isFull ? "closed" : batch.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/students?batchId=${batch.id}`)}><Eye size={14} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(batch)}><Edit3 size={14} /></Button>
                          <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(batch)}><Trash2 size={14} /></Button>
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
        <div className="space-y-4">
          <Input label="Batch Name" placeholder="e.g. Batch Lambda" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Course Name" placeholder="e.g. React Advanced" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          <Input label="Max Limit" type="number" placeholder="e.g. 30" value={form.maxLimit} onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create Batch</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={!!editBatch} onClose={() => setEditBatch(null)} title="Edit Batch">
        <div className="space-y-4">
          <Input label="Batch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Course Name" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          <Input label="Max Limit" type="number" value={form.maxLimit} onChange={(e) => setForm({ ...form, maxLimit: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditBatch(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Batch">
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete <strong className="text-text-primary">{deleteConfirm?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
