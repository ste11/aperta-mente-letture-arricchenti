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

interface EditBookModalProps {
  book: Books;
  onClose: () => void;
  onBookUpdated: () => void;
}

export default function EditBookModal({ book, onClose, onBookUpdated }: EditBookModalProps) {
  // Usiamo coverImage coerentemente con il tuo database
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    yearRead: book.yearRead || new Date().getFullYear(),
    category: book.category || '',
    microReview: book.microReview || '',
    synopsis: book.synopsis || '',
    isMustRead: book.isMustRead || false,
    coverImage: book.coverImage || '', // Carica l'immagine esistente
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Immagine troppo grande (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, coverImage: '' });
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
      
      // Prepariamo l'oggetto con coverImage
      const updatedBook: Books = {
        ...book, // Mantiene l'_id originale e altri campi
        title: formData.title,
        author: formData.author,
        yearRead: formData.yearRead,
        category: formData.category || undefined,
        microReview: formData.microReview || undefined,
        synopsis: formData.synopsis || undefined,
        isMustRead: formData.isMustRead,
        coverImage: formData.coverImage || undefined,
      };

      // Chiamata di update (usiamo l'oggetto completo che contiene l'_id)
      await BaseCrudService.update('libri', updatedBook);
      
      onBookUpdated();
    } catch (err) {
      setError('Errore durante l\'aggiornamento');
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
          <Alert className="border-destructive bg-red-50 mb-4">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SEZIONE IMMAGINE COPERTINA */}
          <div className="space-y-2">
            <Label className="font-paragraph font-medium text-light-blue block">
              Copertina Libro
            </Label>
            <div className="flex items-start gap-4">
              <div className="relative group">
                {formData.coverImage ? (
                  <div className="relative h-48 w-32 overflow-hidden rounded-md border border-secondary/40 shadow-xl">
                    {/* L'uso di img nativo assicura che il base64 venga letto correttamente */}
                    <img 
                      src={formData.coverImage} 
                      alt="Copertina" 
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-32 border-2 border-dashed border-secondary/40 rounded-md cursor-pointer hover:border-brand-color transition-colors bg-background">
                    <Upload className="w-6 h-6 text-secondary/60" />
                    <span className="text-[10px] text-secondary/60 mt-2 text-center">Carica foto</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              <div className="text-xs text-secondary/60 self-center">
                <p>Clicca sulla copertina per cambiarla.</p>
                <p>Verrà salvata direttamente nel database.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Titolo *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background border-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Autore *</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="bg-background border-secondary/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Anno Letto</Label>
              <Input
                type="number"
                value={formData.yearRead}
                onChange={(e) => setFormData({ ...formData, yearRead: parseInt(e.target.value) })}
                className="bg-background border-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-background border-secondary/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-light-blue font-medium">Micro Recensione</Label>
            <Textarea
              value={formData.microReview}
              onChange={(e) => setFormData({ ...formData, microReview: e.target.value })}
              rows={2}
              className="bg-background border-secondary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-light-blue font-medium">Sinossi</Label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              rows={3}
              className="bg-background border-secondary/40"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMustRead"
              checked={formData.isMustRead}
              onCheckedChange={(checked) => setFormData({ ...formData, isMustRead: checked as boolean })}
            />
            <Label htmlFor="isMustRead" className="text-light-blue cursor-pointer">
              Libro consigliato (Must Read)
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-brand-color hover:bg-brand-color/90">
              {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
