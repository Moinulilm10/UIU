/**
 * Badge component for status indicators.
 * @param {'open'|'closed'} status - The batch status
 */
const statusStyles = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels = {
  open: "Open",
  closed: "Closed",
};

export default function Badge({ status }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        border transition-all duration-300
        ${statusStyles[status]}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "open" ? "bg-emerald-400 animate-pulse" : "bg-red-400"
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}
