import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPattern from "@/assets/hero-pattern.jpg";

type UserRole = "student" | "teacher" | "admin";

const roles = [
  {
    id: "student" as UserRole,
    title: "Student",
    description: "View assignments, upload submissions & track progress",
    icon: GraduationCap,
  },
  {
    id: "teacher" as UserRole,
    title: "Teacher",
    description: "Create assignments, review submissions & grade work",
    icon: BookOpen,
  },
  {
    id: "admin" as UserRole,
    title: "Admin",
    description: "Manage users, subjects & monitor system activity",
    icon: Shield,
  },
];

export function SplashScreen({ onComplete }: { onComplete: (role: UserRole) => void }) {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroPattern})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-90" />

      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen text-primary-foreground"
          >
            <motion.div
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>
            <motion.h1
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] tracking-tight"
            >
              SmartAssign Pro
            </motion.h1>
            <motion.p
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg opacity-80 mt-3"
            >
              Smart Assignment Management
            </motion.p>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8"
            >
              <div className="w-8 h-8 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="role-select"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12"
          >
            <motion.div
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary-foreground font-[var(--font-heading)]">
                  SmartAssign Pro
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground font-[var(--font-heading)]">
                Choose Your Role
              </h2>
              <p className="text-primary-foreground/70 mt-2">
                Select how you want to use the platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl">
              {roles.map((role, i) => (
                <motion.button
                  key={role.id}
                  initial={false}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 * i, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`glass-card rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer ${
                    selectedRole === role.id
                      ? "ring-2 ring-accent shadow-xl"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
                    <role.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground font-[var(--font-heading)]">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: selectedRole ? 1 : 0.3 }}
              className="mt-8"
            >
              <Button
                variant="hero"
                size="lg"
                disabled={!selectedRole}
                onClick={() => selectedRole && onComplete(selectedRole)}
              >
                <Users className="w-5 h-5" />
                Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : "..."}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
