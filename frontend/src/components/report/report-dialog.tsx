'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const REPORT_USER_MUTATION = gql`
  mutation ReportUser($input: ReportUserInput!) {
    reportUser(input: $input) {
      id
    }
  }
`;

const REPORT_REQUEST_MUTATION = gql`
  mutation ReportRequest($input: ReportRequestInput!) {
    reportRequest(input: $input) {
      id
    }
  }
`;

interface ReportDialogProps {
  type: 'user' | 'request';
  targetId: string;
  targetName: string;
  triggerButton?: React.ReactNode;
}

const reasonOptions = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'INAPPROPRIATE', label: 'Conteúdo inadequado' },
  { value: 'SCAM', label: 'Burla/Fraude' },
  { value: 'HARASSMENT', label: 'Assédio' },
  { value: 'FAKE_PROFILE', label: 'Perfil falso' },
  { value: 'OFFENSIVE_LANGUAGE', label: 'Linguagem ofensiva' },
  { value: 'FALSE_INFORMATION', label: 'Informação falsa' },
  { value: 'DUPLICATE_POST', label: 'Publicação duplicada' },
  { value: 'PRIVACY_VIOLATION', label: 'Violação de privacidade' },
  { value: 'COPYRIGHT_VIOLATION', label: 'Violação de direitos autorais' },
  { value: 'ILLEGAL_CONTENT', label: 'Conteúdo ilegal' },
  { value: 'ABUSIVE_PRICING', label: 'Preços abusivos' },
  { value: 'OTHER', label: 'Outro' },
];

export function ReportDialog({ type, targetId, targetName, triggerButton }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const [reportUser, { loading: userLoading }] = useMutation(REPORT_USER_MUTATION);
  const [reportRequest, { loading: requestLoading }] = useMutation(REPORT_REQUEST_MUTATION);

  const loading = userLoading || requestLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Por favor selecione um motivo');
      return;
    }

    if (!details.trim() || details.trim().length < 10) {
      toast.error('Por favor forneça detalhes com pelo menos 10 caracteres');
      return;
    }

    try {
      if (type === 'user') {
        await reportUser({
          variables: {
            input: {
              targetUserId: targetId,
              reason,
              details: details.trim(),
            },
          },
        });
      } else {
        await reportRequest({
          variables: {
            input: {
              requestId: targetId,
              reason,
              details: details.trim(),
            },
          },
        });
      }

      toast.success('Denúncia enviada com sucesso');
      setOpen(false);
      setReason('');
      setDetails('');
    } catch (error: any) {
      console.error('Error reporting:', error);
      toast.error(error.message || 'Erro ao enviar denúncia');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Denunciar
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Denunciar {type === 'user' ? 'utilizador' : 'pedido'}</span>
          </DialogTitle>
          <DialogDescription>
            Formulário para denunciar {type === 'user' ? 'um utilizador' : 'um pedido'} por comportamento inadequado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {type === 'user' ? 'Utilizador' : 'Pedido'}: <span className="font-normal">{targetName}</span>
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da denúncia</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              Detalhes <span className="text-xs text-muted-foreground">(mínimo 10 caracteres)</span>
            </Label>
            <Textarea
              id="details"
              placeholder="Descreva o problema com detalhe..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="resize-none h-24"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {details.length}/500
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || !reason || details.trim().length < 10}
            >
              {loading ? 'Enviando...' : 'Enviar denúncia'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}