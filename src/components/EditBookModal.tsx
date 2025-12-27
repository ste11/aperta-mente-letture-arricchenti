import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Books } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Upload, X, ImageIcon } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface EditBookModalProps {
  book: Books;
  onClose: () => void;
  onBookUpdated: () => void;
}

export default function EditBookModal({ book, onClose, onBookUpdated }: EditBookModalProps) {
  // Inizializziamo lo stato con i dati del libro passato come prop
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    yearRead: book.yearRead || new Date().getFullYear(),
    category: book.category || '',
    microReview: book.microReview || '',
    synopsis: book.synopsis || '',
    isMustRead: book.isMustRead || false,
    coverImage: book.coverImage || '', // Recupera l'immagine esistente
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'immagine è troppo grande (max 2MB)');
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
      const updatedBook: Books = {
        ...book,
        title: formData.title,
        author: formData.author,
        yearRead: formData.yearRead,
        category: formData.category || undefined,
        microReview: formData.microReview || undefined,
        synopsis: formData.synopsis || undefined,
        isMustRead: formData.isMustRead,
        coverImage: formData.coverImage || undefined,
      };

      await BaseCrudService.update('libri', updatedBook);
      onBookUpdated();
    } catch (err) {
      setError('Errore durante il salvataggio');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0b0e14] border border-white/10 overflow-y-auto max-h-[90vh] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#4fc3f7]">
            Modifica Libro
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="bg-red-900/20 border-red-900 text-red-400 mb-4">
            <AlertCircle className="h-4 w-4" />
            <span className="ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SEZIONE IMMAGINE - POSIZIONATA IN ALTO PER ESSERE VISIBILE */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-[#4fc3f7] font-semibold mb-3 block">Copertina Libro</Label>
            <div className="flex items-center gap-6">
              {/* Box Anteprima */}
              <div className="relative h-48 w-32 flex-shrink-0 bg-black/40 rounded-md border-2 border-dashed border-white/20 overflow-hidden group">
                {formData.coverImage ? (
                  <>
                    <img 
                      src={formData.coverImage} 
                      alt="Preview" 
                      className="h-full w-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-white/40">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-[10px] uppercase">Nessuna foto</span>
                  </div>
                )}
              </div>

              {/* Tasto Caricamento */}
              <div className="flex-1 space-y-3">
                <p className="text-sm text-white/60">
                  Carica una nuova immagine per sostituire quella attuale (Max 2MB).
                </p>
                <label className="inline-flex items-center gap-2 bg-[#4fc3f7] hover:bg-[#4fc3f7]/80 text-black px-4 py-2 rounded-md cursor-pointer font-bold transition-all shadow-lg">
                  <Upload className="w-4 h-4" />
                  Scegli Immagine
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ALTRI CAMPI DEL FORM */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Titolo *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-black/40 border-white/20 focus:border-[#4fc3f7]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Autore *</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="bg-black/40 border-white/20 focus:border-[#4fc3f7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Anno Letto</Label>
              <Input
                type="number"
                value={formData.yearRead}
                onChange={(e) => setFormData({ ...formData, yearRead: parseInt(e.target.value) })}
                className="bg-black/40 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Categoria</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-black/40 border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Micro Recensione</Label>
            <Textarea
              value={formData.microReview}
              onChange={(e) => setFormData({ ...formData, microReview: e.target.value })}
              className="bg-black/40 border-white/20 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Sinossi</Label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              className="bg-black/40 border-white/20 min-h-[120px]"
            />
          </div>

          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-md border border-white/10">
            <Checkbox
              id="isMustRead"
              checked={formData.isMustRead}
              onCheckedChange={(checked) => setFormData({ ...formData, isMustRead: checked as boolean })}
            />
            <Label htmlFor="isMustRead" className="text-white/80 cursor-pointer">
              Segna come Libro Consigliato (Must Read)
            </Label>
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="border-white/20 hover:bg-white/10">
              Annulla
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#4fc3f7] hover:bg-[#4fc3f7]/80 text-black font-bold px-8">
              {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
