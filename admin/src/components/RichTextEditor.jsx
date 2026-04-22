import { useRef, useEffect } from "react";
import { 
  Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Link as LinkIcon, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";

export default function RichTextEditor({ value, onChange, placeholder = "Start typing..." }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

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

  return (
    <div className="w-full border border-border rounded-2xl overflow-hidden bg-surface group focus-within:ring-4 focus-within:ring-primary/10 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-alt/50 border-b border-border/50">
        <ToolbarButton onClick={() => execCommand("bold")} icon={<Bold size={16} />} title="Bold" />
        <ToolbarButton onClick={() => execCommand("italic")} icon={<Italic size={16} />} title="Italic" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "h1")} icon={<Heading1 size={16} />} title="Heading 1" />
        <ToolbarButton onClick={() => execCommand("formatBlock", "h2")} icon={<Heading2 size={16} />} title="Heading 2" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon={<List size={16} />} title="Bullet List" />
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon={<ListOrdered size={16} />} title="Numbered List" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => execCommand("justifyLeft")} icon={<AlignLeft size={16} />} title="Align Left" />
        <ToolbarButton onClick={() => execCommand("justifyCenter")} icon={<AlignCenter size={16} />} title="Align Center" />
        <ToolbarButton onClick={() => execCommand("justifyRight")} icon={<AlignRight size={16} />} title="Align Right" />
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => {
          const url = prompt("Enter link URL:");
          if (url) execCommand("createLink", url);
        }} icon={<LinkIcon size={16} />} title="Link" />
        <div className="flex-1" />
        <ToolbarButton onClick={() => execCommand("undo")} icon={<Undo size={16} />} title="Undo" />
        <ToolbarButton onClick={() => execCommand("redo")} icon={<Redo size={16} />} title="Redo" />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] max-h-[500px] overflow-y-auto p-5 outline-none text-sm text-text-primary prose prose-invert prose-p:my-2 prose-headings:text-primary prose-a:text-primary prose-ul:list-disc prose-ol:list-decimal"
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
      onClick={onClick}
      title={title}
      className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
    >
      {icon}
    </button>
  );
}
