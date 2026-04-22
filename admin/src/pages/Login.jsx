import { motion } from "framer-motion";
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
 * Validates credentials against VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD from .env.
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

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border shadow-2xl shadow-black/10 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-8 pb-6 sm:px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/25"
            >
              <GraduationCap size={32} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome Back
            </h1>
            <p className="text-sm text-text-muted mt-2">
              Sign in to your admin dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-8 sm:px-8 space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edulearn.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border
                             text-text-primary placeholder:text-text-muted text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                             transition-all duration-200"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-background border border-border
                             text-text-primary placeholder:text-text-muted text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                             transition-all duration-200"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted
                             hover:text-text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm
                         hover:bg-primary/90 shadow-lg shadow-primary/25
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-300 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* Hint */}
            <p className="text-center text-xs text-text-muted pt-2">
              Demo credentials:{" "}
              <span className="text-text-secondary font-medium">
                admin@edulearn.com
              </span>{" "}
              /{" "}
              <span className="text-text-secondary font-medium">Admin@123</span>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
