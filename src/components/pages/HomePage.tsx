// HPI 1.6-V AGGIORNATO (Dinamico)
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, Sparkles, TrendingUp, Star, Compass, Brain, Lightbulb, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BaseCrudService } from '@/integrations'; // Aggiunto
import { Books } from '@/entities'; // Aggiunto

// --- Types ---
type Category = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

const CATEGORIES: Category[] = [
  { id: 'cat-1', title: 'Strategia & Visione', description: 'Strumenti intellettuali per navigare la complessità.', icon: Compass, color: 'text-blue-400' },
  { id: 'cat-2', title: 'Psicologia & Mente', description: 'Comprendere i meccanismi profondi del pensiero.', icon: Brain, color: 'text-purple-400' },
  { id: 'cat-3', title: 'Innovazione', description: 'Idee che rompono gli schemi e creano valore.', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'cat-4', title: 'Crescita Personale', description: 'Ottimizzazione delle performance e auto-miglioramento.', icon: TrendingUp, color: 'text-green-400' }
];

// --- Utility Components ---
const AnimatedReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className || ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: 0.3 }} />
    ))}
  </div>
);

// --- Main Page Component ---
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mustReadBooks, setMustReadBooks] = useState<Books[]>([]); // Stato per i libri reali
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // --- Recupero Libri Must Read dal Database ---
  useEffect(() => {
    const loadMustReads = async () => {
      try {
        const response = await BaseCrudService.getAll<Books>('libri');
        // Filtriamo solo quelli con isMustRead = true
        const filtered = (response.items || [])
          .filter(book => book.isMustRead)
          .slice(0, 5); // Prendiamo i primi 5
        setMustReadBooks(filtered);
      } catch (error) {
        console.error("Errore nel caricamento Must Reads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMustReads();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-light-blue selection:text-background overflow-x-clip">
      <Header />

      {/* --- HERO SECTION (Invariata) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 w-full h-full z-0">
          <Image src="https://static.wixstatic.com/media/86e416_9687c99709af41fcb10255e12c878861~mv2.jpg?id=hero-milky-way" alt="Via Lattea" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </motion.div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
            <h1 className="font-heading text-6xl md:text-9xl font-bold mb-6 tracking-tight">Aperta<span className="text-light-blue">-</span>Mente</h1>
            <p className="font-heading text-2xl md:text-3xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">Letture Arricchenti per <span className="text-light-blue italic">Orizzonti Infiniti</span></p>
            <div className="flex gap-6 justify-center">
                <Link to="/libri"><Button size="lg" className="bg-light-blue text-background rounded-full px-8">Esplora la Collezione</Button></Link>
            </div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION (Invariata) --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        <StarField />
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <AnimatedReveal>
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-8">L'Effetto <span className="text-light-blue">Nutriente</span></h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Ogni libro in questa collezione è un nutrimento per la mente, trasformando pagine lette in nuove prospettive e strategie.</p>
            </AnimatedReveal>
        </div>
      </section>

      {/* --- MUST READ HORIZONTAL SCROLL (DINAMICO) --- */}
      <section id="must-read" className="py-32 overflow-hidden relative bg-background">
        <div className="container mx-auto px-6 mb-16">
          <AnimatedReveal>
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-heading tracking-widest text-sm uppercase">Top Selection</span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">Le Stelle Polari</h2>
          </AnimatedReveal>
        </div>

        <div className="w-full overflow-x-auto pb-12 px-6 scrollbar-hide">
          <div className="flex gap-8 w-max mx-auto md:mx-0 md:pl-[max(1.5rem,calc((100vw-1280px)/2))]">
            
            {mustReadBooks.length > 0 ? (
                mustReadBooks.map((book, idx) => (
                    <motion.div key={book._id} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }} viewport={{ once: true }} className="w-[85vw] md:w-[600px] flex-shrink-0 group">
                        <div className="bg-[#0F2242] rounded-3xl overflow-hidden border border-white/10 hover:border-light-blue/30 transition-all duration-500 flex flex-col md:flex-row h-[350px]">
                            {/* Copertina */}
                            <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden bg-black/20">
                                {book.coverImage ? (
                                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20"><BookOpen className="w-12 h-12" /></div>
                                )}
                                <div className="absolute top-4 left-4"><Badge className="bg-yellow-500 text-black">Must Read</Badge></div>
                            </div>

                            {/* Contenuto */}
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <span className="text-xs font-bold text-light-blue uppercase mb-2">{book.category || 'Generale'}</span>
                                <h3 className="font-heading text-2xl font-bold text-white mb-2 line-clamp-2">{book.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 italic">di {book.author}</p>
                                <div className="relative pl-4 border-l-2 border-white/20 mb-6">
                                    <p className="text-gray-300 text-sm line-clamp-3 italic">"{book.microReview || 'Nessuna recensione disponibile.'}"</p>
                                </div>
                                <Link to={`/libro/${book._id}`} className="mt-auto">
                                    <Button variant="ghost" className="text-white hover:text-light-blue p-0 h-auto font-medium">
                                        Scheda Completa <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <p className="text-white/40 italic ml-6">Seleziona dei libri come "Must Read" nella dashboard per vederli qui.</p>
            )}

            <div className="w-6 md:w-32 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* --- FINAL SECTIONS (Invariate) --- */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
          <AnimatedReveal>
            <Quote className="w-16 h-16 text-light-blue/50 mx-auto mb-8" />
            <h2 className="font-heading text-3xl md:text-5xl font-light text-white italic mb-8">"Una mente che si è allargata per una nuova idea non potrà mai tornare alle sue dimensioni originali."</h2>
            <p className="text-xl text-light-blue font-bold">— Oliver Wendell Holmes</p>
          </AnimatedReveal>
      </section>

      <Footer />
    </div>
  );
}