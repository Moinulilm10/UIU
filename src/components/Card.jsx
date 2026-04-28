import { motion } from "framer-motion";

/**
 * Reusable Card container with hover elevation animation.
 * Uses consistent padding and border-radius. Supports glassmorphism styling.
 * Enhanced padding and shadows for premium feel.
 */
export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={
        hover ? { y: -5, transition: { duration: 0.3, ease: "easeOut" } } : {}
      }
      className={`
        bg-surface rounded-[2rem] border border-border p-6 sm:p-8
        shadow-xl shadow-black/5 transition-all duration-300
        relative overflow-hidden
        ${className}
      `}
      {...props}
    >
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
