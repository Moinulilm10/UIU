import { motion } from "framer-motion";

/**
 * Reusable Button component with multiple style variants.
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant - Visual style
 * @param {string} size - Button size ('sm' | 'md' | 'lg')
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disabled state
 */
const variants = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20",
  secondary:
    "bg-surface-alt text-text-primary hover:bg-surface-alt/80 border border-border",
  danger:
    "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-alt hover:text-text-primary",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
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
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
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
