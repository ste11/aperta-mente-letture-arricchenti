// HomePage.tsx - Versione Snella e Focalizzata
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { ArrowRight, Sparkles, TrendingUp, Compass, Brain, Lightbulb, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

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

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white animate-pulse"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: '2px',
          height: '2px',
          opacity: Math.random() * 0.5 + 0.1,
        }}
      />
    ))}
  </div>
);

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-light-blue selection:text-background overflow-x-clip">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="https://static.wixstatic.com/media/86e416_9687c99709af41fcb10255e12c878861~mv2.jpg?id=hero-milky-way" 
            alt="Via Lattea" 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-6xl md:text-9xl font-bold mb-6 tracking-tight"
          >
            Aperta<span className="text-light-blue">-</span>Mente
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-2xl md:text-3xl mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Letture Arricchenti per <span className="text-light-blue italic">Orizzonti Infiniti</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/libri">
              <Button size="lg" className="bg-light-blue text-background hover:bg-white text-lg px-10 py-7 rounded-full transition-all duration-300 shadow-xl">
                Esplora la Biblioteca
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION (Il Manifesto) --- */}
      <section className="relative py-32 px-6 overflow-hidden">
        <StarField />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedReveal>
              <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-8 text-white">
                L'Effetto <br />
                <span className="text-light-blue">Nutriente</span> <br />
                della Lettura
              </h2>
              <div className="w-24 h-1 bg-light-blue mb-8" />
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                In un mondo di informazioni veloci, la lettura profonda è un atto di cura. 
                Ogni libro in questa collezione è un nutrimento per la mente.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Dal 2020, questo archivio traccia un percorso di evoluzione, 
                trasformando pagine lette in nuove prospettive e strategie.
              </p>
            </AnimatedReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Brain, title: "Espansione", text: "Nuovi modelli mentali per interpretare la realtà." },
                { icon: Compass, title: "Orientamento", text: "Mappe per navigare la complessità." },
                { icon: Sparkles, title: "Ispirazione", text: "Scintille che accendono la creatività." },
                { icon: TrendingUp, title: "Crescita", text: "Il valore della conoscenza applicata." }
              ].map((item, idx) => (
                <AnimatedReveal key={idx} delay={idx * 100}>
                  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500 h-full">
                    <item.icon className="w-10 h-10 text-light-blue mb-4" />
                    <h3 className="font-heading text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="py-40 px-6 relative overflow-hidden flex items-center justify-center bg-black/20">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <AnimatedReveal>
            <Quote className="w-16 h-16 text-light-blue/50 mx-auto mb-8" />
            <h2 className="font-heading text-3xl md:text-5xl font-light text-white leading-tight mb-8 italic">
              "Una mente che si è allargata per una nuova idea non potrà mai tornare alle sue dimensioni originali."
            </h2>
            <p className="text-xl text-light-blue font-bold">
              — Oliver Wendell Holmes
            </p>
          </AnimatedReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}