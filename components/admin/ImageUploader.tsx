'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Error al subir imagen');
        return;
      }

      onChange(result.url);
    } catch {
      setError('Error de conexión al subir imagen');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <label className="block mb-2 font-medium text-sm">Imagen</label>
      {value && (
        <div className="relative mb-3 h-40 w-full max-w-sm overflow-hidden rounded-[5px] border border-[#ddd]">
          <Image src={value} alt="Vista previa" fill className="object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-[5px] border border-dashed border-[#ddd] bg-gray-light px-4 py-3 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? 'Subiendo...' : value ? 'Cambiar imagen' : 'Elegir imagen'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
