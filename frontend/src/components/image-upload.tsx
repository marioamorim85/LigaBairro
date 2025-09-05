'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ProxiedImage } from './proxied-image';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxImages?: number;
  type?: 'avatar' | 'request';
  existingImages?: string[];
  className?: string;
}

export function ImageUpload({
  onUpload,
  maxImages = 3,
  type = 'request',
  existingImages = [],
  className = '',
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update images when existingImages prop changes
  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const endpoint = type === 'avatar' ? '/uploads/avatar' : '/uploads/request-image';
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if we would exceed max images
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Muitas imagens',
        description: `Máximo de ${maxImages} imagem${maxImages > 1 ? 'ns' : ''} permitida${maxImages > 1 ? 's' : ''}.`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const url = await uploadImage(file);
        // Update progress
        const progress = ((index + 1) / files.length) * 100;
        setUploadProgress(progress);
        return url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newUrls];
      
      setImages(updatedImages);
      onUpload(updatedImages);
      
      toast({
        title: 'Upload concluído',
        description: `${files.length} imagem${files.length > 1 ? 'ns' : ''} carregada${files.length > 1 ? 's' : ''} com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message || 'Erro ao carregar imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onUpload(updatedImages);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>
            {type === 'avatar' ? 'Carregar Avatar' : 'Carregar Imagens'}
          </span>
        </Button>
        
        <span className="text-sm text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={maxImages > 1}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Carregando...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${type === 'avatar' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                <ProxiedImage
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={triggerFileSelect}
        >
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {type === 'avatar' 
              ? 'Clique para carregar seu avatar' 
              : 'Clique para carregar imagens do pedido'
            }
          </p>
          <p className="text-sm text-gray-400 mt-1">
            PNG, JPG, WebP até 5MB
          </p>
        </div>
      )}
    </div>
  );
}