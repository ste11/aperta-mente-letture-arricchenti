import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { Comments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface CommentsSectionProps {
  bookId: string;
  bookTitle: string;
}

export default function CommentsSection({ bookId, bookTitle }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    commentText: '',
    rating: 5,
  });

  useEffect(() => {
    loadComments();
  }, [bookId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await BaseCrudService.getAll<Comments>('commenti');
      // Filter comments for this book (you might want to add a bookId field to comments in the future)
      setComments(response.items || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitSuccess(false);

    if (!formData.visitorName.trim() || !formData.commentText.trim()) {
      setError('Nome e commento sono obbligatori');
      return;
    }

    try {
      setIsSubmitting(true);
      const newComment: Comments = {
        _id: crypto.randomUUID(),
        visitorName: formData.visitorName,
        visitorEmail: formData.visitorEmail || undefined,
        commentText: formData.commentText,
        rating: formData.rating,
        commentDate: new Date(),
      };

      await BaseCrudService.create('commenti', newComment);
      setSubmitSuccess(true);
      setFormData({
        visitorName: '',
        visitorEmail: '',
        commentText: '',
        rating: 5,
      });

      // Reload comments
      await loadComments();

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setError('Errore durante l\'invio del commento');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Comment Form */}
      <Card className="p-6 bg-primary/50 border-secondary/20">
        <h3 className="text-xl font-heading font-bold text-foreground mb-4">
          Lascia un Commento
        </h3>

        {error && (
          <Alert className="mb-4 border-destructive bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-700 ml-2">
              Grazie! Il tuo commento è stato inviato con successo.
            </span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-paragraph font-medium text-foreground mb-2">
                Nome *
              </label>
              <Input
                value={formData.visitorName}
                onChange={(e) =>
                  setFormData({ ...formData, visitorName: e.target.value })
                }
                placeholder="Il tuo nome"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-paragraph font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.visitorEmail}
                onChange={(e) =>
                  setFormData({ ...formData, visitorEmail: e.target.value })
                }
                placeholder="La tua email (opzionale)"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-paragraph font-medium text-foreground mb-2">
              Valutazione
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  disabled={isSubmitting}
                  className="focus:outline-none transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-secondary'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-paragraph font-medium text-foreground mb-2">
              Commento *
            </label>
            <Textarea
              value={formData.commentText}
              onChange={(e) =>
                setFormData({ ...formData, commentText: e.target.value })
              }
              placeholder="Condividi la tua opinione su questo libro..."
              disabled={isSubmitting}
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.visitorName.trim() || !formData.commentText.trim()}
            className="w-full bg-brand-color hover:bg-brand-color/90 text-white font-paragraph font-medium"
          >
            {isSubmitting ? 'Invio in corso...' : 'Invia Commento'}
          </Button>
        </form>
      </Card>

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-heading font-bold text-foreground mb-4">
          Commenti ({comments.length})
        </h3>

        {isLoading ? (
          <p className="text-secondary font-paragraph">Caricamento commenti...</p>
        ) : comments.length === 0 ? (
          <Card className="p-6 bg-primary/50 border-secondary/20 text-center">
            <p className="text-secondary font-paragraph">
              Nessun commento ancora. Sii il primo a commentare!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card
                key={comment._id}
                className="p-4 bg-primary/50 border-secondary/20 hover:border-secondary/40 transition"
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h4 className="font-heading font-bold text-foreground">
                      {comment.visitorName || 'Anonimo'}
                    </h4>
                    {comment.visitorEmail && (
                      <p className="text-xs text-secondary font-paragraph">
                        {comment.visitorEmail}
                      </p>
                    )}
                  </div>

                  {comment.rating && (
                    <div className="flex gap-1">
                      {Array.from({ length: comment.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-foreground font-paragraph mb-2">
                  {comment.commentText}
                </p>

                {comment.commentDate && (
                  <p className="text-xs text-secondary font-paragraph">
                    {format(new Date(comment.commentDate), 'dd MMMM yyyy HH:mm', {
                      locale: it,
                    })}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
