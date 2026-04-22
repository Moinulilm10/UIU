import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Login page with mock authentication.
 * Enhanced with modern design, 2xl border radius, and premium spacing.
 */
export default function Login() {
  "use no memo";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-inter">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px]"
      >
        {/* Card */}
        <div className="bg-surface rounded-[2.5rem] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-12 pb-8 sm:px-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
            >
              <GraduationCap size={40} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-text-muted mt-3 font-medium opacity-80">
              Sign in to manage your e-learning platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-12 sm:px-12 space-y-6">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edulearn.com"
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-background border border-border
                             text-text-primary placeholder:text-text-muted/60 text-sm font-medium
                             focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary
                             transition-all duration-300"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-text-secondary uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-4 rounded-2xl bg-background border border-border
                             text-text-primary placeholder:text-text-muted/60 text-sm font-medium
                             focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary
                             transition-all duration-300"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted
                             hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98, y: 0 } : {}}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-wider
                         hover:bg-primary/90 shadow-xl shadow-primary/20
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-300 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* Hint */}
            <div className="pt-2">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] flex-1 bg-border" />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Demo Account</span>
                    <div className="h-[1px] flex-1 bg-border" />
                </div>
                <div className="bg-surface-alt/50 rounded-2xl p-4 border border-border/50 text-center">
                    <p className="text-[11px] text-text-muted font-bold">
                        <span className="text-text-secondary">admin@edulearn.com</span>
                        <span className="mx-2 opacity-30">/</span>
                        <span className="text-text-secondary">Admin@123</span>
                    </p>
                </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
