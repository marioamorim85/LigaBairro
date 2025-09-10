'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_REQUEST } from '@/lib/graphql/mutations';
import { GET_SKILLS, SEARCH_REQUESTS } from '@/lib/graphql/queries';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkingMapPicker } from '@/components/working-map-picker';
import { ImageUpload } from '@/components/image-upload';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { ArrowLeft, MapPin, Euro, Calendar, Image } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  title: string;
  description: string;
  category: string;
  isPaid: boolean;
  budgetCents?: number;
  scheduledFrom?: string;
  scheduledTo?: string;
  lat: number;
  lng: number;
  imageUrls?: string[];
}

const categories = ['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem', 'Outros'];

export default function NewRequestPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const isPaid = watch('isPaid', false);
  
  // Watch all form values for validation
  const watchedValues = watch();
  
  // Check if form is ready to submit
  const isFormValid = watchedValues.title && 
                     watchedValues.description && 
                     watchedValues.category && 
                     selectedLocation;

  const [createRequest] = useMutation(CREATE_REQUEST, {
    update(cache, { data }) {
      if (data?.createRequest) {
        // Invalidate the cache for search requests to force refetch
        cache.evict({ fieldName: 'searchRequests' });
      }
    },
    awaitRefetchQueries: true,
    refetchQueries: [{ 
      query: SEARCH_REQUESTS, 
      variables: { 
        input: { 
          category: null,
          status: null,
          limit: 20, 
          offset: 0 
        } 
      } 
    }],
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedLocation) {
      alert('Por favor, selecione uma localização no mapa');
      return;
    }

    // Validate required fields
    if (!data.title || data.title.trim().length < 5) {
      alert('O título deve ter pelo menos 5 caracteres');
      return;
    }

    if (!data.description || data.description.trim().length < 20) {
      alert('A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    if (!data.category) {
      alert('Por favor, selecione uma categoria');
      return;
    }

    setIsSubmitting(true);
    try {
      const input = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        isPaid: Boolean(data.isPaid),
        budgetCents: data.isPaid && data.budgetCents ? Math.max(100, Math.round(data.budgetCents * 100)) : undefined,
        scheduledFrom: data.scheduledFrom || undefined,
        scheduledTo: data.scheduledTo || undefined,
        lat: Number(selectedLocation.lat),
        lng: Number(selectedLocation.lng),
        imageUrls: imageUrls || [],
      };


      const result = await createRequest({ variables: { input } });
      
      if (result.data?.createRequest) {
        router.push(`/requests/${result.data.createRequest.id}`);
      } else {
        throw new Error('Falha ao criar pedido - resposta inválida do servidor');
      }
    } catch (error: any) {
      console.error('Error creating request:', error);
      const errorMessage = error.graphQLErrors?.[0]?.message || 
                          error.networkError?.message || 
                          error.message || 
                          'Erro desconhecido ao criar pedido';
      alert(`Erro ao criar pedido: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/requests">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Pedido</h1>
          <p className="text-gray-600">Descreve a ajuda que precisas em Mozelos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Fields */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título *
                </label>
                <Input
                  {...register('title', { 
                    required: 'Título é obrigatório',
                    minLength: {
                      value: 5,
                      message: 'Título deve ter pelo menos 5 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Título deve ter no máximo 100 caracteres'
                    }
                  })}
                  placeholder="Ex: Ajuda com compras no supermercado"
                  className={errors.title ? 'border-red-500' : ''}
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {watch('title')?.length || 0}/100 caracteres
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição *
                </label>
                <Textarea
                  {...register('description', { 
                    required: 'Descrição é obrigatória',
                    minLength: {
                      value: 20,
                      message: 'Descrição deve ter pelo menos 20 caracteres'
                    },
                    maxLength: {
                      value: 500,
                      message: 'Descrição deve ter no máximo 500 caracteres'
                    }
                  })}
                  placeholder="Descreve em detalhe o que precisas... (mínimo 20 caracteres)"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                  maxLength={500}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {watch('description')?.length || 0}/500 caracteres {(watch('description')?.length || 0) < 20 ? `(mínimo 20)` : ''}
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria *
                </label>
                <select
                  {...register('category', { required: 'Categoria é obrigatória' })}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleciona uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Euro className="w-5 h-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPaid"
                  {...register('isPaid')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label htmlFor="isPaid" className="text-sm font-medium">
                  Este é um pedido remunerado
                </label>
              </div>

              {isPaid && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Orçamento (€)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100000"
                    {...register('budgetCents', { 
                      min: { value: 1, message: 'Orçamento deve ser pelo menos 1€' },
                      max: { value: 100000, message: 'Orçamento não pode exceder 100.000€' }
                    })}
                    placeholder="Ex: 15.00 (mínimo 1€)"
                    className={errors.budgetCents ? 'border-red-500' : ''}
                  />
                  {errors.budgetCents && (
                    <p className="text-red-500 text-sm mt-1">{errors.budgetCents.message}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Horário (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Define quando precisas desta ajuda. Deixa vazio se for flexível.
              </p>
              <div className="space-y-4">
                <DateTimePicker
                  label="Data/hora de início (opcional)"
                  placeholder="Quando precisas que comece?"
                  value={watch('scheduledFrom') || ''}
                  onChange={(value) => setValue('scheduledFrom', value)}
                />
                <DateTimePicker
                  label="Data/hora de fim (opcional)"
                  placeholder="Quando deve terminar?"
                  value={watch('scheduledTo') || ''}
                  onChange={(value) => setValue('scheduledTo', value)}
                />
              </div>
              {watch('scheduledFrom') && watch('scheduledTo') && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    ✓ Horário definido: {(() => {
                      try {
                        const start = new Date(watch('scheduledFrom') || '');
                        const end = new Date(watch('scheduledTo') || '');
                        const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
                        return `${duration}h de duração`;
                      } catch {
                        return 'Horário válido';
                      }
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Imagens (Opcional)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Adiciona até 3 imagens para ilustrar o teu pedido
              </p>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUpload={setImageUrls}
                maxImages={3}
                type="request"
                existingImages={imageUrls}
              />
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Localização *
              </CardTitle>
              <p className="text-sm text-gray-600">
                Seleciona onde precisas de ajuda (apenas dentro de Mozelos)
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium flex items-center">
                  🗺️ <span className="ml-2">Como selecionar localização:</span>
                </p>
                <ul className="text-xs text-blue-700 mt-1 ml-6">
                  <li>• Clica no mapa dentro do círculo azul</li>
                  <li>• Só são aceites localizações em Mozelos</li>
                  <li>• Aparece um marcador na localização selecionada</li>
                </ul>
              </div>
              
              <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-colors">
                <WorkingMapPicker
                  onLocationSelect={(location) => {
                    setSelectedLocation(location);
                  }}
                  selectedLocation={selectedLocation}
                />
              </div>
              
              {selectedLocation && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ Localização selecionada com sucesso!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Coordenadas: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}
              
              {!selectedLocation && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700 font-medium">
                    ⚠️ Localização necessária
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Clica no mapa dentro da área azul para selecionar onde precisas de ajuda
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !isFormValid}
              className="flex-1"
            >
              {isSubmitting ? 'A criar...' : 'Criar Pedido'}
            </Button>
            {/* Card de instruções removido conforme solicitado */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/requests">
                Cancelar
              </Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}