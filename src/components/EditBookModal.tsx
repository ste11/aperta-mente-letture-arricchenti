import { useState, useEffect } from 'react';
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
  // Usiamo 'coverUrl' come nome standard per coerenza con l'AddBookModal
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    yearRead: book.yearRead || new Date().getFullYear(),
    category: book.category || '',
    microReview: book.microReview || '',
    synopsis: book.synopsis || '',
    isMustRead: book.isMustRead || false,
    coverUrl: book.coverUrl || '', // Qui leggiamo il valore esistente dal database
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Funzione per gestire il caricamento della nuova immagine
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) { // Limite cautelativo 1.5MB per Base64
        setError('L\'immagine è troppo grande. Massimo 1.5MB.');
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
      
      // Costruiamo l'oggetto aggiornato assicurandoci che i nomi dei campi siano corretti
      const updatedBook: Partial<Books> = {
        title: formData.title,
        author: formData.author,
        yearRead: formData.yearRead,
        category: formData.category || undefined,
        microReview: formData.microReview || undefined,
        synopsis: formData.synopsis || undefined,
        isMustRead: formData.isMustRead,
        coverUrl: formData.coverUrl || undefined, // Deve coincidere con il nome nel DB
      };

      // Nota: Passiamo l'ID separatamente se il tuo BaseCrudService lo richiede, 
      // altrimenti passiamo l'intero oggetto. Qui usiamo la forma standard:
      await BaseCrudService.update('libri', book._id, updatedBook);
      
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
          <Alert className="border-destructive bg-red-50 mb-4">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sezione Caricamento/Modifica Immagine */}
          <div className="space-y-2">
            <Label className="font-paragraph font-medium text-light-blue block">
              Copertina Libro
            </Label>
            <div className="flex items-start gap-4">
              <div className="relative group">
                {formData.coverUrl ? (
                  <div className="relative h-48 w-32 overflow-hidden rounded-md border border-secondary/40 shadow-lg">
                    {/* Usiamo <img> standard invece di <Image /> per maggiore compatibilità Base64 */}
                    <img 
                      src={formData.coverUrl} 
                      alt="Anteprima copertina" 
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-32 border-2 border-dashed border-secondary/40 rounded-md cursor-pointer hover:border-brand-color transition-colors bg-background/50">
                    <Upload className="w-8 h-8 text-secondary/60" />
                    <span className="text-xs text-secondary/60 mt-2 text-center px-2">Cambia immagine</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </label>
                )}
              </div>
              <div className="text-xs text-secondary/70 pt-2 space-y-1">
                <p>• Trascina un file o clicca per caricarlo.</p>
                <p>• L'immagine verrà salvata automaticamente nel database.</p>
                <p>• Max 1.5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Titolo *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isLoading}
                className="bg-background border-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Autore *</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                disabled={isLoading}
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
                disabled={isLoading}
                className="bg-background border-secondary/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-light-blue font-medium">Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isLoading}
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
              disabled={isLoading}
              className="bg-background border-secondary/40"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-light-blue font-medium">Sinossi</Label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              rows={3}
              disabled={isLoading}
              className="bg-background border-secondary/40"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isMustRead"
              checked={formData.isMustRead}
              onCheckedChange={(checked) => setFormData({ ...formData, isMustRead: checked as boolean })}
              disabled={isLoading}
            />
            <Label htmlFor="isMustRead" className="text-light-blue cursor-pointer font-medium">
              Libro consigliato (Must Read)
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-6">
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
