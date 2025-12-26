import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Books, ThematicCategories } from '@/entities';
import { Star, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LibriPage() {
  const [books, setBooks] = useState<Books[]>([]);
  const [categories, setCategories] = useState<ThematicCategories[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mustReadBooks, setMustReadBooks] = useState<Books[]>([]);
  const [currentMustReadIndex, setCurrentMustReadIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Scroll to must-read section if hash is present
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

      // Sort categories by orderIndex
      const sortedCategories = categoriesData.items.sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );

      setBooks(booksData.items);
      setCategories(sortedCategories.filter((cat) => cat.isActive));
      setMustReadBooks(booksData.items.filter((book) => book.isMustRead).slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks =
    selectedCategory === 'all'
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const selectedCategoryData = categories.find(
    (cat) => cat.categoryKey === selectedCategory
  );

  const nextMustRead = () => {
    setCurrentMustReadIndex((prev) => (prev + 1) % mustReadBooks.length);
  };

  const prevMustRead = () => {
    setCurrentMustReadIndex(
      (prev) => (prev - 1 + mustReadBooks.length) % mustReadBooks.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-paragraph text-foreground/70">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-[100rem] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-6"
          >
            La Biblioteca
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-paragraph text-xl text-foreground/80 max-w-3xl mx-auto"
          >
            Una collezione curata di {books.length} libri letti dal 2020 al 2025.
            Esplora per categoria o scopri i must read selezionati.
          </motion.p>
        </div>
      </section>

      {/* Must Read Carousel */}
      {mustReadBooks.length > 0 && (
        <section id="must-read" className="py-16 px-6 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="max-w-[100rem] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="w-8 h-8 text-light-blue fill-light-blue" />
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                  Must Read
                </h2>
                <Star className="w-8 h-8 text-light-blue fill-light-blue" />
              </div>
              <p className="font-paragraph text-lg text-foreground/70">
                I 5 libri più influenti della collezione
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Book Cover */}
                  <motion.div
                    key={currentMustReadIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl"
                  >
                    {mustReadBooks[currentMustReadIndex].coverImage ? (
                      <Image
                        src={mustReadBooks[currentMustReadIndex].coverImage!}
                        alt={mustReadBooks[currentMustReadIndex].title || 'Book cover'}
                        className="w-full h-full object-cover"
                        width={400}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-brand-color flex items-center justify-center">
                        <span className="font-heading text-6xl text-foreground/20">?</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Book Info */}
                  <motion.div
                    key={`info-${currentMustReadIndex}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-light-blue/20 text-light-blue rounded-full font-paragraph text-sm font-medium mb-4">
                        {mustReadBooks[currentMustReadIndex].category}
                      </span>
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                      {mustReadBooks[currentMustReadIndex].title}
                    </h3>
                    <p className="font-paragraph text-xl text-secondary mb-6">
                      {mustReadBooks[currentMustReadIndex].author}
                    </p>
                    {mustReadBooks[currentMustReadIndex].microReview && (
                      <div className="bg-white/5 border-l-4 border-primary rounded-r-lg p-4 mb-6">
                        <p className="font-paragraph text-base text-foreground/90 italic leading-relaxed">
                          "{mustReadBooks[currentMustReadIndex].microReview}"
                        </p>
                      </div>
                    )}
                    {mustReadBooks[currentMustReadIndex].yearRead && (
                      <p className="font-paragraph text-sm text-foreground/60">
                        Letto nel {mustReadBooks[currentMustReadIndex].yearRead}
                      </p>
                    )}
                    <Link
                      to={`/libro/${mustReadBooks[currentMustReadIndex]._id}`}
                      className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-paragraph font-medium hover:bg-primary/90 transition-colors"
                    >
                      Scopri di più
                    </Link>
                  </motion.div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
                  <button
                    onClick={prevMustRead}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all"
                    aria-label="Previous book"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex gap-2">
                    {mustReadBooks.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMustReadIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentMustReadIndex
                            ? 'bg-primary w-8'
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to book ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextMustRead}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all"
                    aria-label="Next book"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-16 px-6">
        <div className="max-w-[100rem] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Filter className="w-6 h-6 text-light-blue" />
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Filtra per Categoria
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-paragraph font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10'
              }`}
            >
              Tutti ({books.length})
            </button>
            {categories.map((category) => {
              const count = books.filter((book) => book.category === category.categoryKey).length;
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category.categoryKey || 'all')}
                  className={`px-6 py-3 rounded-lg font-paragraph font-medium transition-all ${
                    selectedCategory === category.categoryKey
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10'
                  }`}
                >
                  {category.categoryName} ({count})
                </button>
              );
            })}
          </div>

          {/* Category Description */}
          {selectedCategoryData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12"
            >
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
                {selectedCategoryData.categoryName}
              </h3>
              <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
                {selectedCategoryData.categoryDescription}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Books Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-foreground/60">
                Nessun libro trovato in questa categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/libro/${book._id}`}
                    className="group block bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    {/* Book Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/20 to-brand-color/20">
                      {book.coverImage ? (
                        <Image
                          src={book.coverImage}
                          alt={book.title || 'Book cover'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          width={300}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-6xl text-foreground/10">?</span>
                        </div>
                      )}
                      {book.isMustRead && (
                        <div className="absolute top-3 right-3 bg-light-blue text-background px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4 fill-background" />
                          <span className="font-paragraph text-xs font-semibold">Must Read</span>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-light-blue transition-colors">
                        {book.title}
                      </h3>
                      <p className="font-paragraph text-sm text-secondary mb-3">
                        {book.author}
                      </p>
                      {book.category && (
                        <span className="inline-block px-2 py-1 bg-primary/20 text-primary rounded text-xs font-paragraph font-medium">
                          {book.category}
                        </span>
                      )}
                      {book.yearRead && (
                        <p className="font-paragraph text-xs text-foreground/50 mt-3">
                          {book.yearRead}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
