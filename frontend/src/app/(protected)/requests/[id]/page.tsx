'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_REQUEST, GET_MESSAGES_BY_REQUEST, CAN_REVIEW, GET_MY_REVIEW, GET_REQUEST_REVIEWS } from '@/lib/graphql/queries';
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
import { CompletedReview } from '@/components/completed-review';
import { PublicReviews } from '@/components/public-reviews';
import { ReportDialog } from '@/components/report/report-dialog';
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
  Star,
  Flag
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
    fetchPolicy: 'network-only', // Always fetch from network, ignore cache
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });


  const [applyToRequest] = useMutation(APPLY_TO_REQUEST, {
    refetchQueries: [
      { query: GET_REQUEST, variables: { id: requestId } }
    ],
    awaitRefetchQueries: true,
  });
  const [acceptApplication] = useMutation(ACCEPT_APPLICATION);
  const [removeApplication] = useMutation(REMOVE_APPLICATION, {
    refetchQueries: [
      { query: GET_REQUEST, variables: { id: requestId } }
    ],
    awaitRefetchQueries: true,
  });
  const [updateRequestStatus] = useMutation(UPDATE_REQUEST_STATUS);

  const request = data?.request;
  
  // Check if current user can review each participant
  const { data: canReviewHelperData } = useQuery(CAN_REVIEW, {
    variables: { 
      requestId: requestId, 
      revieweeId: request?.applications?.find(app => app.status === 'ACCEPTED')?.helper.id || '' 
    },
    skip: !requestId || !request?.applications?.find(app => app.status === 'ACCEPTED') || request?.status !== 'DONE',
    fetchPolicy: 'cache-and-network',
  });

  const { data: canReviewRequesterData } = useQuery(CAN_REVIEW, {
    variables: { 
      requestId: requestId, 
      revieweeId: request?.requester?.id || '' 
    },
    skip: !requestId || !request?.requester?.id || request?.status !== 'DONE',
    fetchPolicy: 'cache-and-network',
  });

  // Get my review of the helper
  const { data: myReviewOfHelperData } = useQuery(GET_MY_REVIEW, {
    variables: { 
      requestId: requestId, 
      revieweeId: request?.applications?.find(app => app.status === 'ACCEPTED')?.helper.id || '' 
    },
    skip: !requestId || !request?.applications?.find(app => app.status === 'ACCEPTED') || request?.status !== 'DONE' || canReviewHelperData?.canReview !== false,
    fetchPolicy: 'cache-and-network',
  });

  // Get my review of the requester
  const { data: myReviewOfRequesterData } = useQuery(GET_MY_REVIEW, {
    variables: { 
      requestId: requestId, 
      revieweeId: request?.requester?.id || '' 
    },
    skip: !requestId || !request?.requester?.id || request?.status !== 'DONE' || canReviewRequesterData?.canReview !== false,
    fetchPolicy: 'cache-and-network',
  });

  // Get all reviews for this request (public)
  const { data: requestReviewsData } = useQuery(GET_REQUEST_REVIEWS, {
    variables: { requestId: requestId },
    skip: !requestId || request?.status !== 'DONE',
    fetchPolicy: 'cache-and-network',
  });

  
  useEffect(() => {
    if (requestId) {
      // Connect to WebSocket and join room
      const socket = socketService.connect();
      socketService.joinRequestRoom(requestId);

      // Listen for new applications and status changes
      socketService.onNewApplication(() => {
        refetch();
      });

      socketService.onRequestStatusChange(() => {
        refetch();
      });

      // Listen for application acceptance/rejection
      socketService.onApplicationAccepted(() => {
        refetch();
      });

      // Join user room for personalized notifications
      if (user?.id) {
        socketService.joinUserRoom(user.id);
        
        // Listen for personalized application status updates
        socketService.onApplicationStatus((data) => {
          refetch();
          
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
      await applyToRequest({
        variables: {
          input: {
            requestId: request.id,
            message: applicationMessage.trim() || null,
          },
        },
      });
      
      setApplicationMessage('');
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
      await removeApplication({
        variables: { applicationId },
      });
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
  
  // Check if user can still review
  const canReviewHelper = canReviewHelperData?.canReview;
  const canReviewRequester = canReviewRequesterData?.canReview;

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
              {/* Report Request Button - only show if not owner */}
              {!isOwner && (
                <ReportDialog 
                  type="request"
                  targetId={request.id}
                  targetName={request.title}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    title="Denunciar pedido"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </ReportDialog>
              )}
            </div>
            
            {/* Owner actions */}
            {isOwner && request.status !== 'DONE' && request.status !== 'CANCELLED' && (
              <div className="flex items-center space-x-3">
                <Button variant="info" size="sm" asChild>
                  <Link href={`/requests/${request.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                
                {(request.status === 'OPEN' || request.status === 'IN_PROGRESS') && (
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={handleCloseRequest}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Concluir
                  </Button>
                )}
                
                {request.status === 'OPEN' && (
                  <Button 
                    variant="reject" 
                    size="sm" 
                    onClick={handleCancelRequest}
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
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{application.helper.name}</p>
                            {/* Report User Button */}
                            <ReportDialog 
                              type="user"
                              targetId={application.helper.id}
                              targetName={application.helper.name}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                title="Denunciar utilizador"
                              >
                                <Flag className="h-3 w-3" />
                              </Button>
                            </ReportDialog>
                          </div>
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
                              variant="accept"
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
                <div className="flex-1">
                  <div className="space-y-2">
                    <p className="font-medium">{request.requester.name}</p>
                    {request.requester.ratingAvg > 0 && (
                      <RatingDisplay 
                        rating={request.requester.ratingAvg} 
                        size="sm"
                        showCount={false}
                      />
                    )}
                    {/* Report User Button - only show if not owner */}
                    {!isOwner && (
                      <ReportDialog 
                        type="user"
                        targetId={request.requester.id}
                        targetName={request.requester.name}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-gray-500 hover:text-red-600 text-xs"
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          Denunciar
                        </Button>
                      </ReportDialog>
                    )}
                  </div>
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
                  variant="magic"
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
                      variant="reject"
                      size="sm"
                      onClick={() => handleRemoveApplication(userApplication.id)}
                      disabled={isRemoving}
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
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{acceptedApplication.helper.name}</p>
                          {/* Report User Button - only show if not the accepted helper */}
                          {!isAcceptedHelper && (
                            <ReportDialog 
                              type="user"
                              targetId={acceptedApplication.helper.id}
                              targetName={acceptedApplication.helper.name}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                title="Denunciar utilizador"
                              >
                                <Flag className="h-3 w-3" />
                              </Button>
                            </ReportDialog>
                          )}
                        </div>
                      </div>
                      {acceptedApplication.helper.ratingAvg > 0 && (
                        <RatingDisplay 
                          rating={acceptedApplication.helper.ratingAvg} 
                          size="sm"
                          showCount={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Public Reviews Section - Show to everyone after request is completed */}
          {request.status === 'DONE' && acceptedApplication && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Avaliações
                </CardTitle>
                <CardDescription>
                  Experiência de colaboração
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Show public reviews to everyone */}
                <PublicReviews 
                  reviews={requestReviewsData?.requestReviews || []}
                  requesterId={request.requester.id}
                  helperId={acceptedApplication.helper.id}
                />

                {/* Action buttons - only for participants with available actions */}
                {((isOwner && canReviewHelper) || (isAcceptedHelper && canReviewRequester) || ((isOwner && canReviewHelper === false) && (isAcceptedHelper && canReviewRequester === false))) && (
                  <div className="space-y-3 mt-6 pt-4 border-t">
                    <h4 className="font-medium text-gray-700">Ações dos Participantes</h4>
                    
                    {/* Owner can review the helper */}
                    {isOwner && canReviewHelper && (
                      <Button
                        onClick={() => {
                          setReviewTarget({
                            id: acceptedApplication.helper.id,
                            name: acceptedApplication.helper.name
                          });
                          setShowReviewDialog(true);
                        }}
                        variant="warning"
                        size="sm"
                        className="w-full"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Avaliar {acceptedApplication.helper.name}
                      </Button>
                    )}

                    {/* Helper can review the requester */}
                    {isAcceptedHelper && canReviewRequester && (
                      <Button
                        onClick={() => {
                          setReviewTarget({
                            id: request.requester.id,
                            name: request.requester.name
                          });
                          setShowReviewDialog(true);
                        }}
                        variant="warning"
                        size="sm"
                        className="w-full"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Avaliar {request.requester.name}
                      </Button>
                    )}

                    {/* Show completion message only to participants */}
                    {(isOwner && canReviewHelper === false) && (isAcceptedHelper && canReviewRequester === false) && (
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          ✓ Já fizeste a tua avaliação
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
            // Refetch the canReview queries to update button visibility
            if (isOwner && acceptedApplication) {
              canReviewHelperData && client.refetchQueries({
                include: ['CanReview']
              });
            }
            if (isAcceptedHelper) {
              canReviewRequesterData && client.refetchQueries({
                include: ['CanReview']
              });
            }
          }}
        />
      )}
    </div>
  );
}