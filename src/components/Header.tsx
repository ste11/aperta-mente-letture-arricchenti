import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Sparkles, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

export default function Header() {
  const location = useLocation();
  const { isOwnerLoggedIn, logout } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-[120rem] mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Sparkles className="w-6 h-6 text-light-blue group-hover:text-primary transition-colors" />
            <span className="font-heading text-2xl font-bold text-foreground">
              Aperta-Mente
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/')
                  ? 'text-primary font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/libri"
              className={`font-paragraph text-base transition-colors ${
                isActive('/libri')
                  ? 'text-primary font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Libri
            </Link>
            <Link
              to="/libri#must-read"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-paragraph font-medium hover:bg-primary/90 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Must Read
            </Link>

            {/* Owner Login/Dashboard */}
            {isOwnerLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/owner/dashboard"
                  className="px-4 py-2 text-light-blue hover:text-light-blue/80 font-paragraph text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Esci
                </Button>
              </div>
            ) : (
              <Link
                to="/owner/login"
                className="px-4 py-2 text-secondary hover:text-foreground font-paragraph text-sm transition-colors"
              >
                Accesso Proprietario
              </Link>
            )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
