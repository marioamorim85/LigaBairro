'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  User, 
  MessageCircle, 
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';

const GET_NOTIFICATIONS = gql`
  query GetUserNotifications($offset: Int, $limit: Int) {
    getUserNotifications(offset: $offset, limit: $limit) {
      id
      type
      title
      message
      read
      createdAt
      data
    }
  }
`;

const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const router = useRouter();
  const client = useApolloClient();
  const { toast } = useToast();

  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { offset: 0, limit: 50 },
    pollInterval: 10000, // Poll every 10 seconds like navbar
    fetchPolicy: 'cache-and-network', // Always check network for fresh data
    notifyOnNetworkStatusChange: true, // Update UI when fetching new data
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ, {
    onCompleted: (data) => {
      refetch();
      // Invalidate the unread count cache to force navbar update
      client.refetchQueries({
        include: ['GetUnreadNotificationsCount']
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao marcar como lida: ' + error.message,
      });
    }
  });

  const [markAllRead] = useMutation(MARK_ALL_READ, {
    onCompleted: () => {
      toast({
        title: 'Sucesso',
        description: 'Todas as notificações marcadas como lidas',
      });
      refetch();
      // Invalidate the unread count cache to force navbar update
      client.refetchQueries({
        include: ['GetUnreadNotificationsCount']
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao marcar todas como lidas: ' + error.message,
      });
    }
  });

  const notifications = data?.getUserNotifications || [];

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
  
  const filteredNotifications = notifications.filter((notification: any) => {
    if (selectedFilter === 'unread') {
      return !notification.read;
    }
    return true;
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_APPLICATION':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'APPLICATION_ACCEPTED':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'APPLICATION_REJECTED':
        return <User className="w-5 h-5 text-red-500" />;
      case 'NEW_MESSAGE':
        return <MessageCircle className="w-5 h-5 text-indigo-500" />;
      case 'REQUEST_STATUS_CHANGED':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'NEW_REVIEW':
        return <FileText className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        variables: { id: notificationId }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationLink = (notification: any) => {
    const data = notification.data || {};
    
    switch (notification.type) {
      case 'NEW_APPLICATION':
      case 'APPLICATION_ACCEPTED':
      case 'APPLICATION_REJECTED':
      case 'REQUEST_STATUS_CHANGED':
        return data.requestId ? `/requests/${data.requestId}` : null;
      case 'NEW_MESSAGE':
        return data.requestId ? `/requests/${data.requestId}` : null;
      case 'NEW_REVIEW':
        return data.requestId ? `/requests/${data.requestId}` : null;
      default:
        return null;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if not already read
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }
    
    // Navigate to the appropriate page
    const link = getNotificationLink(notification);
    if (link) {
      router.push(link);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/requests">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Notificações
              </h1>
              <p className="text-gray-600 text-lg">
                Mantém-te atualizado com as tuas interações
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Bell className="w-4 h-4 mr-1" />
              {notifications.length} notificações
            </span>
            {unreadCount > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600 font-medium">
                  {unreadCount} não lidas
                </span>
              </>
            )}
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllRead}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar Todas Como Lidas
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          size="sm"
        >
          Todas ({notifications.length})
        </Button>
        <Button
          variant={selectedFilter === 'unread' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('unread')}
          size="sm"
        >
          Não Lidas ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar notificações. Tente novamente.</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {selectedFilter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
          </h3>
          <p className="text-gray-500">
            {selectedFilter === 'unread' 
              ? 'Todas as notificações foram lidas!' 
              : 'As tuas notificações aparecerão aqui.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification: any) => (
            <Card 
              key={notification.id}
              className={`transition-all duration-300 hover:shadow-md cursor-pointer ${
                !notification.read 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-base font-semibold text-gray-900">
                          {notification.title}
                        </CardTitle>
                        {!notification.read && (
                          <Badge className="bg-red-500 hover:bg-red-600">Nova</Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-600 mb-2">
                        {notification.message}
                      </CardDescription>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(notification.createdAt).toLocaleString('pt-PT')}
                      </div>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleMarkAsRead(notification.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}