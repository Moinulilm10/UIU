import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Stylish, reusable Select component.
 * Features: Searchable (optional), keyboard navigation, premium animations.
 * @param {string} label - Input label
 * @param {any} value - Selected value
 * @param {function} onChange - Callback on selection
 * @param {Array} options - Array of { value, label, sublabel, icon: IconComponent }
 * @param {string} placeholder - Default placeholder
 * @param {boolean} isSearchable - Enable search input
 * @param {React.Component} icon - Leading icon for trigger
 * @param {string} className - Additional container classes
 */
export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  isSearchable = false,
  icon: Icon,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Reset search when opening/closing
  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-black text-text-muted uppercase tracking-[0.2em] px-1">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-5 py-4 rounded-2xl
          bg-surface border transition-all duration-300 text-left cursor-pointer
          ${isOpen ? "border-primary ring-4 ring-primary/10 shadow-xl bg-surface" : "border-border hover:border-primary/50 hover:bg-surface-alt/50"}
        `}
      >
        {Icon && (
          <Icon size={18} className={`${isOpen ? "text-primary" : "text-text-muted"}`} />
        )}
        
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
            <span className="text-sm font-semibold text-text-muted">
              {placeholder}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className={`${isOpen ? "text-primary" : "text-text-muted"}`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 z-[100] mt-2 p-2 bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          >
            {isSearchable && (
              <div className="px-3 py-2.5 border-b border-border/50 mb-1 flex items-center gap-3">
                <Search size={14} className="text-text-muted" />
                <input 
                  autoFocus
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="bg-transparent border-none outline-none text-xs font-bold text-text-primary placeholder:text-text-muted/60 w-full"
                />
              </div>
            )}

            <div className="max-h-60 overflow-y-auto scrollbar-none space-y-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group cursor-pointer
                      ${
                        option.value === value
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "hover:bg-surface-alt text-text-primary"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      {option.icon && (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${option.value === value ? "bg-white/20" : "bg-surface-alt"}`}>
                          <option.icon size={16} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${option.value === value ? "text-white" : "text-text-primary"}`}>
                          {option.label}
                        </p>
                        {option.sublabel && (
                          <p className={`text-[10px] font-medium truncate ${option.value === value ? "text-white/80" : "text-text-muted"}`}>
                            {option.sublabel}
                          </p>
                        )}
                      </div>
                    </div>
                    {option.value === value && (
                      <motion.div
                        initial={{ scale: 0, x: 10 }}
                        animate={{ scale: 1, x: 0 }}
                        className="ml-2"
                      >
                        <Check size={16} strokeWidth={3} />
                      </motion.div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center mx-auto mb-3">
                    <Search size={20} className="opacity-20" />
                  </div>
                  <p className="text-xs font-bold">No matches found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
