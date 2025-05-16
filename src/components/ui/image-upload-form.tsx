
import React from 'react';
import { Input } from '@/components/ui/input';

interface ImageUploadFormProps {
  isUploading: boolean;
  recommendedSize?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadForm({
  isUploading,
  recommendedSize,
  onFileChange
}: ImageUploadFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={isUploading}
          className="flex-1"
        />
      </div>
      {recommendedSize && (
        <p className="text-xs text-muted-foreground">{recommendedSize}</p>
      )}
    </div>
  );
}
