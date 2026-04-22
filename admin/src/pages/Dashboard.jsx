import { motion } from "framer-motion";
import {
  GraduationCap, Users, DollarSign, BookOpen,
  TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";
import Card from "../components/Card";
import { batches, students, enrollmentTrends } from "../data/mockData";

export default function Dashboard() {
  "use no memo";
  const totalBatches = batches.length;
  const totalStudents = students.length;
  const activeCourses = new Set(batches.map((b) => b.courseName)).size;
  const revenue = totalStudents * 299;

  const stats = [
    { label: "Total Batches", value: totalBatches, change: "+12%", trend: "up", icon: GraduationCap, bg: "bg-primary/10", textColor: "text-primary", glow: "from-primary to-amber-500" },
    { label: "Total Students", value: totalStudents, change: "+8%", trend: "up", icon: Users, bg: "bg-blue-500/10", textColor: "text-blue-400", glow: "from-blue-500 to-cyan-400" },
    { label: "Revenue", value: `$${revenue.toLocaleString()}`, change: "+23%", trend: "up", icon: DollarSign, bg: "bg-emerald-500/10", textColor: "text-emerald-400", glow: "from-emerald-500 to-green-400" },
    { label: "Active Courses", value: activeCourses, change: "-2%", trend: "down", icon: BookOpen, bg: "bg-violet-500/10", textColor: "text-violet-400", glow: "from-violet-500 to-purple-400" },
  ];

  const maxCount = Math.max(...enrollmentTrends.map((d) => d.count));
  const sortedBatches = [...batches].sort((a, b) => b.studentCount - a.studentCount);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">Analytics Overview</h1>
        <p className="text-sm sm:text-base text-text-muted font-medium opacity-80">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="relative overflow-hidden group">
              <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${stat.glow} opacity-5 group-hover:opacity-15 blur-2xl transition-opacity duration-500`} />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-3">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-text-primary mb-3 tabular-nums">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg ${stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span className="text-[11px] font-bold">{stat.change}</span>
                    </div>
                    <span className="text-[11px] text-text-muted font-semibold whitespace-nowrap">vs last month</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={24} className={stat.textColor} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card hover={false} className="!p-6 sm:!p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">Enrollment Trends</h3>
              <p className="text-sm text-text-muted mt-1 font-medium">Monthly student enrollments over the past year</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold self-start sm:self-auto border border-emerald-500/20">
              <ArrowUpRight size={15} /> Growing (+18.5%)
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-4 h-48 sm:h-64 relative">
             {/* Grid lines helper */}
             <div className="absolute inset-x-0 top-0 h-[1px] bg-border/50" />
             <div className="absolute inset-x-0 top-1/2 h-[1px] bg-border/30" />
             <div className="absolute inset-x-0 bottom-0 h-[1px] bg-border/50" />

            {enrollmentTrends.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-3 relative z-10">
                <div className="group relative w-full flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-primary/90 to-primary/40 group-hover:from-primary group-hover:to-primary/60 transition-all duration-300 shadow-lg shadow-primary/10 relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-text-primary text-background text-[10px] font-bold px-2 py-1 rounded-lg z-20 pointer-events-none">
                    {d.count}
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-tighter sm:tracking-normal">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card hover={false} className="h-full !p-6 sm:!p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">Top Batches</h3>
              <button className="text-xs font-bold text-primary hover:underline underline-offset-4">View All</button>
            </div>
            <div className="space-y-6">
              {sortedBatches.slice(0, 5).map((batch, i) => {
                const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                return (
                  <div key={batch.id} className="flex items-center gap-5 group">
                    <span className="w-8 h-8 rounded-xl bg-surface-alt border border-border/50 flex items-center justify-center text-xs font-black text-text-muted shrink-0 group-hover:text-primary transition-colors">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-text-primary truncate group-hover:translate-x-1 transition-transform">{batch.name}</p>
                        <span className="text-xs text-text-muted font-bold ml-2 shrink-0 tabular-nums">{batch.studentCount} / {batch.maxLimit}</span>
                      </div>
                      <div className="h-2 bg-surface-alt rounded-full overflow-hidden border border-border/20">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full shadow-inner ${pct >= 100 ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card hover={false} className="h-full !p-6 sm:!p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">Course Distribution</h3>
              <button className="text-xs font-bold text-primary hover:underline underline-offset-4">Manage Courses</button>
            </div>
            <div className="space-y-1.5">
              {batches.slice(0, 5).map((batch) => {
                const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                return (
                  <div key={batch.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-alt/50 transition-all duration-300 group border border-transparent hover:border-border/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <BookOpen size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">{batch.courseName}</p>
                      <p className="text-[11px] text-text-muted font-semibold mt-0.5">{batch.studentCount} students enrolled · {pct}% capacity</p>
                    </div>
                    <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 ${batch.status === "open" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {batch.status === "open" ? "Open" : "Full"}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
