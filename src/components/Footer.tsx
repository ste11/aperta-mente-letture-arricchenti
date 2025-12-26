import { Sparkles, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/10 mt-24">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-light-blue" />
              <span className="font-heading text-xl font-bold text-foreground">
                Aperta-Mente
              </span>
            </div>
            <p className="font-paragraph text-sm text-foreground/70 leading-relaxed">
              Un viaggio attraverso le letture che nutrono la mente e aprono nuovi orizzonti.
              Dal 2020 al 2025, una collezione curata di libri che ispirano crescita e strategia.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Navigazione
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-paragraph text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/libri"
                  className="font-paragraph text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  Tutti i Libri
                </Link>
              </li>
              <li>
                <Link
                  to="/libri#must-read"
                  className="font-paragraph text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  Must Read
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
              Contatti
            </h3>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-white/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@aperta-mente.com"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-white/10 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-paragraph text-sm text-foreground/50 text-center">
            © {currentYear} Aperta-Mente. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
