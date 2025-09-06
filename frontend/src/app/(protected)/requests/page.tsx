'use client';

import { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import Link from 'next/link';
import { SEARCH_REQUESTS } from '@/lib/graphql/queries';
import { socketService } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { RatingDisplay } from '@/components/rating-stars';
import { RequestCardSkeleton } from '@/components/ui/skeleton';
import { Plus, MapPin, Clock, Euro, Search } from 'lucide-react';

const categories = ['Todos', 'Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem'];
const statuses = ['Todos', 'OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'];

export default function RequestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('OPEN');
  const [searchTerm, setSearchTerm] = useState('');
  const client = useApolloClient();

  const { data, loading, error, refetch } = useQuery(SEARCH_REQUESTS, {
    variables: {
      input: {
        category: selectedCategory === 'Todos' ? null : selectedCategory,
        status: selectedStatus === 'Todos' ? null : selectedStatus,
        limit: 20,
        offset: 0,
      },
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Auto-refetch when page gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);

  // Refetch when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const socket = socketService.connect();

    // Listen for application changes that affect the requests list
    socketService.onNewApplication(() => {
      refetch();
    });

    socketService.onRequestStatusChange(() => {
      refetch();
    });

    socketService.onApplicationAccepted(() => {
      refetch();
    });

    return () => {
      socketService.off('application:new');
      socketService.off('request:status');
      socketService.off('application:accepted');
    };
  }, [refetch]);

  const requests = data?.searchRequests || [];

  const filteredRequests = requests.filter((request: any) =>
    searchTerm === '' || 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      OPEN: { label: 'Aberto', variant: 'default' as const },
      IN_PROGRESS: { label: 'Em progresso', variant: 'secondary' as const },
      DONE: { label: 'Concluído', variant: 'success' as const },
      CANCELLED: { label: 'Cancelado', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.OPEN;
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pedidos em Fiães
          </h1>
          <p className="text-gray-600 text-lg">Encontra ou oferece ajuda na tua comunidade</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Fiães, Santa Maria da Feira
            </span>
            <span>•</span>
            <span>{!loading && `${filteredRequests.length} pedidos ativos`}</span>
          </div>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all" asChild>
          <Link href="/requests/new">
            <Plus className="w-5 h-5 mr-2" />
            Novo Pedido
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'Todos' ? 'Todos os estados' : 
                 status === 'OPEN' ? 'Abertos' :
                 status === 'IN_PROGRESS' ? 'Em progresso' :
                 status === 'DONE' ? 'Concluídos' :
                 'Cancelados'}
              </option>
            ))}
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm font-medium text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                A carregar...
              </div>
            ) : (
              `${filteredRequests.length} pedidos`
            )}
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar pedidos. Tente novamente.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Nenhum pedido encontrado com esses filtros.</p>
          <Button asChild>
            <Link href="/requests/new">
              <Plus className="w-4 h-4 mr-2" />
              Criar o primeiro pedido
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request: any, index: number) => (
            <Link key={request.id} href={`/requests/${request.id}`}>
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-slide-up h-full flex flex-col" 
                    style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-4 flex-grow-0">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2 font-semibold text-gray-900">
                      {request.title}
                    </CardTitle>
                    {getStatusBadge(request.status)}
                  </div>
                  <CardDescription className="line-clamp-3 text-gray-600 min-h-[4.5rem]">
                    {request.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Category and Price */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{request.category}</Badge>
                      {request.isPaid && request.budgetCents && (
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <Euro className="w-4 h-4 mr-1" />
                          {(request.budgetCents / 100).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Requester */}
                    <div className="flex items-center space-x-2">
                      <GoogleAvatar
                        src={request.requester.avatarUrl}
                        alt={request.requester.name}
                        fallback={request.requester.name.split(' ').map((n: string) => n[0]).join('')}
                        className="w-6 h-6"
                      />
                      <span className="text-sm text-gray-600">{request.requester.name}</span>
                      {request.requester.ratingAvg > 0 && (
                        <RatingDisplay 
                          rating={request.requester.ratingAvg} 
                          size="sm"
                          showCount={false}
                        />
                      )}
                    </div>

                    {/* Location and Time */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {request.distance ? `${request.distance.toFixed(1)}km` : 'Fiães'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString('pt-PT')}
                      </div>
                    </div>

                    {/* Applications count */}
                    {request.applications?.length > 0 && (
                      <div className="text-sm text-blue-600">
                        {request.applications.length} candidatura{request.applications.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}