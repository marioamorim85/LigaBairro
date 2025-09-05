'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import { GET_REQUEST } from '@/lib/graphql/queries';
import { UPDATE_REQUEST } from '@/lib/graphql/mutations';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { ImageUpload } from '@/components/image-upload';
import { useToast } from '@/components/ui/use-toast';

const categories = ['Compras', 'Reparações', 'Companhia a idosos', 'Limpezas', 'Jardinagem'];

export default function EditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const requestId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [budget, setBudget] = useState('');
  const [scheduledFrom, setScheduledFrom] = useState('');
  const [scheduledTo, setScheduledTo] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { data, loading, error } = useQuery(GET_REQUEST, {
    variables: { id: requestId },
    skip: !requestId,
  });

  const [updateRequest] = useMutation(UPDATE_REQUEST);

  const request = data?.request;

  // Load existing data when component mounts
  useEffect(() => {
    if (request) {
      setTitle(request.title || '');
      setDescription(request.description || '');
      setCategory(request.category || '');
      setIsPaid(request.isPaid || false);
      setBudget(request.budgetCents ? (request.budgetCents / 100).toString() : '');
      setScheduledFrom(request.scheduledFrom || '');
      setScheduledTo(request.scheduledTo || '');
      setImageUrls(request.imageUrls || []);
    }
  }, [request]);

  // Check if user is owner
  const isOwner = user?.id === request?.requesterId;
  

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

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Não tens permissão para editar este pedido</p>
          <Button asChild>
            <Link href={`/requests/${requestId}`}>Voltar ao pedido</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preenche todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateRequest({
        variables: {
          id: requestId,
          input: {
            title: title.trim(),
            description: description.trim(),
            category,
            isPaid,
            budgetCents: isPaid && budget ? Math.round(parseFloat(budget) * 100) : null,
            scheduledFrom: scheduledFrom || null,
            scheduledTo: scheduledTo || null,
            imageUrls,
          },
        },
      });

      toast({
        title: 'Pedido atualizado',
        description: 'As alterações foram guardadas com sucesso.',
      });

      // Redirect back to request detail
      router.push(`/requests/${requestId}`);
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Erro ao guardar alterações.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/requests/${requestId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Editar Pedido</h1>
          <p className="text-gray-600">Atualiza os detalhes do teu pedido</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Atualiza o título, descrição e categoria do pedido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Preciso de ajuda com as compras"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreve detalhadamente o que precisas..."
                maxLength={500}
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Seleciona uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orçamento</CardTitle>
            <CardDescription>
              Define se é um pedido pago e o orçamento disponível
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
                Este é um pedido pago
              </label>
            </div>

            {isPaid && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horário (Opcional)</CardTitle>
            <CardDescription>
              Define quando precisas da ajuda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data/hora de início
              </label>
              <DateTimePicker
                value={scheduledFrom}
                onChange={setScheduledFrom}
                placeholder="Selecionar data e hora de início"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data/hora de fim
              </label>
              <DateTimePicker
                value={scheduledTo}
                onChange={setScheduledTo}
                placeholder="Selecionar data e hora de fim"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
            <CardDescription>
              Adiciona ou remove imagens do pedido
            </CardDescription>
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

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/requests/${requestId}`}>
              Cancelar
            </Link>
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}