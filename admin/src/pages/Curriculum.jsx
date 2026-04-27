import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, ChevronRight, Plus, Trash2, Edit2, 
  Layers, Bookmark, FileText, Save, File,
  ArrowLeft, GripVertical, FileEdit, GraduationCap
} from "lucide-react";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
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

import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import RichTextEditor from "../components/RichTextEditor";
import { subjects as initialSubjects } from "../data/mockData";

// Utility to convert the old rigid mock data into a flexible tree structure
const transformMockData = (items, defaultType = 'subject') => {
  if (!items) return [];
  return items.map(item => {
    const children = [];
    if (item.modules) children.push(...transformMockData(item.modules, 'module'));
    if (item.chapters) children.push(...transformMockData(item.chapters, 'chapter'));
    if (item.topics) children.push(...transformMockData(item.topics, 'topic'));
    
    return {
      id: item.id,
      type: item.type || defaultType,
      title: item.title,
      content: item.content || "",
      children: children
    };
  });
};

export default function Curriculum() {
  const [subjects, setSubjects] = useState(() => transformMockData(initialSubjects, 'subject'));
  const [expandedItems, setExpandedItems] = useState({});
  const [editingContent, setEditingContent] = useState(null); // { item, pathArr }
  
  // Modals
  const [showItemModal, setShowItemModal] = useState({ show: false, mode: 'add', parentPath: [], itemToEdit: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "", pathArr: [] });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allIds = {};
    const traverse = (items) => {
       items.forEach(i => {
          allIds[i.id] = true;
          if (i.children && i.children.length > 0) traverse(i.children);
       });
    };
    traverse(subjects);
    setExpandedItems(allIds);
  };

  const collapseAll = () => setExpandedItems({});

  const getListByPath = (currentSubjects, pathArr) => {
    if (pathArr.length === 0) return currentSubjects;
    let current = { children: currentSubjects };
    for (const p of pathArr) {
      current = current.children.find(i => i.id === p.id);
    }
    return current.children;
  };

  // Handle Drag Over (Cross-Container Dragging)
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;

    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      
      let activeContainerPath = null;
      let overContainerPath = null;
      let activeIndex = -1;
      let overIndex = -1;
      let activeItem = null;

      const traverse = (items, path) => {
         const aIdx = items.findIndex(i => i.id === activeId);
         if (aIdx !== -1) {
            activeContainerPath = path;
            activeIndex = aIdx;
            activeItem = items[aIdx];
         }
         const oIdx = items.findIndex(i => i.id === overId);
         if (oIdx !== -1) {
            overContainerPath = path;
            overIndex = oIdx;
         }
         items.forEach(item => {
            if (item.children) traverse(item.children, [...path, { id: item.id }]);
         });
      };
      traverse(newSubjects, []);

      if (!overContainerPath) {
         // Maybe hovered over an empty container (SortableContext id)
         const findContainerById = (items, path) => {
            if (overId === 'root') return { path, items };
            for (const item of items) {
               if (item.id === overId) return { path: [...path, { id: item.id }], items: item.children };
               if (item.children) {
                  const res = findContainerById(item.children, [...path, { id: item.id }]);
                  if (res) return res;
               }
            }
            return null;
         };
         const emptyContainer = findContainerById(newSubjects, []);
         if (emptyContainer) {
            overContainerPath = emptyContainer.path;
            overIndex = emptyContainer.items.length;
         }
      }

      if (!activeContainerPath || !overContainerPath) return newSubjects;

      const isSameContainer = JSON.stringify(activeContainerPath) === JSON.stringify(overContainerPath);
      if (isSameContainer) return newSubjects; // Let handleDragEnd deal with it

      // RESTRICTION: Do not allow dragging Root level items (Subjects) into children
      if (activeContainerPath.length === 0) return newSubjects; 

      // RESTRICTION: Do not allow dragging items OUT of their specific Subject (into root or another subject)
      if (overContainerPath.length === 0) return newSubjects;
      if (activeContainerPath[0].id !== overContainerPath[0].id) return newSubjects;

      // NEW RESTRICTION: Do not allow dragging items into a container of the same type
      const overContainerType = overContainerPath[overContainerPath.length - 1].type;
      if (activeItem.type === overContainerType) return newSubjects;

      // Safe to move across containers!
      const activeList = getListByPath(newSubjects, activeContainerPath);
      const overList = getListByPath(newSubjects, overContainerPath);

      activeList.splice(activeIndex, 1);
      
      const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      
      overList.splice(overIndex >= 0 ? overIndex + modifier : overList.length, 0, activeItem);
      
      return newSubjects;
    });
  };

  // Handle Drag End (Finalizing Reorder)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      
      let activeContainerPath = null;
      const traverse = (items, path) => {
         const aIdx = items.findIndex(i => i.id === active.id);
         if (aIdx !== -1) { activeContainerPath = path; }
         items.forEach(item => {
            if (item.children) traverse(item.children, [...path, { id: item.id }]);
         });
      };
      traverse(newSubjects, []);

      if (!activeContainerPath) return newSubjects;

      const list = getListByPath(newSubjects, activeContainerPath);
      const oldIndex = list.findIndex(i => i.id === active.id);
      const newIndex = list.findIndex(i => i.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(list, oldIndex, newIndex);
        if (activeContainerPath.length === 0) {
           return reordered;
        } else {
           let current = { children: newSubjects };
           for (const p of activeContainerPath) {
             current = current.children.find(i => i.id === p.id);
           }
           current.children = reordered;
        }
      }
      return newSubjects;
    });
  };

  const handleSaveItem = (title, type) => {
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      const { mode, parentPath, itemToEdit } = showItemModal;
      
      const list = getListByPath(newSubjects, parentPath);
      
      if (mode === 'edit') {
        const idx = list.findIndex(i => i.id === itemToEdit.id);
        if (idx !== -1) list[idx].title = title;
      } else {
        const newItem = { id: `id-${Date.now()}`, type: type || 'topic', title, content: "", children: [] };
        list.push(newItem);
        if (parentPath.length > 0) {
           const parentId = parentPath[parentPath.length - 1].id;
           setExpandedItems(e => ({ ...e, [parentId]: true }));
        }
      }
      return newSubjects;
    });
    setShowItemModal({ show: false, mode: 'add', parentPath: [], itemToEdit: null });
  };

  const handleDeleteItem = () => {
    const { id, pathArr } = deleteConfirm;
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      const parentPath = pathArr.slice(0, -1);
      
      if (parentPath.length === 0) {
        return newSubjects.filter(s => s.id !== id);
      } else {
        let current = { children: newSubjects };
        for (const p of parentPath) {
          current = current.children.find(i => i.id === p.id);
        }
        current.children = current.children.filter(i => i.id !== id);
      }
      return newSubjects;
    });
    setDeleteConfirm({ show: false, id: null, title: "", pathArr: [] });
  };

  const handleUpdateContent = (newContent) => {
    if (!editingContent) return;
    setSubjects(prev => {
      const newSubjects = JSON.parse(JSON.stringify(prev));
      const targetPath = editingContent.pathArr;
      const parentPath = targetPath.slice(0, -1);
      const list = getListByPath(newSubjects, parentPath);
      const last = targetPath[targetPath.length - 1];
      const idx = list.findIndex(i => i.id === last.id);
      if (idx !== -1) list[idx].content = newContent;
      return newSubjects;
    });
  };

  const getEditingContentText = () => {
    if (!editingContent) return "";
    const targetPath = editingContent.pathArr;
    const parentPath = targetPath.slice(0, -1);
    const list = getListByPath(subjects, parentPath);
    const last = targetPath[targetPath.length - 1];
    const target = list?.find(i => i.id === last.id);
    return target?.content || "";
  };

  // ----- Recursive Tree Renderer -----
  const renderTree = (items, parentPath) => {
    const parentId = parentPath.length > 0 ? parentPath[parentPath.length - 1].id : 'root';

    if (!items || items.length === 0) {
       return (
         <SortableContext items={[]} id={parentId} strategy={verticalListSortingStrategy}>
           <EmptyDropZone id={parentId} onAdd={() => setShowItemModal({ show: true, mode: 'add', parentPath, itemToEdit: null })} />
         </SortableContext>
       );
    }
    
    return (
      <div className={parentPath.length > 0 ? "p-2 sm:p-4" : "space-y-6"}>
        <SortableContext items={items.map(i => i.id)} id={parentId} strategy={verticalListSortingStrategy}>
          <div className={parentPath.length === 0 ? "space-y-6" : "space-y-3 min-h-[40px]"}>
            {items.map(item => {
              const currentPath = [...parentPath, { id: item.id, type: item.type, title: item.title }];
              return (
                <CurriculumNode
                  key={item.id} id={item.id} item={item} type={item.type} 
                  expanded={expandedItems[item.id]} onToggle={() => toggleExpand(item.id)}
                  onAdd={() => setShowItemModal({ show: true, mode: 'add', parentPath: currentPath, itemToEdit: null })}
                  onEdit={() => setShowItemModal({ show: true, mode: 'edit', parentPath, itemToEdit: item })}
                  onDelete={() => setDeleteConfirm({ show: true, id: item.id, title: item.title, pathArr: currentPath })}
                  onEditContent={() => setEditingContent({ item, pathArr: currentPath })}
                  isTopLevel={parentPath.length === 0}
                >
                  {renderTree(item.children, currentPath)}
                </CurriculumNode>
              )
            })}
            {parentPath.length > 0 && (
              <button 
                className="w-full mt-2 py-3 border border-dashed border-border/80 text-text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all font-semibold text-sm flex items-center justify-center cursor-pointer shadow-sm"
                onClick={() => setShowItemModal({ show: true, mode: 'add', parentPath, itemToEdit: null })}
              >
                <Plus size={16} className="mr-2"/> Add Item Inside
              </button>
            )}
          </div>
        </SortableContext>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full w-full max-w-6xl mx-auto pb-10">
      
      {/* Header Actions */}
      <div className="bg-surface/50 backdrop-blur-md border border-border/60 rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Book size={24}/></div> 
            Course Builder
          </h1>
          <p className="text-sm text-text-muted font-medium mt-2 leading-relaxed max-w-xl">
            Visually manage your curriculum. Nest modules, chapters, or topics freely inside each other, drag to reorder, and edit content dynamically.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
           <Button variant="ghost" onClick={expandAll} className="hidden md:flex border border-transparent hover:border-border shadow-sm">Expand All</Button>
           <Button variant="ghost" onClick={collapseAll} className="hidden md:flex border border-transparent hover:border-border shadow-sm">Collapse All</Button>
           <Button onClick={() => setShowItemModal({ show: true, mode: 'add', parentPath: [], itemToEdit: null })} className="shadow-lg shadow-primary/20 w-full sm:w-auto py-2.5">
              <Plus size={18} className="mr-2"/> Add Root Item
           </Button>
        </div>
      </div>

      {/* Main Builder Area with Single DndContext wrapping everything */}
      <div className="flex-1">
         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
           {subjects.length === 0 ? (
             <div className="py-24 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 rounded-3xl bg-surface-alt flex items-center justify-center text-text-muted mb-6 border border-border/50 shadow-inner">
                 <GraduationCap size={48} />
               </div>
               <h3 className="text-2xl font-bold text-text-primary">Curriculum is Empty</h3>
               <p className="text-base text-text-muted mt-2 max-w-md font-medium leading-relaxed">Start building your flexible course structure by adding your first item.</p>
               <Button onClick={() => setShowItemModal({ show: true, mode: 'add', parentPath: [], itemToEdit: null })} className="mt-8 shadow-xl shadow-primary/25">
                 <Plus size={20} className="mr-2"/> Add First Item
               </Button>
             </div>
           ) : (
             renderTree(subjects, [])
           )}
         </DndContext>
      </div>

      {/* Content Editor Full Screen Modal */}
      <AnimatePresence>
        {editingContent && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            <div className="h-16 sm:h-20 border-b border-border flex items-center justify-between px-4 sm:px-8 shrink-0 bg-surface/90 backdrop-blur-xl shadow-sm">
               <div className="flex items-center gap-3 sm:gap-4">
                 <button onClick={() => setEditingContent(null)} className="p-2 sm:p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt hover:border-primary/30 text-text-muted hover:text-primary transition-all group shadow-sm cursor-pointer">
                   <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                 </button>
                 <div>
                   <h3 className="font-bold text-text-primary text-sm sm:text-lg flex items-center gap-2">
                     Editing <span className="text-primary truncate max-w-[150px] sm:max-w-xl">{editingContent.item.title}</span>
                   </h3>
                   <p className="text-[10px] sm:text-xs text-text-muted font-medium hidden sm:block">Changes are auto-saved in your current session.</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 sm:gap-3">
                 <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[11px] font-black uppercase tracking-wider">Live Preview Active</span>
                 </div>
                 <Button onClick={() => setEditingContent(null)} className="shadow-lg shadow-primary/20 px-4 sm:px-6">
                   <Save size={18} className="mr-2 hidden sm:block" /> Done Editing
                 </Button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background/50 custom-scrollbar flex justify-center">
               <div className="w-full max-w-5xl bg-surface rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden flex flex-col min-h-full">
                  <RichTextEditor 
                    value={getEditingContentText()} 
                    onChange={handleUpdateContent}
                    placeholder={`Write comprehensive content for ${editingContent.item.title}...`}
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name/Title Modal */}
      <Modal 
        isOpen={showItemModal.show} 
        onClose={() => setShowItemModal({ show: false, mode: 'add', parentPath: [], itemToEdit: null })}
        title={showItemModal.mode === 'edit' ? `Rename Item` : `New Item`}
        className="max-w-md"
      >
        <div className="space-y-6">
          <Input 
            label="Title" 
            placeholder="e.g., Introduction"
            autoFocus
            defaultValue={showItemModal.itemToEdit?.title || ""}
            id="item-title-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                 const title = e.target.value;
                 const typeSelect = document.getElementById("item-type-select");
                 const type = showItemModal.mode === 'add' && typeSelect ? typeSelect.value : null;
                 if (title.trim()) handleSaveItem(title, type);
              }
            }}
          />
          {showItemModal.mode === 'add' && (
            <div>
               <label className="block text-sm font-semibold text-text-primary mb-2">Item Type</label>
               <select 
                 id="item-type-select" 
                 className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-text-primary transition-all cursor-pointer shadow-sm appearance-none"
               >
                 {(() => {
                   const parentType = showItemModal.parentPath.length > 0 
                     ? showItemModal.parentPath[showItemModal.parentPath.length - 1].type 
                     : null;
                   return (
                     <>
                       {parentType !== 'module' && <option value="module">Module</option>}
                       {parentType !== 'chapter' && <option value="chapter">Chapter</option>}
                       {parentType !== 'topic' && <option value="topic">Topic</option>}
                     </>
                   )
                 })()}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted mt-[30px]">
                  <ChevronRight size={16} className="rotate-90" />
               </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowItemModal({ show: false, mode: 'add', parentPath: [], itemToEdit: null })}>Cancel</Button>
            <Button onClick={() => {
              const title = document.getElementById("item-title-input").value;
              const typeSelect = document.getElementById("item-type-select");
              const type = showItemModal.mode === 'add' && typeSelect ? typeSelect.value : null;
              if (title.trim()) handleSaveItem(title, type);
            }}>
              {showItemModal.mode === 'edit' ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirm.show} onClose={() => setDeleteConfirm({ show: false, id: null, title: "", pathArr: [] })} title={`Delete Item`} className="max-w-md">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h4 className="text-xl font-bold text-text-primary">Delete Permanently?</h4>
            <p className="text-sm text-text-muted mt-2 leading-relaxed font-medium">
              You are about to delete <strong className="text-red-500">{deleteConfirm.title}</strong>.
              This action will permanently remove it and all of its nested content. This cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm({ show: false, id: null, title: "", pathArr: [] })}>Cancel</Button>
            <Button variant="danger" className="!bg-red-500 shadow-lg shadow-red-500/20" onClick={handleDeleteItem}>Delete Item</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CurriculumNode({ 
  id, item, type, expanded, onToggle, onAdd, onEdit, onDelete, onEditContent,
  children, isTopLevel 
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  // Add z-index to style when dragging so it stays above other elements
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition, 
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1
  };

  const getTypeConfig = (t) => {
    switch (t?.toLowerCase()) {
      case 'subject': return { icon: Book, colorClass: "bg-primary/10 text-primary" };
      case 'module': return { icon: Layers, colorClass: "bg-emerald-500/10 text-emerald-500" };
      case 'chapter': return { icon: Bookmark, colorClass: "bg-orange-500/10 text-orange-500" };
      case 'topic': return { icon: FileText, colorClass: "bg-purple-500/10 text-purple-500" };
      default: return { icon: File, colorClass: "bg-blue-500/10 text-blue-500" };
    }
  };

  const { icon: Icon, colorClass } = getTypeConfig(type);
  const hasChildren = item.children && item.children.length > 0;
  const hasContent = item.content && item.content.trim() !== '' && item.content !== '<p><br></p>';

  return (
    <div ref={setNodeRef} style={style} className={`rounded-2xl border ${isTopLevel ? 'shadow-md border-border/80' : 'shadow-sm border-border/50'} ${isDragging ? 'border-primary shadow-2xl ring-4 ring-primary/20 bg-surface' : 'bg-surface hover:border-border transition-colors'} overflow-hidden relative`}>
      <div className={`flex items-center justify-between p-3 sm:p-4 group ${expanded && hasChildren ? 'border-b border-border/40 bg-surface-alt/30' : 'hover:bg-surface-alt/10'} transition-colors gap-2 sm:gap-4`}>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button {...attributes} {...listeners} className="p-1.5 sm:p-2.5 text-text-muted/60 hover:text-primary cursor-grab active:cursor-grabbing hover:bg-surface-alt rounded-xl transition-colors shrink-0" title="Drag to reorder">
            <GripVertical size={18} />
          </button>
          
          <button 
            onClick={onToggle} 
            className={`p-1.5 sm:p-2 text-text-muted hover:text-primary hover:bg-surface-alt rounded-xl transition-all ${expanded ? 'rotate-90 bg-primary/10 text-primary' : ''} shrink-0 cursor-pointer ${!hasChildren ? 'opacity-40 hover:opacity-100' : ''}`} 
            title={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight size={18} />
          </button>
          
          <div className={`p-2.5 rounded-xl ${colorClass} shrink-0 shadow-inner hidden xs:flex`}>
            <Icon size={20} />
          </div>
          
          <span className="font-bold text-text-primary text-sm sm:text-lg truncate select-none leading-tight">{item.title}</span>
          
          <span className="text-[9px] sm:text-[10px] font-black text-text-muted bg-background border border-border/60 px-2 py-0.5 rounded-md hidden md:inline-block uppercase tracking-widest shrink-0 ml-2 shadow-sm">
            {type}
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {onAdd && (
            <Button variant="ghost" size="sm" onClick={onAdd} className="h-9 px-2 sm:px-3 text-xs border border-transparent hover:border-border hidden md:flex">
              <Plus size={14} className="md:mr-1.5" /> <span className="hidden xl:inline">Add Inside</span>
            </Button>
          )}
          {onEditContent && (
            <Button variant="ghost" size="sm" onClick={onEditContent} className={`h-9 px-2 sm:px-3 text-xs border border-transparent shadow-sm ${hasContent ? 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500/20' : 'text-primary hover:text-primary hover:bg-primary/10 hover:border-primary/20'}`}>
              <FileEdit size={14} className="sm:mr-1.5" /> <span className="hidden md:inline">{hasContent ? "Edit Content" : "Add Content"}</span>
            </Button>
          )}
          <div className="w-px h-6 bg-border/60 mx-1 hidden sm:block" />
          <button onClick={onEdit} className="p-2 sm:p-2.5 text-text-muted hover:text-primary rounded-xl hover:bg-surface-alt border border-transparent hover:border-border transition-all cursor-pointer shadow-sm" title="Rename">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 sm:p-2.5 text-text-muted hover:text-red-500 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer shadow-sm" title="Delete">
            <Trash2 size={16} />
          </button>
          
          {/* Mobile specific minimal Add button */}
          {onAdd && (
             <button onClick={onAdd} className="p-2 text-text-muted hover:text-primary rounded-xl hover:bg-surface-alt transition-colors md:hidden border border-transparent hover:border-border cursor-pointer shadow-sm ml-1" title={`Add Item`}>
                <Plus size={18} />
             </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-background/40 border-t border-border/30">
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyDropZone({ id, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={`p-4 sm:p-6 text-center border-2 border-dashed rounded-2xl m-2 sm:m-4 shadow-sm min-h-[100px] flex flex-col justify-center items-center transition-colors ${isOver ? 'border-primary bg-primary/10' : 'border-border/60 bg-surface/30'}`}
    >
       <p className="text-sm text-text-primary font-bold mb-3">{isOver ? 'Drop items here to nest them' : 'No content added yet'}</p>
       <Button size="sm" variant="ghost" onClick={onAdd} className="border border-border/50 bg-surface shadow-sm hover:border-primary/50 pointer-events-auto">
         <Plus size={16} className="mr-2"/> Add Content
       </Button>
    </div>
  );
}
