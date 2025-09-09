'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { GET_USER_BY_ID } from '@/lib/graphql/queries';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Star, MapPin } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params;

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar perfil</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }
  
  if (!data?.user) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Perfil não encontrado</h2>
                <p className="text-gray-600">O perfil que está a tentar ver não existe ou não tem permissão para o ver.</p>
            </div>
        </div>
    );
  }

  const { user } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <GoogleAvatar
          src={user.avatarUrl}
          alt={user.name}
          fallback={user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          className="w-16 h-16"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600">Perfil público</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-gray-800">{user.email}</p>
              </div>
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium mb-1">Sobre</label>
                  <p className="text-gray-800 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <p className="text-gray-800">{user.city}</p>
              </div>
              {user.ratingAvg > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Avaliação</label>
                  <div className="flex items-center text-yellow-600">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="ml-1 font-medium">{user.ratingAvg.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {user.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s: any) => (
                    <Badge key={s.skill.id} variant="secondary">
                      {s.skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {user.lat && user.lng && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">A localização do utilizador é aproximada para proteger a sua privacidade.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
