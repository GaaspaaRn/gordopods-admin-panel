
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Product, ProductImage, ProductVariationGroup, ProductVariationOption } from '../types';
import { toast } from 'sonner';
import { useCategories } from './CategoryContext';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  addProductImage: (productId: string, url: string, isMain?: boolean) => void;
  updateProductImage: (productId: string, imageId: string, updates: Partial<Omit<ProductImage, 'id'>>) => void;
  removeProductImage: (productId: string, imageId: string) => void;
  reorderProductImages: (productId: string, imageIds: string[]) => void;
  setMainProductImage: (productId: string, imageId: string) => void;
  addVariationGroup: (productId: string, group: Omit<ProductVariationGroup, 'id'>) => string;
  updateVariationGroup: (productId: string, groupId: string, updates: Partial<Omit<ProductVariationGroup, 'id'>>) => void;
  removeVariationGroup: (productId: string, groupId: string) => void;
  addVariationOption: (productId: string, groupId: string, option: Omit<ProductVariationOption, 'id'>) => string;
  updateVariationOption: (productId: string, groupId: string, optionId: string, updates: Partial<Omit<ProductVariationOption, 'id'>>) => void;
  removeVariationOption: (productId: string, groupId: string, optionId: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getActiveProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Sample product data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Gordopod Classic',
    description: 'O pod mais vendido da nossa loja, sabor de tabaco clássico.',
    price: 49.90,
    categoryId: '1',
    images: [
      {
        id: '1',
        url: 'https://via.placeholder.com/300x300?text=Pod+Classic',
        isMain: true,
        order: 0
      },
      {
        id: '2',
        url: 'https://via.placeholder.com/300x300?text=Pod+Classic+2',
        isMain: false,
        order: 1
      }
    ],
    variationGroups: [
      {
        id: '1',
        name: 'Sabor',
        options: [
          { id: '1', name: 'Tabaco', priceModifier: 0 },
          { id: '2', name: 'Menta', priceModifier: 5 },
          { id: '3', name: 'Frutas', priceModifier: 10 }
        ],
        required: true,
        multipleSelection: false
      },
      {
        id: '2',
        name: 'Nicotina',
        options: [
          { id: '1', name: '0mg', priceModifier: 0 },
          { id: '2', name: '3mg', priceModifier: 0 },
          { id: '3', name: '5mg', priceModifier: 5 }
        ],
        required: true,
        multipleSelection: false
      }
    ],
    stockControl: true,
    stockQuantity: 100,
    autoStockReduction: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Gordopod Premium',
    description: 'Nossa linha premium com maior duração e mais puffs.',
    price: 79.90,
    categoryId: '2',
    images: [
      {
        id: '1',
        url: 'https://via.placeholder.com/300x300?text=Pod+Premium',
        isMain: true,
        order: 0
      }
    ],
    variationGroups: [
      {
        id: '1',
        name: 'Sabor',
        options: [
          { id: '1', name: 'Tabaco Premium', priceModifier: 0 },
          { id: '2', name: 'Hortelã', priceModifier: 0 }
        ],
        required: true,
        multipleSelection: false
      }
    ],
    stockControl: true,
    stockQuantity: 50,
    autoStockReduction: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { categories } = useCategories();
  
  // Load products from localStorage on mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        } else {
          // Use initial data if no stored data
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(initialProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Save products to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isLoading]);
  
  // Helper to find product index
  const findProductIndex = (id: string) => {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return index;
  };

  // CRUD operations for products
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast.success('Produto adicionado com sucesso!');
    return id;
  };
  
  const updateProduct = (id: string, updates: Partial<Product>) => {
    try {
      setProducts(prev => prev.map(product => 
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      ));
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      toast.error('Erro ao atualizar produto');
    }
  };
  
  const deleteProduct = (id: string) => {
    try {
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Produto removido com sucesso!');
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      toast.error('Erro ao remover produto');
    }
  };
  
  const toggleProductStatus = (id: string) => {
    try {
      setProducts(prev => prev.map(product => 
        product.id === id
          ? { ...product, active: !product.active, updatedAt: new Date().toISOString() }
          : product
      ));
      toast.success('Status do produto alterado com sucesso!');
    } catch (error) {
      console.error(`Error toggling product status ${id}:`, error);
      toast.error('Erro ao alterar status do produto');
    }
  };
  
  // Product image operations
  const addProductImage = (productId: string, url: string, isMain: boolean = false) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const newImage: ProductImage = {
        id: crypto.randomUUID(),
        url,
        isMain: isMain || product.images.length === 0, // First image is main by default
        order: product.images.length
      };
      
      // If the new image is main, make all others not main
      let updatedImages = [...product.images];
      if (newImage.isMain) {
        updatedImages = updatedImages.map(img => ({ ...img, isMain: false }));
      }
      
      product.images = [...updatedImages, newImage];
      productCopy[productIndex] = product;
      
      setProducts(productCopy);
      toast.success('Imagem adicionada com sucesso!');
    } catch (error) {
      console.error(`Error adding image to product ${productId}:`, error);
      toast.error('Erro ao adicionar imagem');
    }
  };
  
  const updateProductImage = (productId: string, imageId: string, updates: Partial<Omit<ProductImage, 'id'>>) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      product.images = product.images.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      );
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Imagem atualizada com sucesso!');
    } catch (error) {
      console.error(`Error updating image ${imageId} for product ${productId}:`, error);
      toast.error('Erro ao atualizar imagem');
    }
  };
  
  const removeProductImage = (productId: string, imageId: string) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const removedImage = product.images.find(img => img.id === imageId);
      product.images = product.images.filter(img => img.id !== imageId);
      
      // If removed image was main, set the first remaining image as main
      if (removedImage?.isMain && product.images.length > 0) {
        product.images[0].isMain = true;
      }
      
      // Update order of remaining images
      product.images = product.images.map((img, index) => ({
        ...img,
        order: index
      }));
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Imagem removida com sucesso!');
    } catch (error) {
      console.error(`Error removing image ${imageId} from product ${productId}:`, error);
      toast.error('Erro ao remover imagem');
    }
  };
  
  const reorderProductImages = (productId: string, imageIds: string[]) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const imageMap = new Map(product.images.map(img => [img.id, img]));
      
      product.images = imageIds.map((id, index) => ({
        ...imageMap.get(id)!,
        order: index
      }));
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Ordem das imagens atualizada com sucesso!');
    } catch (error) {
      console.error(`Error reordering images for product ${productId}:`, error);
      toast.error('Erro ao reordenar imagens');
    }
  };
  
  const setMainProductImage = (productId: string, imageId: string) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      product.images = product.images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }));
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Imagem principal definida com sucesso!');
    } catch (error) {
      console.error(`Error setting main image ${imageId} for product ${productId}:`, error);
      toast.error('Erro ao definir imagem principal');
    }
  };
  
  // Variation group operations
  const addVariationGroup = (productId: string, group: Omit<ProductVariationGroup, 'id'>) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const newGroup: ProductVariationGroup = {
        ...group,
        id: crypto.randomUUID()
      };
      
      product.variationGroups = [...product.variationGroups, newGroup];
      productCopy[productIndex] = product;
      
      setProducts(productCopy);
      toast.success('Grupo de variação adicionado com sucesso!');
      return newGroup.id;
    } catch (error) {
      console.error(`Error adding variation group to product ${productId}:`, error);
      toast.error('Erro ao adicionar grupo de variação');
      return '';
    }
  };
  
  const updateVariationGroup = (productId: string, groupId: string, updates: Partial<Omit<ProductVariationGroup, 'id'>>) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      product.variationGroups = product.variationGroups.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      );
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Grupo de variação atualizado com sucesso!');
    } catch (error) {
      console.error(`Error updating variation group ${groupId} for product ${productId}:`, error);
      toast.error('Erro ao atualizar grupo de variação');
    }
  };
  
  const removeVariationGroup = (productId: string, groupId: string) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      product.variationGroups = product.variationGroups.filter(group => group.id !== groupId);
      productCopy[productIndex] = product;
      
      setProducts(productCopy);
      toast.success('Grupo de variação removido com sucesso!');
    } catch (error) {
      console.error(`Error removing variation group ${groupId} from product ${productId}:`, error);
      toast.error('Erro ao remover grupo de variação');
    }
  };
  
  // Variation option operations
  const addVariationOption = (productId: string, groupId: string, option: Omit<ProductVariationOption, 'id'>) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const groupIndex = product.variationGroups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error(`Variation group ${groupId} not found for product ${productId}`);
      }
      
      const newOption: ProductVariationOption = {
        ...option,
        id: crypto.randomUUID()
      };
      
      product.variationGroups[groupIndex].options = [...product.variationGroups[groupIndex].options, newOption];
      productCopy[productIndex] = product;
      
      setProducts(productCopy);
      toast.success('Opção de variação adicionada com sucesso!');
      return newOption.id;
    } catch (error) {
      console.error(`Error adding variation option to group ${groupId} for product ${productId}:`, error);
      toast.error('Erro ao adicionar opção de variação');
      return '';
    }
  };
  
  const updateVariationOption = (productId: string, groupId: string, optionId: string, updates: Partial<Omit<ProductVariationOption, 'id'>>) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const groupIndex = product.variationGroups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error(`Variation group ${groupId} not found for product ${productId}`);
      }
      
      product.variationGroups[groupIndex].options = product.variationGroups[groupIndex].options.map(option => 
        option.id === optionId ? { ...option, ...updates } : option
      );
      
      productCopy[productIndex] = product;
      setProducts(productCopy);
      toast.success('Opção de variação atualizada com sucesso!');
    } catch (error) {
      console.error(`Error updating variation option ${optionId} in group ${groupId} for product ${productId}:`, error);
      toast.error('Erro ao atualizar opção de variação');
    }
  };
  
  const removeVariationOption = (productId: string, groupId: string, optionId: string) => {
    try {
      const productIndex = findProductIndex(productId);
      const productCopy = [...products];
      const product = { ...productCopy[productIndex] };
      
      const groupIndex = product.variationGroups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error(`Variation group ${groupId} not found for product ${productId}`);
      }
      
      product.variationGroups[groupIndex].options = product.variationGroups[groupIndex].options.filter(option => option.id !== optionId);
      productCopy[productIndex] = product;
      
      setProducts(productCopy);
      toast.success('Opção de variação removida com sucesso!');
    } catch (error) {
      console.error(`Error removing variation option ${optionId} from group ${groupId} for product ${productId}:`, error);
      toast.error('Erro ao remover opção de variação');
    }
  };
  
  // Query operations
  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };
  
  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId);
  };
  
  const getActiveProducts = () => {
    return products.filter(product => product.active);
  };

  return (
    <ProductContext.Provider 
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        addProductImage,
        updateProductImage,
        removeProductImage,
        reorderProductImages,
        setMainProductImage,
        addVariationGroup,
        updateVariationGroup,
        removeVariationGroup,
        addVariationOption,
        updateVariationOption,
        removeVariationOption,
        getProductById,
        getProductsByCategory,
        getActiveProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
