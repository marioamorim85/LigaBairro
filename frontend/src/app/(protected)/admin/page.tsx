'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, AlertTriangle, Users, MessageSquare, TrendingUp, Database, Star, Settings, CheckCircle, XCircle, Calendar, Activity, BarChart3, Lock, Unlock, MoreHorizontal, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { GET_ADMIN_STATS, GET_REPORTS, GET_USERS_FOR_MANAGEMENT, GET_ACTIVITY_REPORT, RESOLVE_REPORT, DISMISS_REPORT, TOGGLE_USER_STATUS, UPDATE_USER_ROLE, DELETE_USER } from '@/lib/graphql/admin-queries';
import { useToast } from '@/components/ui/use-toast';
import { GoogleAvatar } from '@/components/ui/google-avatar';

export default function AdminPage() {
  const { user: currentUser, loading } = useAuth();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportAction, setReportAction] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [activityDays, setActivityDays] = useState<number>(30);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery(GET_ADMIN_STATS, {
    skip: !currentUser || currentUser.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

  const { data: reportsData, loading: reportsLoading, refetch: refetchReports } = useQuery(GET_REPORTS, {
    skip: !currentUser || currentUser.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_USERS_FOR_MANAGEMENT, {
    skip: !currentUser || currentUser.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

  const { data: activityData, loading: activityLoading } = useQuery(GET_ACTIVITY_REPORT, {
    variables: { days: activityDays },
    skip: !currentUser || currentUser.role !== 'ADMIN',
    fetchPolicy: 'cache-and-network',
  });

  const [resolveReport] = useMutation(RESOLVE_REPORT, {
    onCompleted: () => {
      toast({ title: 'Denúncia resolvida com sucesso!' });
      refetchReports();
      refetchStats();
      setSelectedReport(null);
      setReportAction('');
      setAdminNotes('');
    },
    onError: (error) => {
      toast({ title: 'Erro ao resolver denúncia', description: error.message, variant: 'destructive' });
    }
  });

  const [dismissReport] = useMutation(DISMISS_REPORT, {
    onCompleted: () => {
      toast({ title: 'Denúncia rejeitada com sucesso!' });
      refetchReports();
      refetchStats();
      setSelectedReport(null);
      setAdminNotes('');
    },
    onError: (error) => {
      toast({ title: 'Erro ao rejeitar denúncia', description: error.message, variant: 'destructive' });
    }
  });

  const [toggleUserStatus] = useMutation(TOGGLE_USER_STATUS, {
    onCompleted: () => {
      toast({ title: 'Estado do utilizador alterado com sucesso!' });
      refetchUsers();
      refetchStats();
    },
    onError: (error) => {
      toast({ title: 'Erro ao alterar estado do utilizador', description: error.message, variant: 'destructive' });
    }
  });

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: () => {
      toast({ title: 'Função do utilizador alterada com sucesso!' });
      refetchUsers();
    },
    onError: (error) => {
      toast({ title: 'Erro ao alterar função do utilizador', description: error.message, variant: 'destructive' });
    }
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      toast({ title: 'Utilizador eliminado com sucesso!' });
      refetchUsers();
      refetchStats();
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast({ title: 'Erro ao eliminar utilizador', description: error.message, variant: 'destructive' });
    }
  });

  const handleResolveReport = async () => {
    if (!selectedReport || !reportAction) return;
    await resolveReport({ variables: { reportId: selectedReport.id, action: reportAction, adminNotes: adminNotes || null } });
  };

  const handleDismissReport = async () => {
    if (!selectedReport) return;
    await dismissReport({ variables: { reportId: selectedReport.id, adminNotes: adminNotes || null } });
  };

  const handleToggleUserStatus = async (userId: string) => {
    await toggleUserStatus({ variables: { userId } });
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    await updateUserRole({ variables: { userId, newRole } });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    await deleteUser({ variables: { userId: userToDelete.id } });
  };

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

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/requests');
  }

  const stats = statsData?.adminStats;
  const reports = reportsData?.reports || [];
  const users = usersData?.usersForManagement || [];
  const activityReport = activityData?.activityReport || [];
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
            <p className="text-gray-600">Painel de controlo avançado do LigaBairro</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive">Admin</Badge>
          <Badge variant="secondary">Sistema Ativo</Badge>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Denúncias</TabsTrigger>
          <TabsTrigger value="users">Utilizadores</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Resumo Executivo</h2>
              <Badge className="bg-blue-500">Hoje</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.recentActivity?.newUsers || 0}</div>
                <div className="text-sm text-gray-600">Novos utilizadores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.recentActivity?.newRequests || 0}</div>
                <div className="text-sm text-gray-600">Novos pedidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.recentActivity?.newApplications || 0}</div>
                <div className="text-sm text-gray-600">Candidaturas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats?.todayMessages || 0}</div>
                <div className="text-sm text-gray-600">Mensagens hoje</div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {(stats?.pendingReports > 0 || stats?.activeRequests > 10) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h2 className="text-lg font-semibold text-red-800">Alertas e Atenção Necessária</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats?.pendingReports > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                    <span className="text-red-800 font-medium">Denúncias pendentes</span>
                    <Badge variant="destructive">{stats.pendingReports}</Badge>
                  </div>
                )}
                {stats?.activeRequests > 10 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                    <span className="text-yellow-800 font-medium">Muitos pedidos ativos</span>
                    <Badge className="bg-yellow-500">{stats.activeRequests}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Utilizadores */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilizadores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{stats?.monthlyGrowth?.users || 0} este mês
                  </div>
                </>}
              </CardContent>
            </Card>

            {/* Pedidos Ativos */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-green-600">{stats?.activeRequests || 0}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{stats?.monthlyGrowth?.requests || 0} este mês
                  </div>
                </>}
              </CardContent>
            </Card>

            {/* Utilizadores Ativos */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilizadores Ativos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-purple-600">{stats?.userActivity?.activeToday || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.userActivity?.activeThisWeek || 0} esta semana</p>
                </>}
              </CardContent>
            </Card>

            {/* Denúncias Pendentes */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Denúncias Pendentes</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className={`text-2xl font-bold ${stats?.pendingReports > 0 ? 'text-red-600' : 'text-gray-400'}`}>{stats?.pendingReports || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.pendingReports > 0 ? 'Requer atenção' : 'Nenhuma pendente'}</p>
                </>}
              </CardContent>
            </Card>

            {/* Novos Utilizadores (Hoje) */}
            <Card className="border-l-4 border-l-cyan-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Utilizadores (Hoje)</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-cyan-600">{stats?.recentActivity?.newUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Desde as últimas 24h</p>
                </>}
              </CardContent>
            </Card>

            {/* Pedidos Concluídos */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-emerald-600">{stats?.completedRequests || 0}</div>
                  <p className="text-xs text-muted-foreground">Total de sempre</p>
                </>}
              </CardContent>
            </Card>

            {/* Total de Mensagens */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-orange-600">{stats?.totalMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.todayMessages || 0} hoje</p>
                </>}
              </CardContent>
            </Card>

            {/* Avaliação Média */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : <>
                  <div className="text-2xl font-bold text-yellow-600 flex items-center">
                    {stats?.averageRating?.toFixed(1) || 'N/A'}
                    <Star className="w-5 h-5 ml-1 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-xs text-muted-foreground">Em todas as avaliações</p>
                </>}
              </CardContent>
            </Card>
          </div>

          {/* Top Categories and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Categorias Mais Populares
                </CardTitle>
                <CardDescription>Pedidos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center animate-pulse">
                        <div className="bg-gray-200 h-4 w-24 rounded"></div>
                        <div className="bg-gray-200 h-4 w-8 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats?.topCategories?.map((category: any, index: number) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-yellow-400' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-400' :
                            'bg-blue-400'
                          }`}></div>
                          <span className="font-medium capitalize">{category.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-right text-sm px-2 py-1 rounded ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {category.count} pedidos
                          </div>
                          {index === 0 && <Badge className="bg-yellow-500">Top #1</Badge>}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 py-4">
                        Sem dados de categorias disponíveis
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Saúde da Plataforma
                </CardTitle>
                <CardDescription>Métricas de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Taxa de Sucesso</p>
                    <p className="text-sm text-green-600">{stats ? Math.round((stats.completedRequests / (stats.totalRequests || 1)) * 100) : 0}% pedidos concluídos</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats ? Math.round((stats.completedRequests / (stats.totalRequests || 1)) * 100) : 0}%
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Engajamento</p>
                    <p className="text-sm text-blue-600">{stats ? Math.round((stats.userActivity.activeThisWeek / (stats.totalUsers || 1)) * 100) : 0}% utilizadores ativos</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats ? Math.round((stats.userActivity.activeThisWeek / (stats.totalUsers || 1)) * 100) : 0}%
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Qualidade</p>
                    <p className="text-sm text-purple-600">Avaliação média: {stats?.averageRating?.toFixed(1) || 'N/A'}</p>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-purple-600">
                    {stats?.averageRating?.toFixed(1) || 'N/A'}
                    <Star className="w-5 h-5 ml-1 text-yellow-400 fill-current" />
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  (stats?.pendingReports || 0) > 0 ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  <div>
                    <p className={`font-medium ${
                      (stats?.pendingReports || 0) > 0 ? 'text-red-800' : 'text-green-800'
                    }`}>Estado do Sistema</p>
                    <p className={`text-sm ${
                      (stats?.pendingReports || 0) > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {(stats?.pendingReports || 0) > 0 ? 'Requer atenção' : 'Funcionando perfeitamente'}
                    </p>
                  </div>
                  <div className={`text-2xl ${
                    (stats?.pendingReports || 0) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {(stats?.pendingReports || 0) > 0 ? '⚠️' : '✅'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Tendências de Crescimento
              </CardTitle>
              <CardDescription>Crescimento mensal e atividade recente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    +{stats?.monthlyGrowth?.users || 0}
                  </div>
                  <p className="text-sm font-medium text-green-800">Novos utilizadores este mês</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats?.monthlyGrowth?.users > 0 ? 'Crescimento positivo' : 'Sem crescimento'}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    +{stats?.monthlyGrowth?.requests || 0}
                  </div>
                  <p className="text-sm font-medium text-blue-800">Novos pedidos este mês</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats?.monthlyGrowth?.requests > 0 ? 'Procura crescente' : 'Procura estável'}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats?.userActivity?.activeThisWeek || 0}
                  </div>
                  <p className="text-sm font-medium text-purple-800">Utilizadores ativos (7 dias)</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {((stats?.userActivity?.activeThisWeek || 0) / (stats?.totalUsers || 1) * 100).toFixed(1)}% da base
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Insights Rápidos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Utilizadores por pedido:</span> {stats?.totalUsers && stats?.totalRequests ? (stats.totalUsers / stats.totalRequests).toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Candidaturas por pedido:</span> {stats?.totalRequests && stats?.totalApplications ? (stats.totalApplications / stats.totalRequests).toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Mensagens por utilizador:</span> {stats?.totalUsers && stats?.totalMessages ? (stats.totalMessages / stats.totalUsers).toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Taxa de atividade diária:</span> {stats?.userActivity?.activeToday && stats?.userActivity?.activeThisWeek ? Math.round((stats.userActivity.activeToday / stats.userActivity.activeThisWeek) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Gestão de Denúncias
                </CardTitle>
                <CardDescription>
                  {reports.length} denúncia{reports.length !== 1 ? 's' : ''} no total
                </CardDescription>
              </div>
              <Badge variant={reports.filter(r => r.status === 'PENDING').length > 0 ? 'destructive' : 'secondary'}>
                {reports.filter(r => r.status === 'PENDING').length} pendente{reports.filter(r => r.status === 'PENDING').length !== 1 ? 's' : ''}
              </Badge>
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
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-gray-600 font-medium mb-2">Sem denúncias registadas</p>
                  <p className="text-sm text-gray-500">A comunidade está a funcionar perfeitamente!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reports.map((report: any) => (
                    <div key={report.id} className={`p-4 border rounded-lg ${
                      report.status === 'PENDING' ? 'border-red-200 bg-red-50' :
                      report.status === 'RESOLVED' ? 'border-green-200 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`font-medium ${
                              report.status === 'PENDING' ? 'text-red-800' :
                              report.status === 'RESOLVED' ? 'text-green-800' :
                              'text-gray-800'
                            }`}>
                              {report.reason}
                            </div>
                            <Badge variant={report.status === 'PENDING' ? 'destructive' : 
                                          report.status === 'RESOLVED' ? 'default' : 'secondary'}>
                              {report.status === 'PENDING' ? 'Pendente' :
                               report.status === 'RESOLVED' ? 'Resolvida' : 'Rejeitada'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{report.details}</p>
                          {report.adminNotes && (
                            <div className="p-2 bg-blue-50 rounded text-sm">
                              <span className="font-medium text-blue-800">Nota admin:</span> {report.adminNotes}
                            </div>
                          )}
                        </div>
                        {report.status === 'PENDING' && (
                          <div className="flex space-x-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedReport(report)}>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Resolver
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolver Denúncia</DialogTitle>
                                  <DialogDescription>
                                    Como pretende resolver esta denúncia?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Ação a tomar:</label>
                                    <Select value={reportAction} onValueChange={setReportAction}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma ação" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="NO_ACTION">Nenhuma ação necessária</SelectItem>
                                        <SelectItem value="WARNING">Aviso ao utilizador</SelectItem>
                                        <SelectItem value="BLOCK_USER">Bloquear utilizador</SelectItem>
                                        <SelectItem value="REMOVE_REQUEST">Remover pedido</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Notas administrativas:</label>
                                    <Textarea
                                      placeholder="Adicione notas sobre a resolução..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {
                                    setSelectedReport(null);
                                    setReportAction('');
                                    setAdminNotes('');
                                  }}>Cancelar</Button>
                                  <Button onClick={handleResolveReport} disabled={!reportAction}>
                                    Resolver Denúncia
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Rejeitar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rejeitar Denúncia</DialogTitle>
                                  <DialogDescription>
                                    Esta denúncia será marcada como rejeitada.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Motivo da rejeição:</label>
                                    <Textarea
                                      placeholder="Explique porque esta denúncia foi rejeitada..."
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => {
                                    setSelectedReport(null);
                                    setAdminNotes('');
                                  }}>Cancelar</Button>
                                  <Button variant="destructive" onClick={handleDismissReport}>
                                    Rejeitar Denúncia
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>ID: {report.id.substring(0, 8)}...</span>
                        <span>{new Date(report.createdAt).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Utilizadores</CardTitle>
              <CardDescription>{users.length} utilizadores registados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Utilizador</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Função</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Registado em</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {usersLoading ? (
                        <tr><td colSpan={5} className="text-center p-4">A carregar...</td></tr>
                      ) : users.map((user: any) => (
                        <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">
                            <div className="flex items-center space-x-3">
                              <GoogleAvatar src={user.avatarUrl} alt={user.name} fallback={user.name.split(' ').map((n:string) => n[0]).join('')} />
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'outline'}>{user.role}</Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={user.isActive ? 'default' : 'secondary'} className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {user.isActive ? 'Ativo' : 'Bloqueado'}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="p-4 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                                  {user.isActive ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
                                  <span>{user.isActive ? 'Bloquear' : 'Desbloquear'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.role === 'USER' ? (
                                  <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'ADMIN')}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Tornar Admin</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'USER')} disabled={adminCount <= 1 && user.id === currentUser.id}>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    <span>Tirar de Admin</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => { setUserToDelete(user); setIsDeleteDialogOpen(true); }}
                                  disabled={user.role === 'ADMIN' && adminCount <= 1}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Eliminar</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Report */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Relatório de Atividade
                </CardTitle>
                <CardDescription>
                  Atividade dos últimos {activityDays} dias
                </CardDescription>
              </div>
              <Select value={activityDays.toString()} onValueChange={(value) => setActivityDays(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="15">15 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-3 border rounded-lg animate-pulse">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                    </div>
                  ))}
                </div>
              ) : activityReport.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600">Sem dados de atividade disponíveis</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activityReport.map((activity: any, index: number) => (
                    <div key={activity.date} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">
                          {new Date(activity.date).toLocaleDateString('pt-PT', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <Badge variant="secondary">Dia {index + 1}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-100 rounded">
                          <div className="font-semibold text-blue-600">{activity.newUsers}</div>
                          <div className="text-blue-500">Novos utilizadores</div>
                        </div>
                        <div className="text-center p-2 bg-green-100 rounded">
                          <div className="font-semibold text-green-600">{activity.newRequests}</div>
                          <div className="text-green-500">Novos pedidos</div>
                        </div>
                        <div className="text-center p-2 bg-purple-100 rounded">
                          <div className="font-semibold text-purple-600">{activity.newApplications}</div>
                          <div className="text-purple-500">Candidaturas</div>
                        </div>
                        <div className="text-center p-2 bg-emerald-100 rounded">
                          <div className="font-semibold text-emerald-600">{activity.completedRequests}</div>
                          <div className="text-emerald-500">Concluídos</div>
                        </div>
                        <div className="text-center p-2 bg-indigo-100 rounded">
                          <div className="font-semibold text-indigo-600">{activity.totalMessages}</div>
                          <div className="text-indigo-500">Mensagens</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Backend API</span>
                  </div>
                  <Badge className="bg-green-500">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Base de Dados</span>
                  </div>
                  <Badge className="bg-green-500">Conectada</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">WebSocket Chat</span>
                  </div>
                  <Badge className="bg-green-500">Ativo</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Área Operacional</span>
                  </div>
                  <Badge variant="secondary">Fiães (7km)</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Sistema Admin</span>
                  </div>
                  <Badge className="bg-purple-500">Totalmente Funcional</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>Detalhes técnicos e de configuração</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-600">Versão</p>
                    <p className="text-lg font-semibold">Admin v2.0</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-600">Ambiente</p>
                    <p className="text-lg font-semibold">Desenvolvimento</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-600">Região</p>
                    <p className="text-lg font-semibold">Fiães, SMF</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-600">Última Atualização</p>
                    <p className="text-lg font-semibold">{new Date().toLocaleDateString('pt-PT')}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Funcionalidades Implementadas</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Dashboard completo com estatísticas em tempo real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Sistema de gestão de denúncias (resolver/rejeitar)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Gestão de utilizadores (bloquear/desbloquear)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Relatórios de atividade detalhados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Analytics avançadas e métricas de crescimento</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminação</DialogTitle>
            <DialogDescription>
              Tem a certeza que quer eliminar o utilizador <strong>{userToDelete?.name}</strong>? Esta ação não pode ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Eliminar Utilizador</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}