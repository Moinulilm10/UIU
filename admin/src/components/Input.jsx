/**
 * Standardized themed Input component.
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {string} className - Additional CSS classes
 */
export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 rounded-xl bg-background border border-border
          text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          transition-all duration-200 text-sm
          ${error ? "border-red-500/50 focus:ring-red-500/40" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
