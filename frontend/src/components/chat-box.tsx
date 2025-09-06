'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES_BY_REQUEST } from '@/lib/graphql/queries';
import { SEND_MESSAGE } from '@/lib/graphql/mutations';
import { useAuth } from '@/components/auth/auth-provider';
import { socketService } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  requestId: string;
}

export function ChatBox({ requestId }: ChatBoxProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useQuery(GET_MESSAGES_BY_REQUEST, {
    variables: { requestId },
    fetchPolicy: 'cache-and-network',
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE);

  // Initialize messages from query
  useEffect(() => {
    if (data?.messagesByRequest) {
      setMessages(data.messagesByRequest);
      setInitialLoad(false);
    }
  }, [data]);

  // Setup WebSocket listeners
  useEffect(() => {
    const socket = socketService.connect();
    
    socketService.onNewMessage((message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketService.off('message:new');
    };
  }, []);

  // Auto-scroll to bottom only after initial load
  useEffect(() => {
    if (!initialLoad && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, initialLoad]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      const result = await sendMessage({
        variables: {
          input: {
            requestId,
            text: newMessage.trim(),
          },
        },
      });

      // Message will be added via WebSocket, no need for optimistic update

      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(error.message || 'Erro ao enviar mensagem');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-PT');
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-64 border rounded-lg p-4 flex items-center justify-center">
          <p className="text-gray-500">A carregar conversa...</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message: any) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-gray-50">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Ainda não há mensagens. Inicia a conversa!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([dateStr, dateMessages]: [string, any]) => (
              <div key={dateStr}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                    {formatDate(dateStr)}
                  </div>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {dateMessages.map((message: any) => {
                    const isMe = message.sender.id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                          {!isMe && (
                            <GoogleAvatar
                              src={message.sender.avatarUrl}
                              alt={message.sender.name}
                              fallback={message.sender.name?.split(' ').map((n: string) => n[0]).join('')}
                              className="w-6 h-6 flex-shrink-0"
                            />
                          )}
                          
                          <div className={`${isMe ? 'order-first' : ''}`}>
                            <div
                              className={`px-3 py-2 rounded-lg text-sm ${
                                isMe
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-900 border'
                              }`}
                            >
                              {!isMe && (
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  {message.sender.name}
                                </p>
                              )}
                              <p>{message.text}</p>
                            </div>
                            <p className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>

                          {isMe && (
                            <GoogleAvatar
                              src={message.sender.avatarUrl}
                              alt={message.sender.name}
                              fallback={message.sender.name?.split(' ').map((n: string) => n[0]).join('')}
                              className="w-6 h-6 flex-shrink-0"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escreve uma mensagem..."
          disabled={sending}
          className="flex-1"
          maxLength={500}
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || sending}
          size="sm"
        >
          {sending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>

      {newMessage.length > 0 && (
        <p className="text-xs text-gray-500 text-right">
          {newMessage.length}/500 caracteres
        </p>
      )}
    </div>
  );
}