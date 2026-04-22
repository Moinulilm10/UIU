import { motion } from "framer-motion";

/**
 * Reusable Card container with hover elevation animation.
 * Supports glassmorphism styling with subtle borders.
 */
export default function Card({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      className={`
        bg-surface rounded-2xl border border-border p-6
        shadow-lg shadow-black/5 transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
