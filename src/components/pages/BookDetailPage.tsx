import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Books } from '@/entities';
import { ArrowLeft, Star, Calendar, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommentsSection from '@/components/CommentsSection';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Books | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    if (!id) return;
    try {
      const bookData = await BaseCrudService.getById<Books>('libri', id);
      setBook(bookData);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
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

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24 px-6 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Libro non trovato
          </h1>
          <Link
            to="/libri"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-paragraph"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla biblioteca
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[100rem] mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/libri"
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground font-paragraph transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna alla biblioteca
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-32"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title || 'Book cover'}
                    className="w-full h-full object-cover"
                    width={600}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-brand-color flex items-center justify-center">
                    <BookOpen className="w-32 h-32 text-foreground/20" />
                  </div>
                )}
                {book.isMustRead && (
                  <div className="absolute top-6 right-6 bg-light-blue text-background px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Star className="w-5 h-5 fill-background" />
                    <span className="font-paragraph text-sm font-semibold">Must Read</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Category Badge */}
              {book.category && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-lg font-paragraph text-sm font-medium">
                    {book.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                {book.title}
              </h1>

              {/* Author */}
              <p className="font-paragraph text-2xl text-secondary mb-6">
                {book.author}
              </p>

              {/* Year Read */}
              {book.yearRead && (
                <div className="flex items-center gap-2 mb-8">
                  <Calendar className="w-5 h-5 text-foreground/50" />
                  <span className="font-paragraph text-base text-foreground/70">
                    Letto nel {book.yearRead}
                  </span>
                </div>
              )}

              {/* Micro Review */}
              {book.microReview && (
                <div className="bg-white/5 border-l-4 border-primary rounded-r-xl p-6 mb-8">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Micro-Recensione
                  </h2>
                  <p className="font-paragraph text-lg text-foreground/90 italic leading-relaxed">
                    "{book.microReview}"
                  </p>
                </div>
              )}

              {/* Synopsis */}
              {book.synopsis && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Sinossi
                  </h2>
                  <p className="font-paragraph text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                    {book.synopsis}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-paragraph text-sm text-foreground/50 mb-1">
                      Aggiunto il
                    </p>
                    <p className="font-paragraph text-base text-foreground">
                      {book._createdDate
                        ? new Date(book._createdDate).toLocaleDateString('it-IT')
                        : 'N/A'}
                    </p>
                  </div>
                  {book._updatedDate && (
                    <div>
                      <p className="font-paragraph text-sm text-foreground/50 mb-1">
                        Aggiornato il
                      </p>
                      <p className="font-paragraph text-base text-foreground">
                        {new Date(book._updatedDate).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-24 px-6 bg-primary/20 border-t border-secondary/20">
        <div className="max-w-[100rem] mx-auto">
          <CommentsSection bookId={id || ''} bookTitle={book.title || ''} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
