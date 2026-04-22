import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Image as ImageIcon, Video, FileArchive, File as FileIcon, 
  UploadCloud, Trash2, Eye, Download, Search, X 
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { batches as initialBatches, resources as initialResources } from "../data/mockData";

const getResourceIcon = (type) => {
  switch (type) {
    case 'pdf': return <FileText className="text-red-400" />;
    case 'image': return <ImageIcon className="text-blue-400" />;
    case 'video': return <Video className="text-purple-400" />;
    case 'zip': return <FileArchive className="text-amber-400" />;
    case 'pptx': return <FileText className="text-orange-400" />;
    default: return <FileIcon className="text-emerald-400" />;
  }
};

export default function Resources() {
  "use no memo";
  const [resourcesList, setResourcesList] = useState(initialResources);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const fileInputRef = useRef(null);

  const batchOptions = initialBatches.map(b => ({
    value: b.id,
    label: b.name,
    sublabel: b.courseName
  }));

  const filteredResources = useMemo(() => {
    let result = resourcesList;
    if (selectedBatchId) {
      result = result.filter(r => r.batchId === Number(selectedBatchId));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q));
    }
    return result;
  }, [resourcesList, selectedBatchId, searchQuery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadName(file.name);
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadFile || !selectedBatchId || !uploadName) return;

    // Determine type roughly from extension
    const ext = uploadName.split('.').pop().toLowerCase();
    let type = 'file';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) type = 'image';
    else if (['mp4', 'webm', 'mov'].includes(ext)) type = 'video';
    else if (['pdf'].includes(ext)) type = 'pdf';
    else if (['zip', 'rar'].includes(ext)) type = 'zip';
    else if (['ppt', 'pptx'].includes(ext)) type = 'pptx';

    // Simulate upload preview url if image
    let url = "#";
    if (type === 'image') {
      url = URL.createObjectURL(uploadFile);
    }

    const newResource = {
      id: Date.now(),
      batchId: Number(selectedBatchId),
      name: uploadName,
      type,
      size: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
      date: new Date().toISOString().split('T')[0],
      url,
    };

    setResourcesList(prev => [newResource, ...prev]);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadName("");
  };

  const handleDelete = (id) => {
    setResourcesList(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Course Resources</h1>
          <p className="text-sm text-text-muted mt-1 font-medium opacity-80">
            {resourcesList.length} files total · Upload and manage curriculum materials
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)} 
          size="md" 
          className="sm:w-auto w-full"
          disabled={!selectedBatchId && batchOptions.length > 0}
          title={!selectedBatchId ? "Please select a batch first" : ""}
        >
          <UploadCloud size={18} /> Upload Material
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 shrink-0">
          <Select
            label="Select Batch Context"
            value={selectedBatchId}
            onChange={setSelectedBatchId}
            options={[{ value: "", label: "All Batches" }, ...batchOptions]}
            placeholder="Filter by batch..."
            className="w-full"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1 mb-2 hidden md:block opacity-0">Search</label>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-surface border border-border focus-within:ring-4 focus-within:ring-primary/10 transition-all h-[54px]">
            <Search size={18} className="text-text-muted shrink-0" />
            <input 
              type="text" 
              placeholder="Search resource name..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/60 outline-none w-full font-bold" 
            />
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, i) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full flex flex-col group p-5 hover:border-primary/40 transition-all cursor-pointer" onClick={() => setPreviewResource(resource)}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">{resource.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-text-muted">
                      <span className="uppercase tracking-wider">{resource.type}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{resource.size}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted bg-surface-alt px-2.5 py-1 rounded-md">
                    {initialBatches.find(b => b.id === resource.batchId)?.name || "Unknown Batch"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10"
                        onClick={(e) => { e.stopPropagation(); setPreviewResource(resource); }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                        variant="danger" 
                        size="sm" 
                        className="p-2 rounded-xl"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(resource); }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredResources.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-alt rounded-3xl flex items-center justify-center text-text-muted mb-6">
            <FileArchive size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary">No resources found</h3>
          <p className="text-sm text-text-muted mt-2 max-w-sm">
            {selectedBatchId 
                ? "This batch doesn't have any uploaded materials yet." 
                : "No resources match your search criteria."}
          </p>
          {selectedBatchId && (
            <Button onClick={() => setShowUploadModal(true)} className="mt-6 rounded-xl">
              Upload First Resource
            </Button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => { setShowUploadModal(false); setUploadFile(null); setUploadName(""); }} title="Upload Resource">
        <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-4">
                <p className="text-xs text-primary font-bold">
                    Uploading to: {initialBatches.find(b => b.id === Number(selectedBatchId))?.name}
                </p>
            </div>

            {/* Drag & Drop Zone */}
            <div 
                className="border-2 border-dashed border-border hover:border-primary bg-surface-alt/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                />
                
                {uploadFile ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                            {uploadFile.type.startsWith('image/') ? <ImageIcon size={28} /> : <FileText size={28} />}
                        </div>
                        <p className="text-sm font-bold text-text-primary truncate max-w-[200px]">{uploadFile.name}</p>
                        <p className="text-xs text-text-muted mt-1">{(uploadFile.size / (1024*1024)).toFixed(2)} MB</p>
                        <button 
                            className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setUploadFile(null); setUploadName(""); }}
                        >
                            Remove File
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-3xl bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all mb-4 shadow-sm">
                            <UploadCloud size={28} />
                        </div>
                        <h4 className="text-sm font-bold text-text-primary">Click to upload or drag and drop</h4>
                        <p className="text-xs text-text-muted mt-2 max-w-[250px] leading-relaxed">
                            Support for Images, PDFs, Videos, PPTX, and ZIP files (Max 500MB).
                        </p>
                    </>
                )}
            </div>

            {uploadFile && (
                <div className="space-y-2">
                    <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">Display Name</label>
                    <input 
                        type="text" 
                        value={uploadName} 
                        onChange={(e) => setUploadName(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm font-bold text-text-primary outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button variant="ghost" className="rounded-xl" onClick={() => setShowUploadModal(false)}>Cancel</Button>
              <Button className="rounded-xl px-8" disabled={!uploadFile} onClick={handleUploadSubmit}>Upload Resource</Button>
            </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewResource} onClose={() => setPreviewResource(null)} title="Resource Preview" className="max-w-5xl z-[60]">
        {previewResource && (
            <div className="flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-6 p-4 rounded-2xl bg-surface-alt/50 border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center">
                            {getResourceIcon(previewResource.type)}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-text-primary">{previewResource.name}</h3>
                            <p className="text-[11px] text-text-muted font-medium mt-0.5">{previewResource.type.toUpperCase()} • {previewResource.size}</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="rounded-xl hidden sm:flex">
                        <Download size={16} /> Download
                    </Button>
                </div>

                <div className="w-full rounded-2xl bg-background border border-border overflow-hidden flex items-center justify-center min-h-[40vh] max-h-[60vh]">
                    {previewResource.type === 'image' && previewResource.url !== "#" ? (
                        <img src={previewResource.url} alt={previewResource.name} className="max-w-full max-h-[60vh] object-contain" />
                    ) : (
                        <div className="text-center p-10 opacity-50">
                            <div className="flex justify-center mb-4">
                                {getResourceIcon(previewResource.type)}
                            </div>
                            <p className="text-sm font-bold text-text-primary mb-2">Preview not available for this file type in demo mode.</p>
                            <p className="text-xs text-text-muted">Please download the file to view its contents.</p>
                        </div>
                    )}
                </div>

                <Button variant="secondary" className="rounded-xl sm:hidden w-full mt-4">
                    <Download size={16} /> Download File
                </Button>
            </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Deletion">
        <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-bold text-center leading-relaxed">
                    Are you sure you want to delete <strong className="text-red-500 underline underline-offset-4">{deleteConfirm?.name}</strong>?
                    <br />This action is permanent and cannot be undone.
                </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" className="rounded-xl" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" className="rounded-xl px-8 !bg-red-500 !text-white" onClick={() => handleDelete(deleteConfirm?.id)}>Delete File</Button>
            </div>
        </div>
      </Modal>

    </div>
  );
}
