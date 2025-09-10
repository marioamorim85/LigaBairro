'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Users, Clock, Heart, Sparkles, Zap, Eye, MousePointer, Coffee } from 'lucide-react';

export default function LandingPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="PorPerto Logo" 
            className="mx-auto h-40 object-contain mb-8 drop-shadow-2xl"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Ajuda perto de ti em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mozelos</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Conectamos vizinhos que precisam de ajuda com pessoas dispostas a ajudar. 
            <br className="hidden md:block" />
            Pequenas tarefas, grandes diferenças na nossa comunidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="gradient" size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href={`${backendUrl}/auth/google`}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="white"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="white"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="white"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="white"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </Link>
            </Button>
            <Button variant="glass" size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/requests">
                <Eye className="w-5 h-5 mr-2" />
                Ver pedidos disponíveis
              </Link>
            </Button>
          </div>
        </div>

        {/* Features with modern styling */}
        <div className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center glass-card hover:transform hover:scale-105 transition-all duration-200">
            <CardContent className="pt-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-3">Local</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Focado exclusivamente em Mozelos. Ajuda a vizinhos da tua área.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-floating transition-all duration-300">
            <CardContent className="pt-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-3">Comunidade</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Constrói relações com os teus vizinhos através da entreajuda.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
            <CardContent className="pt-8">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-3">Rápido</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Encontra ajuda rapidamente ou oferece a tua disponibilidade.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center soft-shadow hover:soft-shadow-lg transition-all duration-300">
            <CardContent className="pt-8">
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-3">Solidário</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Promove a solidariedade entre vizinhos da nossa comunidade.
              </CardDescription>
            </CardContent>
          </Card>
        </div>


        {/* How it works */}
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Como funciona?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Cria o teu pedido</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Descreve a tarefa que precisas de ajuda: compras, reparações, companhia, etc.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
            </div>

            <div className="text-center relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Recebe candidaturas</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Vizinhos disponíveis vão candidatar-se para te ajudar.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-px bg-gradient-to-r from-blue-300 to-transparent"></div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Combina e avalia</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Escolhe quem te vai ajudar, combina os detalhes e avalia a experiência.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 text-center bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
            Junta-te à comunidade PorPerto e descobre como é fácil ajudar e ser ajudado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="gradient" 
              size="xl" 
              asChild
            >
              <Link href={`${backendUrl}/auth/google`}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                🚀 Começar agora
              </Link>
            </Button>
            
            <Button className="glass-effect" size="lg" asChild>
              <Link href="/requests">
                <MousePointer className="w-5 h-5 mr-2" />
                ☕ Explorar com café
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mb-6">
            <div className="text-white font-bold text-xl">PP</div>
          </div>
          <h3 className="text-2xl font-bold mb-4">PorPerto</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Conectando a comunidade de Mozelos, uma ajuda de cada vez.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white transition-colors">Termos de Serviço</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <span>© 2025 PorPerto</span>
          </div>
        </div>
      </footer>
    </div>
  );
}