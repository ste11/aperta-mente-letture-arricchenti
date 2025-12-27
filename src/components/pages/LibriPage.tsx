import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Books, ThematicCategories } from '@/entities';
import { Star, Filter, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LibriPage() {
  const [books, setBooks] = useState<Books[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<ThematicCategories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMustReadIndex, setCurrentMustReadIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#must-read') {
      setTimeout(() => {
        document.getElementById('must-read')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const loadData = async () => {
    try {
      const [booksData, categoriesData] = await Promise.all([
        BaseCrudService.getAll<Books>('libri'),
        BaseCrudService.getAll<ThematicCategories>('categorietematiche'),
      ]);

      setBooks(booksData.items || []);
      setCategoryMeta(categoriesData.items || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGICA DINAMICA PER LE CATEGORIE ---
  // Estraiamo le categorie reali dai libri e contiamoli
  const dynamicCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach(book => {
      const cat = book.category || 'Generale';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.keys(counts).map(catKey => {
      // Cerchiamo se esiste un nome "bello" e una descrizione nella tabella categorie
      const meta = categoryMeta.find(c => c.categoryKey === catKey || c.categoryName === catKey);
      return {
        key: catKey,
        name: meta ? meta.categoryName : catKey,
        count: counts[catKey],
        description: meta ? meta.categoryDescription : "Esplora i testi dedicati a quest'area di approfondimento."
      };
    }).sort((a, b) => b.count - a.count); // Ordina per numero di libri
  }, [books, categoryMeta]);

  // Libri filtrati
  const filteredBooks = useMemo(() => {
    return selectedCategory === 'all'
      ? books
      : books.filter((book) => (book.category || 'Generale') === selectedCategory);
  }, [books, selectedCategory]);

  // Must Read dinamici
  const mustReadBooks = useMemo(() => {
    return books.filter((book) => book.isMustRead).slice(0, 5);
  }, [books]);

  const selectedCategoryInfo = dynamicCategories.find(c => c.key === selectedCategory);

  const nextMustRead = () => setCurrentMustReadIndex((prev) => (prev + 1) % mustReadBooks.length);
  const prevMustRead = () => setCurrentMustReadIndex((prev) => (prev - 1 + mustReadBooks.length) % mustReadBooks.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-[100rem] mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6">La Biblioteca</h1>
          <p className="font-paragraph text-xl text-foreground/80 max-w-3xl mx-auto">
            Una collezione curata di {books.length} libri. Ogni titolo è un tassello del percorso iniziato nel 2020.
          </p>
        </div>
      </section>

      {/* Must Read Carousel (Dinamico) */}
      {mustReadBooks.length > 0 && (
        <section id="must-read" className="py-16 px-6 bg-primary/5">
          <div className="max-w-5xl mx-auto">
             <div className="flex items-center justify-center gap-3 mb-12">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <h2 className="font-heading text-3xl md:text-4xl font-bold">Must Read</h2>
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
                    {mustReadBooks[currentMustReadIndex].coverImage ? (
                      <img src={mustReadBooks[currentMustReadIndex].coverImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center"><BookOpen /></div>
                    )}
                  </div>
                  <div>
                    <span className="bg-light-blue/20 text-light-blue px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block uppercase">
                      {mustReadBooks[currentMustReadIndex].category}
                    </span>
                    <h3 className="text-3xl font-bold mb-2">{mustReadBooks[currentMustReadIndex].title}</h3>
                    <p className="text-xl text-secondary mb-6">{mustReadBooks[currentMustReadIndex].author}</p>
                    <p className="italic text-foreground/80 border-l-4 border-primary pl-4 mb-8">
                      "{mustReadBooks[currentMustReadIndex].microReview}"
                    </p>
                    <Link to={`/libro/${mustReadBooks[currentMustReadIndex]._id}`} className="bg-primary text-white px-6 py-3 rounded-lg font-bold">Scopri di più</Link>
                  </div>
                </div>
                
                {/* Carousel Nav */}
                <div className="flex justify-between mt-8 items-center border-t border-white/10 pt-8">
                    <Button variant="ghost" onClick={prevMustRead}><ChevronLeft /></Button>
                    <div className="flex gap-2">
                        {mustReadBooks.map((_, i) => (
                            <div key={i} className={`h-2 rounded-full transition-all ${i === currentMustReadIndex ? 'bg-primary w-6' : 'bg-white/20 w-2'}`} />
                        ))}
                    </div>
                    <Button variant="ghost" onClick={nextMustRead}><ChevronRight /></Button>
                </div>
              </div>
          </div>
        </section>
      )}

      {/* Dinamyc Category Filter */}
      <section className="py-16 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="w-6 h-6 text-light-blue" />
            <h2 className="font-heading text-2xl font-semibold">Esplora per Categoria</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === 'all' ? 'bg-light-blue text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
            >
              Tutti ({books.length})
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat.key ? 'bg-light-blue text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Dinamyc Description */}
          {selectedCategory !== 'all' && selectedCategoryInfo && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 p-6 rounded-xl border border-white/10 mb-12">
              <h3 className="text-xl font-bold text-light-blue mb-2">{selectedCategoryInfo.name}</h3>
              <p className="text-foreground/70">{selectedCategoryInfo.description}</p>
            </motion.div>
          )}

          {/* Books Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Link key={book._id} to={`/libro/${book._id}`} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-light-blue/50 transition-all">
                <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
                  {book.coverImage ? (
                    <img src={book.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">?</div>
                  )}
                  {book.isMustRead && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded">MUST READ</div>}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg line-clamp-1 group-hover:text-light-blue transition-colors">{book.title}</h4>
                  <p className="text-sm text-secondary">{book.author}</p>
                  <div className="mt-4 flex justify-between items-center text-[10px] opacity-50 uppercase tracking-widest">
                    <span>{book.category || 'Generale'}</span>
                    <span>{book.yearRead}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
