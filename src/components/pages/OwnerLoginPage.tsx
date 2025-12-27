import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function OwnerLoginPage() {
  const navigate = useNavigate();
  const { login, isLocked, lockTimeRemaining, checkLockStatus } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayLockTime, setDisplayLockTime] = useState(0);

  // Check lock status on mount and update lock time display
  useEffect(() => {
    checkLockStatus();
    
    const interval = setInterval(() => {
      checkLockStatus();
      const state = useAuthStore.getState();
      setDisplayLockTime(state.lockTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkLockStatus]);

  useEffect(() => {
    setDisplayLockTime(lockTimeRemaining);
  }, [lockTimeRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = login(email, password);
      if (result.success) {
        navigate('/owner/dashboard');
      } else {
        setError(result.error || 'Errore durante il login');
      }
    } catch (err) {
      setError('Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLockTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
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

        {isLocked && (
          <Alert className="mb-6 border-yellow-600 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600 ml-2">
              Account bloccato. Riprova tra: <strong>{formatLockTime(displayLockTime)}</strong>
            </span>
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
              disabled={isLoading || isLocked}
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
              disabled={isLoading || isLocked}
              className="w-full bg-background border-secondary/40 text-foreground placeholder-secondary/60"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email || !password || isLocked}
            className="w-full bg-brand-color hover:bg-brand-color/90 text-white font-paragraph font-medium"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>

        <div className="mt-6 p-3 bg-background border border-secondary/40 rounded-lg">
          <p className="text-xs font-paragraph text-secondary">
            <strong className="text-light-blue">Protezione Sicurezza:</strong><br />
            <span>Massimo 5 tentativi ogni 15 minuti. Dopo 5 tentativi falliti, l'account sarà bloccato per 15 minuti.</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
