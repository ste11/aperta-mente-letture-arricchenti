import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Books } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface AddBookModalProps {
  onClose: () => void;
  onBookAdded: () => void;
}

export default function AddBookModal({ onClose, onBookAdded }: AddBookModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    yearRead: new Date().getFullYear(),
    category: '',
    microReview: '',
    synopsis: '',
    isMustRead: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Titolo e autore sono obbligatori');
      return;
    }

    try {
      setIsLoading(true);
      const newBook: Books = {
        _id: crypto.randomUUID(),
        title: formData.title,
        author: formData.author,
        yearRead: formData.yearRead,
        category: formData.category || undefined,
        microReview: formData.microReview || undefined,
        synopsis: formData.synopsis || undefined,
        isMustRead: formData.isMustRead,
      };

      await BaseCrudService.create('libri', newBook);
      onBookAdded();
    } catch (err) {
      setError('Errore durante l\'aggiunta del libro');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-primary border border-secondary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-light-blue">
            Aggiungi Nuovo Libro
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-destructive bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-paragraph font-medium text-light-blue block mb-2">
                Titolo *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Titolo del libro"
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
              />
            </div>

            <div>
              <Label className="font-paragraph font-medium text-light-blue block mb-2">
                Autore *
              </Label>
              <Input
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Nome dell'autore"
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-paragraph font-medium text-light-blue block mb-2">
                Anno Letto
              </Label>
              <Input
                type="number"
                value={formData.yearRead}
                onChange={(e) =>
                  setFormData({ ...formData, yearRead: parseInt(e.target.value) })
                }
                placeholder="Anno"
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
              />
            </div>

            <div>
              <Label className="font-paragraph font-medium text-light-blue block mb-2">
                Categoria
              </Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Categoria"
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
              />
            </div>
          </div>

          <div>
            <Label className="font-paragraph font-medium text-light-blue block mb-2">
              Micro Recensione
            </Label>
            <Textarea
              value={formData.microReview}
              onChange={(e) =>
                setFormData({ ...formData, microReview: e.target.value })
              }
              placeholder="Una breve recensione del libro"
              disabled={isLoading}
              rows={2}
              className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
            />
          </div>

          <div>
            <Label className="font-paragraph font-medium text-light-blue block mb-2">
              Sinossi
            </Label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) =>
                setFormData({ ...formData, synopsis: e.target.value })
              }
              placeholder="Descrizione completa del libro"
              disabled={isLoading}
              rows={3}
              className="bg-background border-secondary/40 text-foreground placeholder-secondary/60"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMustRead"
              checked={formData.isMustRead}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isMustRead: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label
              htmlFor="isMustRead"
              className="font-paragraph font-medium text-light-blue cursor-pointer"
            >
              Libro consigliato (Must Read)
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-brand-color hover:bg-brand-color/90 text-white"
            >
              {isLoading ? 'Aggiunta in corso...' : 'Aggiungi Libro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
