// HPI 1.6-V
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Star, Compass, Brain, Lightbulb, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// --- Types ---
type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  microReview: string;
  imageSrc: string;
};

type Category = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

// --- Canonical Data Sources ---
// Simulating the "List of books read from 2020-2025" as requested to be transformed.
const MUST_READ_BOOKS: Book[] = [
  {
    id: 'mr-1',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psicologia Cognitiva',
    rating: 5,
    microReview: "Un'esplorazione fondamentale dei due sistemi che guidano il modo in cui pensiamo. Essenziale per comprendere i bias decisionali.",
    imageSrc: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=book-cover-1'
  },
  {
    id: 'mr-2',
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Produttività',
    rating: 5,
    microReview: "In un mondo distratto, la capacità di concentrarsi senza distrazioni è un superpotere. Una guida pratica per l'eccellenza cognitiva.",
    imageSrc: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=book-cover-2'
  },
  {
    id: 'mr-3',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Crescita Personale',
    rating: 5,
    microReview: "Piccoli cambiamenti, risultati straordinari. Il manuale definitivo per costruire abitudini che durano e rompono schemi negativi.",
    imageSrc: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=book-cover-3'
  },
  {
    id: 'mr-4',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Strategia & Innovazione',
    rating: 5,
    microReview: "Note sulle startup e su come costruire il futuro. Una prospettiva contrarian sull'innovazione verticale.",
    imageSrc: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=book-cover-4'
  },
  {
    id: 'mr-5',
    title: 'Antifragile',
    author: 'Nassim Nicholas Taleb',
    category: 'Filosofia & Rischio',
    rating: 5,
    microReview: "Le cose che guadagnano dal disordine. Un concetto vitale per navigare l'incertezza del mondo moderno.",
    imageSrc: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=book-cover-5'
  }
];

