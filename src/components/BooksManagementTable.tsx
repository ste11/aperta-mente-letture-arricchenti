import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Books } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Edit2, ChevronDown, ChevronUp, Upload, X, ImageIcon } from 'lucide-react';

interface BooksManagementTableProps {
  books: Books[];
  onBookDeleted: () => void;
  onBooksUpdated: () => void;
}

export default function BooksManagementTable({
  books,
  onBookDeleted,
  onBooksUpdated,
}: BooksManagementTableProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Books | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Books | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      setIsLoading(true);
      await BaseCrudService.delete('libri', bookToDelete._id);
      setBookToDelete(null);
      onBookDeleted();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per gestire il cambio immagine Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingBook) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingBook({ ...editingBook, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;
    try {
      setIsLoading(true);
      await BaseCrudService.update('libri', {
        _id: editingBook._id,
        title: editingBook.title,
        author: editingBook.author,
        yearRead: editingBook.yearRead,
        category: editingBook.category,
        microReview: editingBook.microReview,
        synopsis: editingBook.synopsis,
        isMustRead: editingBook.isMustRead,
        personalNotes: editingBook.personalNotes,
        coverImage: editingBook.coverImage, // AGGIUNTO IL CAMPO IMMAGINE
        quotes: editingBook.quotes,
        excerpts: editingBook.excerpts,
      });
      setEditingBook(null);
      onBooksUpdated();
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedBooks = books.reduce(
    (acc, book) => {
      const year = book.yearRead || 'Senza anno';
      if (!acc[year]) acc[year] = [];
      acc[year].push(book);
      return acc;
    },
    {} as Record<string | number, Books[]>
  );

  const sortedYears = Object.keys(groupedBooks).sort((a, b) => {
    const aNum = parseInt(String(a));
    const bNum = parseInt(String(b));
    return bNum - aNum;
  });

  return (
    <div className="space-y-4">
      {sortedYears.map((year) => (
        <div key={year} className="space-y-2">
          <h3 className="text-lg font-heading font-bold text-foreground">
            Anno {year} ({groupedBooks[year].length} libri)
          </h3>
          <div className="space-y-2">
            {groupedBooks[year].map((book) => (
              <Card key={book._id} className="p-4 bg-primary/50 border-secondary/20 hover:border-secondary/40 transition">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedBookId(expandedBookId === book._id ? null : book._id)}>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-foreground">{book.title}</h4>
                    <p className="text-secondary font-paragraph text-sm">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditingBook(book); }} className="text-light-blue hover:text-light-blue hover:bg-secondary/20">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setBookToDelete(book); }} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedBookId === book._id ? <ChevronUp className="w-4 h-4 text-secondary" /> : <ChevronDown className="w-4 h-4 text-secondary" />}
                  </div>
                </div>
                {expandedBookId === book._id && (
                  <div className="mt-4 pt-4 border-t border-secondary/20 space-y-2">
                    {book.coverImage && <img src={book.coverImage} alt="Cover" className="h-32 w-24 object-cover rounded mb-2 border border-secondary/20" />}
                    {book.category && <p className="text-sm"><span className="font-bold text-secondary">Categoria:</span> {book.category}</p>}
                    {book.microReview && <p className="text-sm"><span className="font-bold text-secondary">Recensione:</span> {book.microReview}</p>}
                    {book.personalNotes && <p className="text-sm"><span className="font-bold text-secondary">Note Personali:</span> {book.personalNotes}</p>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Dialog */}
      {editingBook && (
        <Dialog open={!!editingBook} onOpenChange={() => setEditingBook(null)}>
          <DialogContent className="max-w-2xl bg-[#1e293b] border border-secondary/30 overflow-y-auto max-h-[90vh] text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading font-bold text-light-blue">Modifica Libro</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* --- SEZIONE IMMAGINE --- */}
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <label className="block text-sm font-medium text-light-blue mb-2">Copertina Libro</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-40 w-28 bg-black/40 rounded border border-white/10 overflow-hidden">
                    {editingBook.coverImage ? (
                      <>
                        <img src={editingBook.coverImage} className="w-full h-full object-cover" alt="Preview" />
                        <button onClick={() => setEditingBook({...editingBook, coverImage: ''})} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full"><X className="w-3 h-3 text-white" /></button>
                      </>
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-white/20"><ImageIcon /></div>
                    )}
                  </div>
                  <label className="bg-light-blue/20 hover:bg-light-blue/30 text-light-blue px-4 py-2 rounded cursor-pointer text-sm font-bold transition-all border border-light-blue/30">
                    <Upload className="inline-block w-4 h-4 mr-2" /> Carica Foto
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* --- ALTRI CAMPI --- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-blue mb-1">Titolo</label>
                  <Input value={editingBook.title || ''} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} className="bg-background border-secondary/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-blue mb-1">Autore</label>
                  <Input value={editingBook.author || ''} onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} className="bg-background border-secondary/40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-light-blue mb-1">Anno Letto</label>
                  <Input type="number" value={editingBook.yearRead || ''} onChange={(e) => setEditingBook({ ...editingBook, yearRead: parseInt(e.target.value) })} className="bg-background border-secondary/40" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-light-blue mb-1">Categoria</label>
                  <Input value={editingBook.category || ''} onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })} className="bg-background border-secondary/40" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-blue mb-1">Micro Recensione</label>
                <Textarea value={editingBook.microReview || ''} onChange={(e) => setEditingBook({ ...editingBook, microReview: e.target.value })} rows={2} className="bg-background border-secondary/40" />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-blue mb-1">Sinossi</label>
                <Textarea value={editingBook.synopsis || ''} onChange={(e) => setEditingBook({ ...editingBook, synopsis: e.target.value })} rows={3} className="bg-background border-secondary/40" />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-blue mb-1">Note Personali</label>
                <Textarea value={editingBook.personalNotes || ''} onChange={(e) => setEditingBook({ ...editingBook, personalNotes: e.target.value })} rows={2} className="bg-background border-secondary/40" />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingBook(null)} disabled={isLoading}>Annulla</Button>
                <Button type="button" onClick={handleUpdateBook} disabled={isLoading} className="bg-brand-color hover:bg-brand-color/90 text-white">
                  {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AlertDialog per eliminazione resta invariato */}
      {bookToDelete && (
        <AlertDialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
          <AlertDialogContent className="bg-primary border border-secondary/30">
            <AlertDialogTitle className="font-heading font-bold text-light-blue">Elimina Libro</AlertDialogTitle>
            <AlertDialogDescription className="font-paragraph text-secondary">
              Sei sicuro di voler eliminare "{bookToDelete.title}"?
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel disabled={isLoading}>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteBook} disabled={isLoading} className="bg-destructive hover:bg-destructive/90 text-white">
                Elimina
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
