'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, GET_SKILLS } from '@/lib/graphql/queries';
import { UPDATE_PROFILE, UPDATE_USER_SKILLS } from '@/lib/graphql/mutations';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { MapPicker } from '@/components/map-picker';
import { User, MapPin, Star, Settings, Save } from 'lucide-react';

interface ProfileFormData {
  name: string;
  bio: string;
  lat?: number;
  lng?: number;
}

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: skillsData } = useQuery(GET_SKILLS);
  const skills = skillsData?.skills || [];

  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [updateUserSkills] = useMutation(UPDATE_USER_SKILLS);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('bio', user.bio || '');
      
      if (user.lat && user.lng) {
        setSelectedLocation({ lat: user.lat, lng: user.lng });
        setValue('lat', user.lat);
        setValue('lng', user.lng);
      }
      
      if (user.skills) {
        const userSkillIds = user.skills.map((us: any) => us.skill.id);
        setSelectedSkills(userSkillIds);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      // Update basic profile
      await updateProfile({
        variables: {
          input: {
            name: data.name,
            bio: data.bio,
            lat: selectedLocation?.lat,
            lng: selectedLocation?.lng,
          },
        },
      });

      // Update skills
      await updateUserSkills({
        variables: {
          input: {
            skillIds: selectedSkills,
          },
        },
      });

      refetchUser();
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <GoogleAvatar
          src={user.avatarUrl}
          alt={user.name}
          fallback={user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
          className="w-16 h-16"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gere as suas informações pessoais</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome *
                </label>
                <Input
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sobre mim
                </label>
                <Textarea
                  {...register('bio')}
                  rows={4}
                  placeholder="Conte um pouco sobre si..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 500 caracteres
                </p>
              </div>

              {/* City (read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cidade
                </label>
                <Input
                  value={user.city}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fixa em Mozelos para o MVP
                </p>
              </div>

              {/* Rating */}
              {user.ratingAvg > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Avaliação
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 font-medium">
                        {user.ratingAvg.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Baseado nas avaliações dos vizinhos
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Competências</CardTitle>
              <CardDescription>
                Seleciona as áreas onde podes ajudar os vizinhos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill: any) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      selectedSkills.includes(skill.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
              
              {selectedSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Competências selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skillId) => {
                      const skill = skills.find((s: any) => s.id === skillId);
                      return skill ? (
                        <Badge key={skillId} variant="secondary">
                          {skill.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Localização Aproximada
              </CardTitle>
              <CardDescription>
                Ajuda os vizinhos a encontrar ajuda perto deles (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden border">
                <MapPicker
                  onLocationSelect={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              </div>
              
              {selectedLocation && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Localização selecionada
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                A sua localização exata nunca é partilhada. Apenas uma localização aproximada dentro de Mozelos.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full"
                  size="lg"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Alterações
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Última atualização: {user.updatedAt && !isNaN(new Date(user.updatedAt).getTime()) ? new Date(user.updatedAt).toLocaleDateString('pt-PT') : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}