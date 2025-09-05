import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('🔗 Connected to WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRequestRoom(requestId: string) {
    if (this.socket) {
      this.socket.emit('join:request', { requestId });
    }
  }

  leaveRequestRoom(requestId: string) {
    if (this.socket) {
      this.socket.emit('leave:request', { requestId });
    }
  }

  onNewMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message:new', callback);
    }
  }

  onNewApplication(callback: (application: any) => void) {
    if (this.socket) {
      this.socket.on('application:new', callback);
    }
  }

  onRequestStatusChange(callback: (data: { requestId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('request:status', callback);
    }
  }

  onApplicationAccepted(callback: (data: { applicationId: string; application: any }) => void) {
    if (this.socket) {
      this.socket.on('application:accepted', callback);
    }
  }

  onApplicationStatus(callback: (data: { type: string; applicationId: string; application: any; message: string }) => void) {
    if (this.socket) {
      this.socket.on('application:status', callback);
    }
  }

  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  joinUserRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join:user', { userId });
    }
  }

  leaveUserRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('leave:user', { userId });
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();