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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics Overview</h1>
        <p className="text-sm text-text-muted mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="relative overflow-hidden">
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${stat.glow} opacity-10 blur-xl`} />
              <div className="flex items-start justify-between relative">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-red-400" />}
                    <span className={`text-xs font-semibold ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>{stat.change}</span>
                    <span className="text-xs text-text-muted">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}><stat.icon size={20} className={stat.textColor} /></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card hover={false}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-text-primary">Enrollment Trends</h3>
              <p className="text-xs text-text-muted mt-1">Monthly student enrollments over the year</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              <ArrowUpRight size={14} /> +18.5%
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-48">
            {enrollmentTrends.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-text-muted">{d.count}</span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(d.count / maxCount) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-lg bg-gradient-to-t from-primary/80 to-primary/30 hover:from-primary hover:to-primary/60 transition-all duration-300 cursor-pointer min-h-[4px]"
                />
                <span className="text-[10px] font-medium text-text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card hover={false}>
            <h3 className="text-base font-bold text-text-primary mb-4">Top Batches</h3>
            <div className="space-y-3">
              {sortedBatches.slice(0, 5).map((batch, i) => {
                const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                return (
                  <div key={batch.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-surface-alt flex items-center justify-center text-[10px] font-bold text-text-muted">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">{batch.name}</p>
                        <span className="text-xs text-text-muted ml-2 shrink-0">{batch.studentCount}/{batch.maxLimit}</span>
                      </div>
                      <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                          className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : pct >= 80 ? "bg-primary" : "bg-emerald-400"}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card hover={false}>
            <h3 className="text-base font-bold text-text-primary mb-4">Course Distribution</h3>
            <div className="space-y-3">
              {batches.slice(0, 5).map((batch) => {
                const pct = Math.round((batch.studentCount / batch.maxLimit) * 100);
                return (
                  <div key={batch.id} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><BookOpen size={14} className="text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">{batch.courseName}</p>
                      <p className="text-xs text-text-muted">{batch.studentCount} enrolled · {pct}% capacity</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${batch.status === "open" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {batch.status === "open" ? "Open" : "Full"}
                    </span>
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
