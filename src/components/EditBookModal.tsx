import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Books } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Image } from '@/components/ui/image';

interface EditBookModalProps {
  book: Books;
  onClose: () => void;
  onBookUpdated: () => void;
}

export default function EditBookModal({ book, onClose, onBookUpdated }: EditBookModalProps) {
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    yearRead: book.yearRead || new Date().getFullYear(),
    category: book.category || '',
    microReview: book.microReview || '',
    synopsis: book.synopsis || '',
    isMustRead: book.isMustRead || false,
    coverUrl: book.coverImage || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Funzione per gestire il caricamento dell'immagine
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite opzionale di 2MB
        setError('L\'immagine è troppo grande. Massimo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, coverUrl: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Titolo e autore sono obbligatori');
      return;
    }

    try {
      setIsLoading(true);
      const updatedBook: Books = {
        _id: book._id,
        title: formData.title,
        author: formData.author,
        yearRead: formData.yearRead,
        category: formData.category || undefined,
        microReview: formData.microReview || undefined,
        synopsis: formData.synopsis || undefined,
        isMustRead: formData.isMustRead,
        coverImage: formData.coverUrl || undefined,
      };

      await BaseCrudService.update('libri', updatedBook);
      onBookUpdated();
    } catch (err) {
      setError('Errore durante l\'aggiornamento del libro');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-primary border border-secondary/30 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-light-blue">
            Modifica Libro
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-destructive bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sezione Caricamento Immagine */}
          <div className="space-y-2">
            <Label className="font-paragraph font-medium text-light-blue block">
              Copertina Libro
            </Label>
            <div className="flex items-start gap-4">
              <div className="relative group">
                {formData.coverUrl ? (
                  <div className="relative h-40 w-28 overflow-hidden rounded-md border border-secondary/40">
                    <Image src={formData.coverUrl} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 w-28 border-2 border-dashed border-secondary/40 rounded-md cursor-pointer hover:border-brand-color transition-colors bg-background">
                    <Upload className="w-6 h-6 text-secondary/60" />
                    <span className="text-[10px] text-secondary/60 mt-2 text-center px-1">Carica copertina</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </label>
                )}
              </div>
              <div className="text-xs text-secondary/70 self-center">
                <p>Formati supportati: JPG, PNG, WebP.</p>
                <p>Dimensione massima consigliata: 1MB.</p>
              </div>
            </div>
          </div>

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
                className="bg-background border-secondary/40 text-foreground"
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
                className="bg-background border-secondary/40 text-foreground"
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
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground"
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
                placeholder="Esempio: Leadership"
                disabled={isLoading}
                className="bg-background border-secondary/40 text-foreground"
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
              className="bg-background border-secondary/40 text-foreground"
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
              placeholder="Descrizione completa"
              disabled={isLoading}
              rows={3}
              className="bg-background border-secondary/40 text-foreground"
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
              {isLoading ? 'Aggiornamento in corso...' : 'Aggiorna Libro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
