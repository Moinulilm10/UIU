/**
 * Standardized themed Input component.
 * Enhanced with 2xl border radius and better padding for premium feel.
 */
export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-text-secondary px-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-5 py-3 rounded-2xl bg-background border border-border
          text-text-primary placeholder:text-text-muted/60
          focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary
          transition-all duration-300 text-sm font-medium
          ${error ? "border-red-500/50 focus:ring-red-500/10" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-bold px-1">{error}</p>}
    </div>
  );
}
