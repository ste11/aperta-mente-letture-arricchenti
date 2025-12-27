import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function OwnerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(email, password);
      if (success) {
        navigate('/owner/dashboard');
      } else {
        setError('Email o password non corretti');
      }
    } catch (err) {
      setError('Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-primary border border-secondary/30 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-light-blue mb-2">
            Accesso Proprietario
          </h1>
          <p className="text-secondary font-paragraph">
            Accedi per gestire la tua biblioteca
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-destructive bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive ml-2">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-paragraph font-medium text-light-blue mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Inserisci la tua email"
              disabled={isLoading}
              className="w-full bg-background border-secondary/40 text-foreground placeholder-secondary/60"
            />
          </div>

          <div>
            <label className="block text-sm font-paragraph font-medium text-light-blue mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci la tua password"
              disabled={isLoading}
              className="w-full bg-background border-secondary/40 text-foreground placeholder-secondary/60"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-brand-color hover:bg-brand-color/90 text-white font-paragraph font-medium"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-background border border-light-blue/40 rounded-lg">
          <p className="text-xs font-paragraph text-light-blue">
            <strong className="text-light-blue">Demo Credentials:</strong><br />
            <span className="text-secondary">Email: owner@library.com</span><br />
            <span className="text-secondary">Password: LibraryOwner2025!</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
