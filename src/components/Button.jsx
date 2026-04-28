import { motion } from "framer-motion";

/**
 * Reusable Button component with multiple style variants.
 * Updated with 2xl border radius and better padding.
 */
const variants = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
  secondary:
    "bg-surface-alt text-text-primary hover:bg-surface-alt/80 border border-border shadow-sm",
  danger:
    "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 shadow-sm",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-alt hover:text-text-primary",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : {}}
      className={`
        inline-flex items-center justify-center gap-2.5 rounded-2xl font-bold
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
