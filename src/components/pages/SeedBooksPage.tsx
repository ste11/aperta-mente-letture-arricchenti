import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { booksData } from '@/utils/booksData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SeedBooksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSeedBooks = async () => {
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setProgress(0);

    try {
      for (let i = 0; i < booksData.length; i++) {
        const book = booksData[i];
        await BaseCrudService.create('libri', book);
        setProgress(Math.round(((i + 1) / booksData.length) * 100));
      }
      setSuccess(true);
    } catch (err) {
      setError(`Errore durante l'aggiunta dei libri: ${err}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white">
        <h1 className="text-2xl font-heading font-bold text-brand-color mb-4">
          Aggiungi Libri al Database
        </h1>

        <p className="font-paragraph text-foreground mb-6">
          Questa pagina aggiungerà {booksData.length} libri al database della biblioteca.
        </p>

        {error && (
          <Alert className="mb-6 border-destructive bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-700 ml-2">
              Tutti i {booksData.length} libri sono stati aggiunti con successo!
            </span>
          </Alert>
        )}

        {isLoading && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-color h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-paragraph text-secondary mt-2 text-center">
              {progress}% completato
            </p>
          </div>
        )}

        <Button
          onClick={handleSeedBooks}
          disabled={isLoading || success}
          className="w-full bg-brand-color hover:bg-brand-color/90 text-white font-paragraph font-medium"
        >
          {isLoading ? `Aggiunta in corso... ${progress}%` : success ? 'Completato!' : 'Aggiungi Libri'}
        </Button>

        {success && (
          <p className="text-sm font-paragraph text-secondary mt-4 text-center">
            Puoi ora visitare la pagina <a href="/libri" className="text-primary hover:underline">Libri</a> per visualizzare la tua collezione.
          </p>
        )}
      </Card>
    </div>
  );
}
