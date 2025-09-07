'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Users, MessageSquare, TrendingUp, Database, Star } from 'lucide-react';
import { redirect } from 'next/navigation';
import { GET_ADMIN_STATS, GET_REPORTS } from '@/lib/graphql/admin-queries';

export default function AdminPage() {
  const { user, loading } = useAuth();
  
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_ADMIN_STATS, {
    skip: !user || user.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

  const { data: reportsData, loading: reportsLoading } = useQuery(GET_REPORTS, {
    skip: !user || user.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

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

  const stats = statsData?.adminStats;
  const reports = reportsData?.reports || [];

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
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Utilizadores registados
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
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-green-600">{stats?.activeRequests || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              De {stats?.totalRequests || 0} pedidos totais
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
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-purple-600">{stats?.todayMessages || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              De {stats?.totalMessages || 0} mensagens totais
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
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className={`text-2xl font-bold ${stats?.pendingReports > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {stats?.pendingReports || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats?.pendingReports > 0 ? 'Requer atenção' : 'Nenhuma pendente'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Candidaturas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-indigo-600">{stats?.totalApplications || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Candidaturas submetidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Concluídos
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-emerald-600">{stats?.completedRequests || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Taxa: {stats?.totalRequests > 0 ? `${Math.round((stats?.completedRequests / stats?.totalRequests) * 100)}%` : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="text-2xl font-bold text-yellow-600">{stats?.averageRating?.toFixed(1) || '0.0'}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Satisfação dos utilizadores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      {stats?.topCategories && stats.topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Categorias Mais Populares
            </CardTitle>
            <CardDescription>
              Distribuição de pedidos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                    <div className="text-sm text-gray-500">
                      {stats.totalRequests > 0 ? `${Math.round((category.count / stats.totalRequests) * 100)}%` : '0%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

        {/* Reports & Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Denúncias e Moderação
            </CardTitle>
            <CardDescription>
              Gestão de denúncias e ações administrativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 w-full rounded"></div>
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-600 font-medium mb-2">Sem denúncias pendentes</p>
                <p className="text-sm text-gray-500">A comunidade está a funcionar bem!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {reports.slice(0, 5).map((report: any) => (
                  <div key={report.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-red-800">
                        {report.reason}
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {report.details}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Denunciado por: {report.reporter?.name}
                      </span>
                      <span>
                        {new Date(report.createdAt).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>
                ))}
                {reports.length > 5 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    E mais {reports.length - 5} denúncia{reports.length - 5 !== 1 ? 's' : ''}...
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Validação Geográfica</h4>
                    <p className="text-sm text-green-700">Área de Fiães (7km)</p>
                  </div>
                  <Badge variant="success">Ativo</Badge>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800">Chat em Tempo Real</h4>
                    <p className="text-sm text-blue-700">WebSocket ativo</p>
                  </div>
                  <Badge variant="secondary">Monitorizado</Badge>
                </div>
              </div>
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