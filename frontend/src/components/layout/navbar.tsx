'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Home, Plus, User, Settings, LogOut, Shield, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';

const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationsCount {
    unreadNotificationsCount
  }
`;

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { data: unreadData, refetch: refetchUnreadCount } = useQuery(GET_UNREAD_COUNT, {
    skip: !isAuthenticated,
    pollInterval: 10000, // Poll every 10 seconds for faster updates
    fetchPolicy: 'cache-and-network', // Always check network for fresh data
  });
  
  const unreadCount = unreadData?.unreadNotificationsCount || 0;

  const handleLogout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:4000';
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/requests" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="text-white font-bold text-sm">LB</div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LigaBairro</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/requests"
              className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50"
            >
              Pedidos
            </Link>
            <Link 
              href="/requests/new"
              className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50"
            >
              Criar Pedido
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              asChild
            >
              <Link href="/notifications">
                <Bell className="w-5 h-5" />
                {/* Badge for unread notifications */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button size="sm" asChild className="hidden md:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
              <Link href="/requests/new">
                <Plus className="w-4 h-4 mr-2" />
                Novo Pedido
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <GoogleAvatar
                    src={user?.avatarUrl}
                    alt={user?.name}
                    fallback={user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    className="h-10 w-10"
                  />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/requests" className="cursor-pointer">
                    <Home className="mr-2 h-4 w-4" />
                    Os meus pedidos
                  </Link>
                </DropdownMenuItem>

                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Administração
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}