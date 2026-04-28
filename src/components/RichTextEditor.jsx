import { useRef, useEffect, useState } from "react";
import { 
  Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Link as LinkIcon, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Video, Paperclip
} from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder = "Start typing..." }) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  
  const [savedRange, setSavedRange] = useState(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    } else {
      editorRef.current?.focus();
    }
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    restoreSelection();

    let html = "";
    if (type === 'image') {
      html = `<img src="${url}" alt="${file.name}" style="max-width: 100%; border-radius: 8px; margin: 10px 0; display: block;" /><p><br></p>`;
    } else if (type === 'video') {
      html = `<div style="margin: 10px 0;"><video controls src="${url}" style="max-width: 100%; border-radius: 8px;"></video></div><p><br></p>`;
    } else if (type === 'document') {
      // Create a nice looking pill/link for the document
      html = `<a href="${url}" download="${file.name}" style="display: inline-flex; align-items: center; padding: 10px 16px; background-color: rgba(var(--color-primary), 0.1); color: rgb(var(--color-primary)); border: 1px solid rgba(var(--color-primary), 0.2); border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 8px 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">📎 Download ${file.name}</a>&nbsp;`;
    }

    document.execCommand("insertHTML", false, html);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    
    e.target.value = null; // reset the input so same file can be uploaded again if needed
  };

  return (
    <div className="w-full border border-border rounded-2xl overflow-hidden bg-surface group focus-within:ring-4 focus-within:ring-primary/10 transition-all flex flex-col h-full">
      {/* Hidden File Inputs */}
      <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
      <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
      <input type="file" ref={docInputRef} accept="*/*" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-alt/50 border-b border-border/50 shrink-0">
        <ToolbarButton onClick={() => execCommand("bold")} icon={<Bold size={16} />} title="Bold" />
        <ToolbarButton onClick={() => execCommand("italic")} icon={<Italic size={16} />} title="Italic" />
        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        
        <ToolbarButton onClick={() => execCommand("formatBlock", "h1")} icon={<Heading1 size={16} />} title="Heading 1" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "h2")} icon={<Heading2 size={16} />} title="Heading 2" />
        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={<List size={16} />} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={<ListOrdered size={16} />} title="Numbered List" />
        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        
        <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={<AlignLeft size={16} />} title="Align Left" />
        <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={<AlignCenter size={16} />} title="Align Center" />
        <ToolbarButton onClick={() => execCommand("justifyRight")} icon={<AlignRight size={16} />} title="Align Right" />
        <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
        
        <ToolbarButton onClick={() => {
          saveSelection();
          const url = prompt("Enter link URL:");
          restoreSelection();
          if (url) execCommand("createLink", url);
        }} icon={<LinkIcon size={16} />} title="Insert Link" />
        
        {/* Media / Attachment Uploads */}
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton 
          onClick={() => { saveSelection(); imageInputRef.current.click(); }} 
          icon={<ImageIcon size={16} className="text-emerald-500" />} 
          title="Upload Image" 
        />
        <ToolbarButton 
          onClick={() => { saveSelection(); videoInputRef.current.click(); }} 
          icon={<Video size={16} className="text-orange-500" />} 
          title="Upload Video" 
        />
        <ToolbarButton 
          onClick={() => { saveSelection(); docInputRef.current.click(); }} 
          icon={<Paperclip size={16} className="text-blue-500" />} 
          title="Upload Document" 
        />

        <div className="flex-1 min-w-[10px]" />
        
        <ToolbarButton onClick={() => execCommand("undo")} icon={<Undo size={16} />} title="Undo" />
        <ToolbarButton onClick={() => execCommand("redo")} icon={<Redo size={16} />} title="Redo" />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 overflow-y-auto p-4 sm:p-6 outline-none text-base sm:text-lg leading-relaxed text-text-primary prose prose-invert max-w-none
                   prose-p:my-3 prose-headings:text-primary prose-a:text-primary prose-ul:list-disc prose-ol:list-decimal"
        placeholder={placeholder}
      />
      
      {/* CSS for Placeholder if empty */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: rgba(156, 163, 175, 0.5);
          cursor: text;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ onClick, icon, title }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
         // Prevent editor from losing focus immediately when clicking toolbar
         e.preventDefault();
      }}
      onClick={onClick}
      title={title}
      className="p-2 sm:p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer"
    >
      {icon}
    </button>
  );
}