const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    title: 'Strategia & Visione',
    description: 'Strumenti intellettuali per navigare la complessità e anticipare il futuro.',
    icon: Compass,
    color: 'text-blue-400'
  },
  {
    id: 'cat-2',
    title: 'Psicologia & Mente',
    description: 'Comprendere i meccanismi profondi del pensiero e del comportamento umano.',
    icon: Brain,
    color: 'text-purple-400'
  },
  {
    id: 'cat-3',
    title: 'Innovazione',
    description: 'Idee che rompono gli schemi e creano nuovo valore nel mercato.',
    icon: Lightbulb,
    color: 'text-yellow-400'
  },
  {
    id: 'cat-4',
    title: 'Crescita Personale',
    description: 'Il processo continuo di auto-miglioramento e ottimizzazione delle performance.',
    icon: TrendingUp,
    color: 'text-green-400'
  }
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
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className || ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random() * 0.5 + 0.1,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out ${Math.random() * 5}s`
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-light-blue selection:text-background overflow-x-clip">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <Image
            src="https://static.wixstatic.com/media/86e416_9687c99709af41fcb10255e12c878861~mv2.jpg?id=hero-milky-way"
            alt="Via Lattea - Simbolo dell'infinito potenziale della mente umana"
            className="w-full h-full object-cover scale-105"
            width={1920}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,25,49,0.8)_100%)]" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-light-blue/50" />
              <span className="text-light-blue font-heading tracking-[0.2em] text-sm uppercase">Personal Branding Library</span>
              <div className="h-[1px] w-12 bg-light-blue/50" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl"
          >
            Aperta<span className="text-light-blue">-</span>Mente
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-heading text-2xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Letture Arricchenti per <span className="text-light-blue italic">Orizzonti Infiniti</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/libri">
              <Button size="lg" className="bg-light-blue text-background hover:bg-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(169,214,229,0.3)] hover:shadow-[0_0_30px_rgba(169,214,229,0.5)]">
                Esplora la Collezione
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/libri#must-read">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm">
                I 5 Must Read
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest">Scopri</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-light-blue to-transparent" />
        </motion.div>
      </section>

      {/* --- PHILOSOPHY SECTION (The Nourishing Effect) --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        <StarField />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedReveal>
              <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-8">
                L'Effetto <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-white">Nutriente</span> <br />
                della Lettura
              </h2>
              <div className="w-24 h-1 bg-brand-color mb-8" />
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                In un mondo di informazioni veloci e superficiali, la lettura profonda è un atto di resistenza e di cura. 
                Ogni libro selezionato in questa collezione non è solo un testo, ma un nutrimento per la mente.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Dal 2020, questo archivio traccia un percorso di evoluzione personale e professionale, 
                trasformando pagine lette in nuove prospettive, strategie e connessioni neurali.
              </p>
            </AnimatedReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Brain, title: "Espansione Cognitiva", text: "Nuovi modelli mentali per interpretare la realtà." },
                { icon: Compass, title: "Orientamento Strategico", text: "Mappe per navigare la complessità professionale." },
                { icon: Sparkles, title: "Ispirazione Pura", text: "Scintille che accendono la creatività latente." },
                { icon: TrendingUp, title: "Crescita Continua", text: "Il compound effect della conoscenza applicata." }
              ].map((item, idx) => (
                <AnimatedReveal key={idx} delay={idx * 100} className="group">
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 h-full">
                    <item.icon className="w-10 h-10 text-light-blue mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <h3 className="font-heading text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- THEMATIC CONSTELLATIONS (Categories) --- */}
      <section className="py-32 bg-gradient-to-b from-background to-[#0d2142] relative">
        <div className="container mx-auto px-6">
          <AnimatedReveal className="text-center mb-20">
            <span className="text-light-blue font-heading tracking-widest text-sm uppercase mb-4 block">La Mappa del Tesoro</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Costellazioni Tematiche</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              La conoscenza non è isolata. I libri sono organizzati in costellazioni interconnesse 
              che illuminano diverse aree della crescita umana e professionale.
            </p>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <AnimatedReveal key={cat.id} delay={idx * 100}>
                <Link to={`/libri?category=${cat.id}`} className="block h-full">
                  <div className="group relative h-full bg-[#0A1931] border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-light-blue/50 transition-all duration-500">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-light-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${cat.color}`}>
                        <cat.icon className="w-7 h-7" />
                      </div>
                      
                      <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-light-blue transition-colors">
                        {cat.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                        {cat.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                        Esplora Categoria
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- MUST READ HORIZONTAL SCROLL (The North Stars) --- */}
      <section id="must-read" className="py-32 overflow-hidden relative bg-background">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <AnimatedReveal>
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-heading tracking-widest text-sm uppercase">Top 5 Selection</span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white">
              Le Stelle Polari
            </h2>
          </AnimatedReveal>
          <AnimatedReveal delay={200}>
            <p className="text-gray-400 max-w-md text-right md:text-left">
              Libri che hanno lasciato un segno indelebile. 
              Se devi leggere solo 5 libri quest'anno, inizia da qui.
            </p>
          </AnimatedReveal>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="w-full overflow-x-auto pb-12 px-6 scrollbar-hide cursor-grab active:cursor-grabbing">
          <div className="flex gap-8 w-max mx-auto md:mx-0 md:pl-[max(1.5rem,calc((100vw-1280px)/2))]">
            {MUST_READ_BOOKS.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-10%" }}
                className="w-[85vw] md:w-[600px] flex-shrink-0 group"
              >
                <div className="bg-[#0F2242] rounded-3xl overflow-hidden border border-white/10 hover:border-light-blue/30 transition-all duration-500 flex flex-col md:flex-row h-full">
                  {/* Book Cover Area */}
                  <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <Image
                      src={book.imageSrc}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      width={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2242] to-transparent md:bg-gradient-to-r" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/50 backdrop-blur-md">
                        Must Read
                      </Badge>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <div className="text-xs font-bold text-light-blue uppercase tracking-wider mb-2">
                      {book.category}
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 italic">
                      di {book.author}
                    </p>
                    
                    <div className="relative pl-6 border-l-2 border-white/20 mb-8">
                      <Quote className="absolute -top-2 -left-2 w-4 h-4 text-white/40 fill-white/40" />
                      <p className="text-gray-300 text-base leading-relaxed">
                        "{book.microReview}"
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <Link to={`/libro/${book.id}`}>
                        <Button variant="ghost" className="text-white hover:text-light-blue hover:bg-white/5 p-0 h-auto font-medium">
                          Scheda Completa <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Spacer for end of scroll */}
            <div className="w-6 md:w-32 flex-shrink-0" />
          </div>
        </div>
      </section>

      {/* --- QUOTE / BREATHER SECTION --- */}
      <section className="py-40 px-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-color/20" />
        <Image 
          src="https://static.wixstatic.com/media/86e416_9687c99709af41fcb10255e12c878861~mv2.jpg?id=quote-bg"
          alt="Background Texture"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          width={1920}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedReveal>
            <Quote className="w-16 h-16 text-light-blue/50 mx-auto mb-8" />
            <h2 className="font-heading text-3xl md:text-5xl font-light text-white leading-tight mb-8 italic">
              "Una mente che si è allargata per una nuova idea non potrà mai tornare alle sue dimensioni originali."
            </h2>
            <p className="text-xl text-light-blue font-bold tracking-wide">
              — Oliver Wendell Holmes
            </p>
          </AnimatedReveal>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-light-blue/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <AnimatedReveal>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto ad espandere i tuoi orizzonti?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              La biblioteca completa contiene decine di titoli analizzati e categorizzati. 
              Inizia oggi il tuo percorso di lettura consapevole.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/libri">
                <Button size="lg" className="bg-white text-background hover:bg-light-blue hover:text-background text-lg px-10 py-6 rounded-full transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                  Accedi alla Biblioteca
                </Button>
              </Link>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-10 py-6 rounded-full w-full sm:w-auto">
                  Connettiti su LinkedIn
                </Button>
              </a>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}