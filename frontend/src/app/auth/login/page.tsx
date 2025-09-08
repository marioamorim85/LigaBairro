'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:4000';
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Login Falhou',
        description: error,
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-2xl">LB</div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Bem-vindo ao LigaBairro
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Entre com a sua conta Google para continuar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Acesso Negado</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            size="lg" 
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm transition-all hover:shadow-md" 
            asChild
          >
            <Link href={`${backendUrl}/auth/google`}>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </Link>
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>
              Ao entrar, concorda com os nossos{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 hover:underline inline-flex items-center">
              ← Voltar à página inicial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}