import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { BaseCrudService } from '@/integrations';
import { Books, Comments } from '@/entities';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, LogOut } from 'lucide-react';
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal'; // Nuovo componente
import BooksManagementTable from '@/components/BooksManagementTable';
import CommentsManagementTable from '@/components/CommentsManagementTable';

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { isOwnerLoggedIn, logout } = useAuthStore();
  const [books, setBooks] = useState<Books[]>([]);
  const [comments, setComments] = useState<Comments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stati per i Modal
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  
  const [activeTab, setActiveTab] = useState('books');

  useEffect(() => {
    if (!isOwnerLoggedIn) {
      navigate('/owner/login');
      return;
    }
    loadData();
  }, [isOwnerLoggedIn, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [booksResponse, commentsResponse] = await Promise.all([
        BaseCrudService.getAll<Books>('libri'),
        BaseCrudService.getAll<Comments>('commenti'),
      ]);
      setBooks(booksResponse.items || []);
      setComments(commentsResponse.items || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Gestione aggiunta
  const handleBookAdded = async () => {
    setShowAddBookModal(false);
    await loadData();
  };

  // Gestione modifica
  const handleEditClick = (book: Books) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleBookUpdated = async () => {
    setShowEditModal(false);
    setSelectedBook(null);
    await loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header (Invariato) */}
      <div className="bg-primary border-b border-secondary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard Proprietario</h1>
            <p className="text-secondary text-sm font-paragraph">Gestisci la tua biblioteca</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Esci
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="books">Libri ({books.length})</TabsTrigger>
            <TabsTrigger value="comments">Commenti ({comments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Gestione Libri</h2>
                <p className="text-secondary font-paragraph">Aggiungi, modifica o elimina i libri</p>
              </div>
              <Button
                onClick={() => setShowAddBookModal(true)}
                className="flex items-center gap-2 bg-brand-color hover:bg-brand-color/90"
              >
                <Plus className="w-4 h-4" /> Aggiungi Libro
              </Button>
            </div>

            <BooksManagementTable
              books={books}
              onBookDeleted={loadData}
              onBooksUpdated={loadData}
            />
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <CommentsManagementTable
              comments={comments}
              onCommentDeleted={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Aggiunta */}
      {showAddBookModal && (
        <AddBookModal
          onClose={() => setShowAddBookModal(false)}
          onBookAdded={handleBookAdded}
        />
      )}

      {/* Modal Modifica */}
      {showEditModal && selectedBook && (
        <EditBookModal
          book={selectedBook}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBook(null);
          }}
          onBookUpdated={handleBookUpdated}
        />
      )}
    </div>
  );
}
