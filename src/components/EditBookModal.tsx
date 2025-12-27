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
  const [formData, setFormData] = useState({
    title: book.title || '',
    author: book.author || '',
    yearRead: book.yearRead || new Date().getFullYear(),
    category: book.category || '',
    microReview: book.microReview || '',
    synopsis: book.synopsis || '',
    personalNotes: book.personalNotes || '', 
    isMustRead: book.isMustRead || false,
    coverImage: book.coverImage || '', 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedData = {
        ...book,
        ...formData,
        coverImage: formData.coverImage || undefined
      };
      await BaseCrudService.update('libri', updatedData);
      onBookUpdated();
    } catch (err) {
      setError('Errore nel salvataggio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      {/* BACKGROUND SCURO COME DA TUO SCREENSHOT */}
      <DialogContent className="max-w-4xl bg-[#1a2b4b] border-none text-white overflow-y-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4">Modifica Libro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* COLONNA SINISTRA: IMMAGINE (3/12 della larghezza) */}
          <div className="md:col-span-4 space-y-4">
            <Label className="text-gray-300 uppercase text-xs font-bold tracking-wider">Copertina</Label>
            <div className="relative aspect-[2/3] w-full bg-[#0f172a] rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group">
              {formData.coverImage ? (
                <>
                  <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button type="button" variant="destructive" size="sm" onClick={() => setFormData({...formData, coverImage: ''})}>
                      <X className="w-4 h-4 mr-2" /> Rimuovi
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-white/20" />
                  <p className="text-xs text-white/40">Nessuna immagine</p>
                </div>
              )}
            </div>
            <label className="flex items-center justify-center w-full py-2 bg-[#4fc3f7] text-[#1a2b4b] rounded font-bold cursor-pointer hover:bg-[#3ba8d4] transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Scegli File
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {/* COLONNA DESTRA: CAMPI TESTO (8/12 della larghezza) */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Titolo</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#0f172a] border-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Autore</Label>
                <Input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="bg-[#0f172a] border-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Anno Letto</Label>
                <Input type="number" value={formData.yearRead} onChange={e => setFormData({...formData, yearRead: parseInt(e.target.value)})} className="bg-[#0f172a] border-none" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Categoria</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#0f172a] border-none" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Micro Recensione</Label>
              <Textarea value={formData.microReview} onChange={e => setFormData({...formData, microReview: e.target.value})} className="bg-[#0f172a] border-none h-20" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Sinossi</Label>
              <Textarea value={formData.synopsis} onChange={e => setFormData({...formData, synopsis: e.target.value})} className="bg-[#0f172a] border-none h-24" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Note Personali</Label>
              <Textarea value={formData.personalNotes} onChange={e => setFormData({...formData, personalNotes: e.target.value})} className="bg-[#0f172a] border-none h-24" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="must" checked={formData.isMustRead} onCheckedChange={val => setFormData({...formData, isMustRead: !!val})} />
              <Label htmlFor="must" className="text-sm">Libro consigliato (Must Read)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
              <Button type="submit" disabled={isLoading} className="bg-[#2d4a53] hover:bg-[#3d6370] px-8">
                {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
