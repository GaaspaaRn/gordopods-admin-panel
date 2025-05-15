
import React, { useEffect, useState } from 'react';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useProducts } from '@/contexts/ProductContext';
import { useCategories } from '@/contexts/CategoryContext';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Menu, X, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialLink } from '@/types';

export default function StoreFront() {
  const { storeSettings, isLoading: isLoadingSettings } = useStoreSettings();
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  if (isLoadingSettings || isLoadingProducts || isLoadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Carregando loja...</p>
        </div>
      </div>
    );
  }

  // Determine primary color with fallback
  const primaryColor = storeSettings.primaryColor || '#9b87f5';
  const secondaryColor = storeSettings.secondaryColor || '#6E59A5';
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ 
        /* Set CSS variables for the custom colors */
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor
      } as React.CSSProperties}
    >
      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
            {/* Logo and store name */}
            <div className="flex items-center">
              {storeSettings.logo ? (
                <img 
                  src={storeSettings.logo} 
                  alt={storeSettings.storeName} 
                  className="h-10 w-auto mr-3"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = "https://via.placeholder.com/150x80?text=Logo";
                  }}
                />
              ) : null}
              
              <Link to="/loja" className="text-xl font-bold" style={{ color: primaryColor }}>
                {storeSettings.storeName}
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button 
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="inline-flex items-center justify-center"
              >
                <span className="sr-only">Abrir menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-10">
              {/* Placeholder for category navigation */}
              <div className="relative">
                {/* Categories will be rendered here in step 3 */}
              </div>
            </nav>
            
            {/* Desktop Cart Button */}
            <div className="hidden md:flex items-center">
              <Button variant="outline" className="ml-8 inline-flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Carrinho (0)</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:hidden`}
        >
          <div className="pt-2 pb-4 px-4 space-y-1 bg-white">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/loja">
                <Home className="h-5 w-5 mr-2" />
                <span>Início</span>
              </Link>
            </Button>
            
            {/* Categories will be rendered here in step 3 */}
            <div className="border-t my-2"></div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start mt-2"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Carrinho (0)</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Banner */}
        {storeSettings.banner && (
          <div className="relative">
            <img 
              src={storeSettings.banner} 
              alt="Banner" 
              className="w-full h-40 sm:h-64 object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = "https://via.placeholder.com/1200x400?text=Banner";
              }}
            />
          </div>
        )}
        
        {/* Store Description */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
              {storeSettings.storeName}
            </h1>
            
            {storeSettings.description && (
              <p className="text-gray-700 mb-6">
                {storeSettings.description}
              </p>
            )}
            
            {/* Social Links */}
            {storeSettings.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6">
                {storeSettings.socialLinks.map((social) => (
                  <SocialButton key={social.id} social={social} />
                ))}
              </div>
            )}
            
            {/* Contact Information */}
            <div className="space-y-2">
              {storeSettings.contactInfo.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{storeSettings.contactInfo.phone}</span>
                </div>
              )}
              
              {storeSettings.contactInfo.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{storeSettings.contactInfo.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Placeholders for Categories and Products list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: secondaryColor }}>
              Categorias
            </h2>
            
            {/* Categories placeholder - will be populated in step 3 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-gray-100 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-200 transition"
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: secondaryColor }}>
              Produtos em Destaque
            </h2>
            
            {/* Products placeholder - will be populated in step 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <div 
                  key={product.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    {product.images.length > 0 && (
                      <img
                        src={(product.images.find(img => img.isMain) || product.images[0]).url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = "https://via.placeholder.com/300?text=Imagem";
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description.substring(0, 100)}
                      {product.description.length > 100 ? '...' : ''}
                    </p>
                    <div className="mt-2 font-bold" style={{ color: secondaryColor }}>
                      {product.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Cart summary placeholder - will be implemented in step 4 */}
      <div id="app-cart-summary" className="hidden">
        {/* Cart summary will be implemented in step 4 */}
      </div>
      
      <footer className="bg-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} {storeSettings.storeName} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for social media buttons
interface SocialButtonProps {
  social: SocialLink;
}

function SocialButton({ social }: SocialButtonProps) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition"
    >
      <span>{social.name}</span>
      <ExternalLink className="h-3.5 w-3.5 ml-1" />
    </a>
  );
}
