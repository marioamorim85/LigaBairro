'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_REQUEST, GET_MESSAGES_BY_REQUEST } from '@/lib/graphql/queries';
import { APPLY_TO_REQUEST, ACCEPT_APPLICATION, REMOVE_APPLICATION, SEND_MESSAGE, UPDATE_REQUEST_STATUS } from '@/lib/graphql/mutations';
import { useAuth } from '@/components/auth/auth-provider';
import { socketService } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { MapPicker } from '@/components/map-picker';
import { ChatBox } from '@/components/chat-box';
import { ProxiedImage } from '@/components/proxied-image';
import { RatingDisplay } from '@/components/rating-stars';
import { ReviewDialog } from '@/components/review-dialog';
import { 
  MapPin, 
  Clock, 
  Euro, 
  User, 
  MessageCircle, 
  Send,
  Calendar,
  ArrowLeft,
  Edit,
  X,
  Settings,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function RequestDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const client = useApolloClient();
  const requestId = params.id as string;
  
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{id: string, name: string} | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_REQUEST, {
    variables: { id: requestId },
    skip: !requestId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const [applyToRequest] = useMutation(APPLY_TO_REQUEST);
  const [acceptApplication] = useMutation(ACCEPT_APPLICATION);
  const [removeApplication] = useMutation(REMOVE_APPLICATION);
  const [updateRequestStatus] = useMutation(UPDATE_REQUEST_STATUS);

  const request = data?.request;
  
  useEffect(() => {
    if (requestId) {
      // Connect to WebSocket and join room
      const socket = socketService.connect();
      socketService.joinRequestRoom(requestId);

      // Listen for new applications and status changes
      socketService.onNewApplication(() => {
        refetch();
        // Also invalidate requests list cache (safely)
        try {
          client.refetchQueries({
            include: ['SearchRequests']
          });
        } catch (error) {
          console.log('SearchRequests not active, skipping refetch');
        }
      });

      socketService.onRequestStatusChange(() => {
        refetch();
        // Also invalidate requests list cache (safely)
        try {
          client.refetchQueries({
            include: ['SearchRequests']
          });
        } catch (error) {
          console.log('SearchRequests not active, skipping refetch');
        }
      });

      // Listen for application acceptance/rejection
      socketService.onApplicationAccepted(() => {
        refetch();
        // Also invalidate requests list cache (safely)
        try {
          client.refetchQueries({
            include: ['SearchRequests']
          });
        } catch (error) {
          console.log('SearchRequests not active, skipping refetch');
        }
      });

      // Join user room for personalized notifications
      if (user?.id) {
        socketService.joinUserRoom(user.id);
        
        // Listen for personalized application status updates
        socketService.onApplicationStatus((data) => {
          console.log('📱 Personal application status update:', data);
          refetch();
          // Also invalidate requests list cache (safely)
          try {
            client.refetchQueries({
              include: ['SearchRequests']
            });
          } catch (error) {
            console.log('SearchRequests not active, skipping refetch');
          }
          
          // Show toast notification
          if (data.type === 'ACCEPTED') {
            alert('🎉 ' + data.message);
          } else if (data.type === 'REJECTED') {
            alert('❌ ' + data.message);
          }
        });
      }

      return () => {
        socketService.leaveRequestRoom(requestId);
        if (user?.id) {
          socketService.leaveUserRoom(user.id);
        }
        socketService.off('application:new');
        socketService.off('request:status');
        socketService.off('application:accepted');
        socketService.off('application:status');
      };
    }
  }, [requestId, refetch]);

  const handleApply = async () => {
    if (!request || !user) return;
    
    
    setIsApplying(true);
    try {
      const result = await applyToRequest({
        variables: {
          input: {
            requestId: request.id,
            message: applicationMessage.trim() || null,
          },
        },
      });
      
      setApplicationMessage('');
      refetch();
      // Invalidate requests list cache to update application counts
      try {
        client.refetchQueries({
          include: ['SearchRequests']
        });
      } catch (error) {
        console.log('SearchRequests not active, skipping refetch');
      }
    } catch (error: any) {
      console.error('Error applying to request:', error);
      alert(error.message || 'Erro ao candidatar-se');
    } finally {
      setIsApplying(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await acceptApplication({
        variables: { applicationId },
      });
      refetch();
      // Invalidate requests list cache to update application counts and statuses
      try {
        client.refetchQueries({
          include: ['SearchRequests']
        });
      } catch (error) {
        console.log('SearchRequests not active, skipping refetch');
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao aceitar candidatura');
    }
  };

  const handleRemoveApplication = async (applicationId: string) => {
    if (!confirm('Tens a certeza que queres remover a tua candidatura? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    setIsRemoving(true);
    try {
      const result = await removeApplication({
        variables: { applicationId },
      });
      
      refetch();
      // Invalidate requests list cache to update application counts
      try {
        client.refetchQueries({
          include: ['SearchRequests']
        });
      } catch (error) {
        console.log('SearchRequests not active, skipping refetch');
      }
    } catch (error: any) {
      console.error('Error removing application:', error);
      alert(error.message || 'Erro ao remover candidatura');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCloseRequest = async () => {
    if (!confirm('Tens a certeza que queres encerrar este pedido? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await updateRequestStatus({
        variables: {
          id: request.id,
          status: 'DONE',
        },
      });
      refetch();
      // Invalidate requests list cache to update request status
      try {
        client.refetchQueries({
          include: ['SearchRequests']
        });
      } catch (error) {
        console.log('SearchRequests not active, skipping refetch');
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao encerrar pedido');
    }
  };

  const handleCancelRequest = async () => {
    if (!confirm('Tens a certeza que queres cancelar este pedido? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await updateRequestStatus({
        variables: {
          id: request.id,
          status: 'CANCELLED',
        },
      });
      refetch();
      // Invalidate requests list cache to update request status
      try {
        client.refetchQueries({
          include: ['SearchRequests']
        });
      } catch (error) {
        console.log('SearchRequests not active, skipping refetch');
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao cancelar pedido');
    }
  };

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

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar pedido</p>
          <Button asChild>
            <Link href="/requests">Voltar aos pedidos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === request.requester.id;
  const userApplication = request.applications?.find((app: any) => app.helper.id === user?.id);
  const hasApplied = !!userApplication;
  const acceptedApplication = request.applications?.find((app: any) => app.status === 'ACCEPTED');
  const isAcceptedHelper = acceptedApplication?.helper.id === user?.id;
  const canChat = isOwner || isAcceptedHelper || hasApplied || request.status === 'OPEN';
  const canRemoveApplication = userApplication && userApplication.status === 'APPLIED' && request.status === 'OPEN';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/requests">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
              {getStatusBadge(request.status)}
            </div>
            
            {/* Owner actions */}
            {isOwner && request.status !== 'DONE' && request.status !== 'CANCELLED' && (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300">
                  <Link href={`/requests/${request.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                
                {(request.status === 'OPEN' || request.status === 'IN_PROGRESS') && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleCloseRequest}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Concluir
                  </Button>
                )}
                
                {request.status === 'OPEN' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelRequest}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-600">{request.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    {request.category}
                  </Badge>
                  <p className="text-sm text-gray-600">Categoria</p>
                </div>
                
                {request.isPaid && request.budgetCents && (
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-600 font-medium mb-2">
                      <Euro className="w-4 h-4 mr-1" />
                      {(request.budgetCents / 100).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Orçamento</p>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(request.createdAt).toLocaleDateString('pt-PT')}
                  </div>
                  <p className="text-sm text-gray-600">Criado</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    Fiães
                  </div>
                  <p className="text-sm text-gray-600">Localização</p>
                </div>
              </div>

              {(request.scheduledFrom || request.scheduledTo) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Horário Pretendido
                  </h4>
                  <div className="text-sm text-gray-600">
                    {request.scheduledFrom && (
                      <p>Início: {new Date(request.scheduledFrom).toLocaleString('pt-PT')}</p>
                    )}
                    {request.scheduledTo && (
                      <p>Fim: {new Date(request.scheduledTo).toLocaleString('pt-PT')}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          {request.imageUrls && request.imageUrls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                  {request.imageUrls.map((url: string, index: number) => (
                    <div 
                      key={index} 
                      className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedImage(url)}
                    >
                      <ProxiedImage
                        src={url}
                        alt={`Imagem ${index + 1} do pedido`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapPicker
                  selectedLocation={{ lat: request.lat, lng: request.lng }}
                  onLocationSelect={() => {}}
                  readonly={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          {isOwner && request.applications && request.applications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Candidaturas ({request.applications.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.applications.map((application: any) => (
                  <div key={application.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <GoogleAvatar
                      src={application.helper.avatarUrl}
                      alt={application.helper.name}
                      fallback={application.helper.name.split(' ').map((n: string) => n[0]).join('')}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{application.helper.name}</p>
                          {application.helper.ratingAvg > 0 && (
                            <p className="text-sm text-yellow-600">
                              ★ {application.helper.ratingAvg.toFixed(1)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={application.status === 'ACCEPTED' ? 'success' : 'default'}
                          >
                            {application.status === 'ACCEPTED' ? 'Aceite' : 
                             application.status === 'REJECTED' ? 'Rejeitada' : 'Pendente'}
                          </Badge>
                          {application.status === 'APPLIED' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptApplication(application.id)}
                            >
                              Aceitar
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {application.message && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          "{application.message}"
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(application.createdAt).toLocaleString('pt-PT')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Chat */}
          {canChat && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Conversa
                  {!isOwner && !hasApplied && request.status === 'OPEN' && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Para esclarecimentos sobre o pedido)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatBox requestId={request.id} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requester */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Solicitante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <GoogleAvatar
                  src={request.requester.avatarUrl}
                  alt={request.requester.name}
                  fallback={request.requester.name.split(' ').map((n: string) => n[0]).join('')}
                  className="w-12 h-12"
                />
                <div>
                  <p className="font-medium">{request.requester.name}</p>
                  {request.requester.ratingAvg > 0 && (
                    <RatingDisplay 
                      rating={request.requester.ratingAvg} 
                      size="sm"
                      showCount={false}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!isOwner && request.status === 'OPEN' && !hasApplied && (
            <Card>
              <CardHeader>
                <CardTitle>Candidatar-se</CardTitle>
                <CardDescription>
                  Oferece a tua ajuda para este pedido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Mensagem opcional para o solicitante..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="w-full"
                >
                  {isApplying ? 'A candidatar...' : 'Candidatar-me'}
                </Button>
              </CardContent>
            </Card>
          )}

          {hasApplied && !isAcceptedHelper && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-green-600">
                  ✓ Candidatura enviada
                </CardTitle>
                <CardDescription className="text-center">
                  {userApplication?.status === 'APPLIED' ? 'Aguarda a resposta do solicitante' :
                   userApplication?.status === 'REJECTED' ? 'Candidatura rejeitada' :
                   'Estado da candidatura'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userApplication?.message && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">A tua mensagem:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      "{userApplication.message}"
                    </p>
                  </div>
                )}
                
                {canRemoveApplication && (
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveApplication(userApplication.id)}
                      disabled={isRemoving}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {isRemoving ? 'A remover...' : 'Remover candidatura'}
                    </Button>
                  </div>
                )}
                
                {userApplication?.status !== 'APPLIED' && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    <p>
                      {userApplication?.status === 'REJECTED' 
                        ? 'Não é possível remover candidaturas rejeitadas'
                        : 'Estado da candidatura foi alterado'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {acceptedApplication && (
            <Card>
              <CardHeader>
                <CardTitle>Ajudante Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <GoogleAvatar
                      src={acceptedApplication.helper.avatarUrl}
                      alt={acceptedApplication.helper.name}
                      fallback={acceptedApplication.helper.name.split(' ').map((n: string) => n[0]).join('')}
                    />
                    <div>
                      <p className="font-medium">{acceptedApplication.helper.name}</p>
                      {acceptedApplication.helper.ratingAvg > 0 && (
                        <RatingDisplay 
                          rating={acceptedApplication.helper.ratingAvg} 
                          size="sm"
                          showCount={false}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Review Button - Show after request is completed */}
                  {request.status === 'COMPLETED' && (
                    <Button
                      onClick={() => {
                        setReviewTarget({
                          id: acceptedApplication.helper.id,
                          name: acceptedApplication.helper.name
                        });
                        setShowReviewDialog(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Avaliar Ajudante
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold"
            >
              ✕
            </button>
            <ProxiedImage
              src={selectedImage}
              alt="Imagem expandida"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {showReviewDialog && reviewTarget && (
        <ReviewDialog
          isOpen={showReviewDialog}
          onClose={() => {
            setShowReviewDialog(false);
            setReviewTarget(null);
          }}
          requestId={request.id}
          reviewedUserId={reviewTarget.id}
          reviewedUserName={reviewTarget.name}
          onReviewCreated={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}