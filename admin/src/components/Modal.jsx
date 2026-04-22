import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Animated Modal component with backdrop.
 * Responsive sizing — full-width on mobile with proper padding.
 * Supports custom className for width overrides and z-index control.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  // Extract z-index if provided in className to apply to backdrop
  const zClass = className.split(" ").find((c) => c.startsWith("z-")) || "z-50";
  const cleanClassName = className.replace(zClass, "").trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 ${zClass} flex items-end sm:items-center justify-center p-0 sm:p-4`}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`
                relative w-full bg-surface sm:rounded-3xl rounded-t-3xl border border-border
                shadow-2xl shadow-black/40 overflow-hidden max-h-[90vh] flex flex-col
                ${cleanClassName.includes("max-w-") ? cleanClassName : `sm:max-w-lg ${cleanClassName}`}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 shrink-0">
              <h3 className="text-lg font-black text-text-primary tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:bg-surface-alt
                           hover:text-text-primary transition-all duration-300 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto scrollbar-none mb-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
