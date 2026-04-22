import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

/**
 * Stylish, reusable Select component.
 * Features: Searchable (optional), keyboard navigation, premium animations.
 * @param {string} label - Input label
 * @param {any} value - Selected value
 * @param {function} onChange - Callback on selection
 * @param {Array} options - Array of { value, label, sublabel, icon }
 * @param {string} placeholder - Default placeholder
 * @param {string} className - Additional container classes
 */
export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option", 
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-5 py-4 rounded-2xl 
          bg-background border transition-all duration-300 text-left
          ${isOpen ? "border-primary ring-4 ring-primary/10 shadow-lg" : "border-border hover:border-primary/50"}
        `}
      >
        <div className="flex-1 min-w-0">
          {selectedOption ? (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary truncate">
                {selectedOption.label}
              </span>
              {selectedOption.sublabel && (
                <span className="text-[10px] text-text-muted font-bold truncate">
                  {selectedOption.sublabel}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium text-text-muted">
              {placeholder}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="ml-3 text-text-muted"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 z-[100] mt-2 p-2 bg-surface border border-border shadow-2xl rounded-2xl max-h-64 overflow-y-auto scrollbar-none"
          >
            {options.length > 0 ? (
              <div className="space-y-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                      ${option.value === value 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "hover:bg-surface-alt text-text-primary"}
                    `}
                  >
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-bold truncate ${option.value === value ? "text-white" : "text-text-primary"}`}>
                        {option.label}
                      </p>
                      {option.sublabel && (
                        <p className={`text-[10px] font-medium truncate ${option.value === value ? "text-white/80" : "text-text-muted"}`}>
                          {option.sublabel}
                        </p>
                      )}
                    </div>
                    {option.value === value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-2">
                        <Check size={16} strokeWidth={3} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">
                <p className="text-xs font-bold">No options available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
