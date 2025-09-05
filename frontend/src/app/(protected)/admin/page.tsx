'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Users, MessageSquare, TrendingUp, Database } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    redirect('/requests');
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600">Painel de controlo do LigaBairro</p>
        </div>
        <Badge variant="destructive">
          Admin
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Utilizadores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Dados não disponíveis no MVP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Ativos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Dados não disponíveis no MVP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensagens Hoje
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Dados não disponíveis no MVP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Denúncias Pendentes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma denúncia pendente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MVP Admin Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Estado do Sistema
            </CardTitle>
            <CardDescription>
              Informações sobre o funcionamento da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Backend API</span>
              </div>
              <Badge variant="success">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Base de Dados</span>
              </div>
              <Badge variant="success">Conectada</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">WebSocket Chat</span>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Área Operacional</span>
              </div>
              <Badge variant="secondary">Fiães (7km)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Ferramentas de Admin
            </CardTitle>
            <CardDescription>
              Funcionalidades disponíveis no MVP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Gestão de Denúncias</h4>
              <p className="text-sm text-gray-600 mb-3">
                Atualmente não há denúncias para rever.
              </p>
              <Badge variant="outline">
                Funcionalidade Implementada
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Validação Geográfica</h4>
              <p className="text-sm text-gray-600 mb-3">
                Todos os pedidos são validados automaticamente para a área de Fiães.
              </p>
              <Badge variant="success">
                Ativo
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Moderação de Chat</h4>
              <p className="text-sm text-gray-600 mb-3">
                Supervisão das conversas entre utilizadores.
              </p>
              <Badge variant="secondary">
                Manual (MVP)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MVP Limitations Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Limitações do MVP
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Dashboard de estatísticas não implementado (apenas estrutura)</li>
            <li>Lista de denúncias em read-only</li>
            <li>Não há ferramentas de bloqueio de utilizadores</li>
            <li>Relatórios de atividade não disponíveis</li>
            <li>Gestão de utilizadores limitada</li>
          </ul>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded border">
            <p className="text-sm font-medium">
              💡 Para produção: implementar dashboard completo, ferramentas de moderação e analytics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-600">Versão</p>
            <p>MVP 1.0</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Ambiente</p>
            <p>Desenvolvimento</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Região</p>
            <p>Fiães, Santa Maria da Feira</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Última Atualização</p>
            <p>{new Date().toLocaleDateString('pt-PT')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}