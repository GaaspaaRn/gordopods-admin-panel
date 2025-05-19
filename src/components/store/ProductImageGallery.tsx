
import React, { useState } from 'react';
import { ProductImage } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ProductImageGallery = ({ 
  images, 
  productName,
  className 
}: ProductImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});
  
  if (!images || images.length === 0) {
    return (
      <div className={cn("bg-gray-100 aspect-square flex items-center justify-center rounded-md", className)}>
        <div className="flex flex-col items-center text-gray-400">
          <ImageOff size={40} />
          <span className="mt-2">Sem imagem</span>
        </div>
      </div>
    );
  }
  
  // Sort images by order property
  const sortedImages = [...images]
    .sort((a, b) => a.order - b.order)
    .filter(img => img.url && img.url.trim() !== '');
  
  // Make sure main image is first
  const mainImage = sortedImages.find(img => img.isMain);
  if (mainImage) {
    const mainIndex = sortedImages.indexOf(mainImage);
    if (mainIndex > 0) {
      sortedImages.splice(mainIndex, 1);
      sortedImages.unshift(mainImage);
    }
  }
  
  // Se depois da filtragem não há imagens, mostrar placeholder
  if (sortedImages.length === 0) {
    return (
      <div className={cn("bg-gray-100 aspect-square flex items-center justify-center rounded-md", className)}>
        <div className="flex flex-col items-center text-gray-400">
          <ImageOff size={40} />
          <span className="mt-2">Sem imagem válida</span>
        </div>
      </div>
    );
  }
  
  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  // Se a imagem ativa tem erro, usar a próxima disponível
  if (imgError[sortedImages[activeIndex]?.id]) {
    const nextValidIndex = sortedImages.findIndex((img, idx) => 
      !imgError[img.id] && idx !== activeIndex
    );
    
    if (nextValidIndex !== -1) {
      setActiveIndex(nextValidIndex);
    }
  }

  const handleImageError = (id: string) => {
    setImgError(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main image */}
      <div 
        className="aspect-square bg-gray-50 rounded-md overflow-hidden cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img
          src={imgError[sortedImages[activeIndex].id] 
            ? "https://via.placeholder.com/400?text=Imagem+Indisponível" 
            : sortedImages[activeIndex].url}
          alt={`${productName} - Imagem ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={() => handleImageError(sortedImages[activeIndex].id)}
        />
      </div>
      
      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0",
                index === activeIndex 
                  ? "border-primary" 
                  : "border-transparent hover:border-gray-300",
                imgError[image.id] ? "bg-gray-100" : ""
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagem ${index + 1}`}
              disabled={imgError[image.id]}
            >
              <img
                src={imgError[image.id] 
                  ? "https://via.placeholder.com/100?text=Indisponível" 
                  : image.url}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(image.id)}
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Modal for image zoom */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[80vw] p-1 md:p-2 max-h-[90vh]">
          <div className="relative h-full max-h-[80vh]">
            <img
              src={imgError[sortedImages[activeIndex].id] 
                ? "https://via.placeholder.com/800?text=Imagem+Indisponível" 
                : sortedImages[activeIndex].url}
              alt={`${productName} - Imagem ampliada ${activeIndex + 1}`}
              className="w-full h-full object-contain"
              onError={() => handleImageError(sortedImages[activeIndex].id)}
            />
            
            {sortedImages.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
