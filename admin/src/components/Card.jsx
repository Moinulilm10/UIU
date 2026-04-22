import { motion } from "framer-motion";

/**
 * Reusable Card container with hover elevation animation.
 * Uses consistent padding and border-radius. Supports glassmorphism styling.
 */
export default function Card({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, transition: { duration: 0.25 } } : {}}
      className={`
        bg-surface rounded-2xl border border-border p-4 sm:p-5
        shadow-lg shadow-black/5 transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
