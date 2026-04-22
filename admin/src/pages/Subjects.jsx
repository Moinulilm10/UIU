import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, ChevronRight, Plus, Trash2, Edit2, 
  Layers, Bookmark, FileText, Search, Save,
  MoreVertical, ChevronDown, Folder, File,
  ArrowLeft, GripVertical
} from "lucide-react";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import RichTextEditor from "../components/RichTextEditor";
import { subjects as initialSubjects } from "../data/mockData";

export default function Subjects() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [selectedPath, setSelectedPath] = useState({ subjectId: null, moduleId: null, chapterId: null, topicId: null });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [showItemModal, setShowItemModal] = useState({ show: false, type: "", parent: null, item: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: "", id: null, title: "" });

  // UI state
  const [expandedItems, setExpandedItems] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSelectedItem = () => {
    if (!selectedPath.subjectId) return null;
    const subject = subjects.find(s => s.id === selectedPath.subjectId);
    if (!subject) return null;
    if (!selectedPath.moduleId) return { item: subject, type: "subject" };
    
    const module = subject.modules.find(m => m.id === selectedPath.moduleId);
    if (!module) return null;
    if (!selectedPath.chapterId) return { item: module, type: "module" };
    
    const chapter = module.chapters.find(c => c.id === selectedPath.chapterId);
    if (!chapter) return null;
    if (!selectedPath.topicId) return { item: chapter, type: "chapter" };
    
    const topic = chapter.topics.find(t => t.id === selectedPath.topicId);
    if (!topic) return null;
    return { item: topic, type: "topic" };
  };

  const selected = getSelectedItem();

  const handleUpdateContent = (newContent) => {
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      const { subjectId, moduleId, chapterId, topicId } = selectedPath;
      
      const sIdx = newSubjects.findIndex(s => s.id === subjectId);
      if (sIdx === -1) return prev;

      if (selected.type === "subject") {
        newSubjects[sIdx].content = newContent;
      } else if (selected.type === "module") {
        const mIdx = newSubjects[sIdx].modules?.findIndex(m => m.id === moduleId);
        if (mIdx !== -1 && mIdx !== undefined) newSubjects[sIdx].modules[mIdx].content = newContent;
      } else if (selected.type === "chapter") {
        const mIdx = newSubjects[sIdx].modules?.findIndex(m => m.id === moduleId);
        const cIdx = newSubjects[sIdx].modules?.[mIdx]?.chapters?.findIndex(c => c.id === chapterId);
        if (cIdx !== -1 && cIdx !== undefined) newSubjects[sIdx].modules[mIdx].chapters[cIdx].content = newContent;
      } else if (selected.type === "topic") {
        const mIdx = newSubjects[sIdx].modules?.findIndex(m => m.id === moduleId);
        const cIdx = newSubjects[sIdx].modules?.[mIdx]?.chapters?.findIndex(c => c.id === chapterId);
        const tIdx = newSubjects[sIdx].modules?.[mIdx]?.chapters?.[cIdx]?.topics?.findIndex(t => t.id === topicId);
        if (tIdx !== -1 && tIdx !== undefined) newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics[tIdx].content = newContent;
      }

      return newSubjects;
    });
  };

  const handleAddItem = (type, parent = null) => {
    setShowItemModal({ show: true, type, parent, item: null });
  };

  const handleEditItem = (type, item) => {
    setShowItemModal({ show: true, type, parent: null, item });
  };

  const findPathToItem = (subjects, itemId, type) => {
    for (const s of subjects) {
      if (type === "subject" && s.id === itemId) return { sIdx: subjects.indexOf(s) };
      if (s.modules) {
        for (const m of s.modules) {
          if (type === "module" && m.id === itemId) return { sIdx: subjects.indexOf(s), mIdx: s.modules.indexOf(m) };
          if (m.chapters) {
            for (const c of m.chapters) {
              if (type === "chapter" && c.id === itemId) return { sIdx: subjects.indexOf(s), mIdx: s.modules.indexOf(m), cIdx: m.chapters.indexOf(c) };
              if (c.topics) {
                for (const t of c.topics) {
                  if (type === "topic" && t.id === itemId) return { sIdx: subjects.indexOf(s), mIdx: s.modules.indexOf(m), cIdx: m.chapters.indexOf(c), tIdx: c.topics.indexOf(t) };
                }
              }
            }
          }
        }
      }
    }
    return null;
  };

  const saveItem = (title) => {
    const { type, parent, item } = showItemModal;
    
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      
      if (item) { // Edit
        const path = findPathToItem(newSubjects, item.id, type);
        if (!path) return prev;
        const { sIdx, mIdx, cIdx, tIdx } = path;

        if (type === "subject") newSubjects[sIdx].title = title;
        else if (type === "module") newSubjects[sIdx].modules[mIdx].title = title;
        else if (type === "chapter") newSubjects[sIdx].modules[mIdx].chapters[cIdx].title = title;
        else if (type === "topic") newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics[tIdx].title = title;
      } else { // Add
        const newItem = { id: `id-${Date.now()}`, title, content: "", modules: [], chapters: [], topics: [] };
        if (type === "subject") {
          newSubjects.push(newItem);
        } else if (type === "module") {
          const sIdx = newSubjects.findIndex(s => s.id === parent.id);
          if (sIdx !== -1) newSubjects[sIdx].modules.push(newItem);
        } else if (type === "chapter") {
          const path = findPathToItem(newSubjects, parent.id, "module");
          if (path) {
            newSubjects[path.sIdx].modules[path.mIdx].chapters.push(newItem);
          }
        } else if (type === "topic") {
          const path = findPathToItem(newSubjects, parent.id, "chapter");
          if (path) {
            newSubjects[path.sIdx].modules[path.mIdx].chapters[path.cIdx].topics.push(newItem);
          }
        }
      }
      return newSubjects;
    });
    setShowItemModal({ show: false, type: "", parent: null, item: null });
  };

  const confirmDelete = (type, id, title) => {
    setDeleteConfirm({ show: true, type, id, title });
  };

  const handleDelete = () => {
    const { type, id } = deleteConfirm;
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      const path = findPathToItem(newSubjects, id, type);
      if (!path) return prev;
      const { sIdx, mIdx, cIdx, tIdx } = path;

      if (type === "subject") {
        return newSubjects.filter(s => s.id !== id);
      } else if (type === "module") {
        newSubjects[sIdx].modules.splice(mIdx, 1);
      } else if (type === "chapter") {
        newSubjects[sIdx].modules[mIdx].chapters.splice(cIdx, 1);
      } else if (type === "topic") {
        newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics.splice(tIdx, 1);
      }
      return newSubjects;
    });
    setSelectedPath({ subjectId: null, moduleId: null, chapterId: null, topicId: null });
    setDeleteConfirm({ show: false, type: "", id: null, title: "" });
  };

  const handleDragEnd = (event, type, parentId = null) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      if (type === "subject") {
        const oldIndex = newSubjects.findIndex(s => s.id === active.id);
        const newIndex = newSubjects.findIndex(s => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) return arrayMove(newSubjects, oldIndex, newIndex);
      } else if (type === "module") {
        const path = findPathToItem(newSubjects, active.id, "module");
        if (path) {
          const { sIdx } = path;
          const oldIndex = newSubjects[sIdx].modules.findIndex(m => m.id === active.id);
          const newIndex = newSubjects[sIdx].modules.findIndex(m => m.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            newSubjects[sIdx].modules = arrayMove(newSubjects[sIdx].modules, oldIndex, newIndex);
          }
        }
      } else if (type === "chapter") {
        const path = findPathToItem(newSubjects, active.id, "chapter");
        if (path) {
          const { sIdx, mIdx } = path;
          const oldIndex = newSubjects[sIdx].modules[mIdx].chapters.findIndex(c => c.id === active.id);
          const newIndex = newSubjects[sIdx].modules[mIdx].chapters.findIndex(c => c.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            newSubjects[sIdx].modules[mIdx].chapters = arrayMove(newSubjects[sIdx].modules[mIdx].chapters, oldIndex, newIndex);
          }
        }
      } else if (type === "topic") {
        const path = findPathToItem(newSubjects, active.id, "topic");
        if (path) {
          const { sIdx, mIdx, cIdx } = path;
          const oldIndex = newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics.findIndex(t => t.id === active.id);
          const newIndex = newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics.findIndex(t => t.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1) {
            newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics = arrayMove(newSubjects[sIdx].modules[mIdx].chapters[cIdx].topics, oldIndex, newIndex);
          }
        }
      }
      return newSubjects;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6">
      {/* Hierarchy Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Curriculum</h2>
          <Button size="sm" variant="ghost" className="p-2 rounded-xl" onClick={() => handleAddItem("subject")}>
            <Plus size={18} />
          </Button>
        </div>

        <div className="bg-surface/30 p-1.5 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface border border-border">
            <Search size={14} className="text-text-muted" />
            <input 
              type="text" 
              placeholder="Filter curriculum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-text-primary placeholder:text-text-muted/60 outline-none w-full font-bold"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={(e) => handleDragEnd(e, "subject")}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={subjects.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {subjects.map(subject => (
                <div key={subject.id} className="space-y-1">
                  <SortableTreeItem 
                    id={subject.id}
                    label={subject.title} 
                    icon={<Book size={16} />} 
                    active={selectedPath.subjectId === subject.id && !selectedPath.moduleId}
                    expanded={expandedItems[subject.id]}
                    onToggle={() => toggleExpand(subject.id)}
                    onClick={() => setSelectedPath({ subjectId: subject.id, moduleId: null, chapterId: null, topicId: null })}
                    onAdd={() => handleAddItem("module", subject)}
                    onEdit={() => handleEditItem("subject", subject)}
                    onDelete={() => confirmDelete("subject", subject.id, subject.title)}
                    level={0}
                  />
                  
                  <AnimatePresence>
                    {expandedItems[subject.id] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1"
                      >
                        <DndContext 
                          sensors={sensors} 
                          collisionDetection={closestCenter} 
                          onDragEnd={(e) => handleDragEnd(e, "module")}
                          modifiers={[restrictToVerticalAxis]}
                        >
                          <SortableContext items={subject.modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                            {subject.modules.map(module => (
                              <div key={module.id} className="space-y-1">
                                <SortableTreeItem 
                                  id={module.id}
                                  label={module.title} 
                                  icon={<Layers size={14} />} 
                                  active={selectedPath.moduleId === module.id && !selectedPath.chapterId}
                                  expanded={expandedItems[module.id]}
                                  onToggle={() => toggleExpand(module.id)}
                                  onClick={() => setSelectedPath({ subjectId: subject.id, moduleId: module.id, chapterId: null, topicId: null })}
                                  onAdd={() => handleAddItem("chapter", module)}
                                  onEdit={() => handleEditItem("module", module)}
                                  onDelete={() => confirmDelete("module", module.id, module.title)}
                                  level={1}
                                />

                                {expandedItems[module.id] && (
                                  <div className="space-y-1">
                                    <DndContext 
                                      sensors={sensors} 
                                      collisionDetection={closestCenter} 
                                      onDragEnd={(e) => handleDragEnd(e, "chapter", module.id)}
                                      modifiers={[restrictToVerticalAxis]}
                                    >
                                      <SortableContext items={module.chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                        {module.chapters.map(chapter => (
                                          <div key={chapter.id} className="space-y-1">
                                            <SortableTreeItem 
                                              id={chapter.id}
                                              label={chapter.title} 
                                              icon={<Bookmark size={14} />} 
                                              active={selectedPath.chapterId === chapter.id && !selectedPath.topicId}
                                              expanded={expandedItems[chapter.id]}
                                              onToggle={() => toggleExpand(chapter.id)}
                                              onClick={() => setSelectedPath({ subjectId: subject.id, moduleId: module.id, chapterId: chapter.id, topicId: null })}
                                              onAdd={() => handleAddItem("topic", chapter)}
                                              onEdit={() => handleEditItem("chapter", chapter)}
                                              onDelete={() => confirmDelete("chapter", chapter.id, chapter.title)}
                                              level={2}
                                            />

                                            {expandedItems[chapter.id] && (
                                              <div className="space-y-1">
                                                <DndContext 
                                                  sensors={sensors} 
                                                  collisionDetection={closestCenter} 
                                                  onDragEnd={(e) => handleDragEnd(e, "topic", chapter.id)}
                                                  modifiers={[restrictToVerticalAxis]}
                                                >
                                                  <SortableContext items={chapter.topics.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                                    {chapter.topics.map(topic => (
                                                      <SortableTreeItem 
                                                        key={topic.id}
                                                        id={topic.id}
                                                        label={topic.title} 
                                                        icon={<FileText size={14} />} 
                                                        active={selectedPath.topicId === topic.id}
                                                        onClick={() => setSelectedPath({ subjectId: subject.id, moduleId: module.id, chapterId: chapter.id, topicId: topic.id })}
                                                        onEdit={() => handleEditItem("topic", topic)}
                                                        onDelete={() => confirmDelete("topic", topic.id, topic.title)}
                                                        level={3}
                                                      />
                                                    ))}
                                                  </SortableContext>
                                                </DndContext>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </SortableContext>
                                    </DndContext>
                                  </div>
                                )}
                              </div>
                            ))}
                          </SortableContext>
                        </DndContext>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={`${selected.type}-${selected.item.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    selected.type === "subject" ? "bg-primary/10 text-primary" : 
                    selected.type === "module" ? "bg-emerald-500/10 text-emerald-500" :
                    selected.type === "chapter" ? "bg-orange-500/10 text-orange-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {selected.type === "subject" ? <Book size={20} /> : 
                     selected.type === "module" ? <Layers size={20} /> :
                     selected.type === "chapter" ? <Bookmark size={20} /> :
                     <FileText size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-text-muted opacity-60">{selected.type}</span>
                      <ChevronRight size={10} className="text-text-muted" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">{selected.item.title}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">{selected.item.title}</h1>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" onClick={() => handleEditItem(selected.type, selected.item)}>
                     <Edit2 size={16} className="mr-2" /> Rename
                   </Button>
                </div>
              </div>

              <Card className="flex-1 flex flex-col p-0 overflow-hidden border-border/40">
                <div className="p-4 bg-surface-alt/30 border-b border-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary">Editor</span>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-tighter">Live Preview</span>
                     </div>
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <RichTextEditor 
                    value={selected.item.content || ""} 
                    onChange={handleUpdateContent}
                    placeholder={`Write content for ${selected.item.title}...`}
                  />
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-surface-alt flex items-center justify-center text-text-muted mb-6 shadow-inner border border-border/50">
                <Folder size={48} />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Curriculum Dashboard</h2>
              <p className="text-sm text-text-muted max-w-sm font-medium leading-relaxed">
                Select a subject, module, or topic from the hierarchy to view and manage its content.
              </p>
              <div className="mt-8 flex gap-4">
                <Button onClick={() => handleAddItem("subject")}>Create New Subject</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name/Title Modal */}
      <Modal 
        isOpen={showItemModal.show} 
        onClose={() => setShowItemModal({ show: false, type: "", parent: null, item: null })}
        title={showItemModal.item ? `Rename ${showItemModal.type}` : `New ${showItemModal.type}`}
        className="max-w-md"
      >
        <div className="space-y-6">
          <Input 
            label={`${showItemModal.type} Title`} 
            placeholder={`Enter ${showItemModal.type} name...`}
            autoFocus
            defaultValue={showItemModal.item?.title || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveItem(e.target.value);
            }}
            id="item-title-input"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowItemModal({ show: false, type: "", parent: null, item: null })}>Cancel</Button>
            <Button onClick={() => {
              const val = document.getElementById("item-title-input").value;
              saveItem(val);
            }}>
              {showItemModal.item ? "Update Title" : "Create Item"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteConfirm.show} onClose={() => setDeleteConfirm({ show: false, type: "", id: null, title: "" })} title={`Delete ${deleteConfirm.type}`} className="max-w-md">
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h4 className="text-lg font-bold text-text-primary">Permanently Delete?</h4>
            <p className="text-sm text-text-muted mt-2 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-red-500">{deleteConfirm.title}</strong>? 
              This will also remove all nested content within this {deleteConfirm.type}.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm({ show: false, type: "", id: null, title: "" })}>Cancel</Button>
            <Button variant="danger" className="!bg-red-500" onClick={handleDelete}>Delete Permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SortableTreeItem({ id, label, icon, active, expanded, onToggle, onClick, onAdd, onEdit, onDelete, level }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 p-2 rounded-xl transition-all cursor-pointer border ${
        active ? "bg-primary/10 border-primary/20 text-primary" : "hover:bg-surface-alt/50 border-transparent text-text-secondary"
      } ${isDragging ? "shadow-2xl ring-2 ring-primary/50" : ""}`}
      style={{ ...style, marginLeft: `${level * 16}px` }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button 
          {...attributes}
          {...listeners}
          className="p-1 rounded-md text-text-muted/40 hover:text-primary cursor-grab active:cursor-grabbing shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          className={`p-1 rounded-md transition-transform cursor-pointer ${expanded ? "rotate-90" : ""} ${onToggle ? "visible" : "invisible"}`}
        >
          <ChevronRight size={14} className="text-text-muted" />
        </button>
        <div className={`${active ? "text-primary" : "text-text-muted"}`}>{icon}</div>
        <span className="text-xs font-bold truncate">{label}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
        {onAdd && (
          <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
            <Plus size={14} />
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
          <Edit2 size={12} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-red-500/50 cursor-pointer">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
