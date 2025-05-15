
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Category } from '../types';
import { toast } from 'sonner';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  createCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newOrder: Category[]) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// Initial mock categories
const initialCategories: Category[] = [
  { id: '1', name: 'Pods de Fruta', order: 0 },
  { id: '2', name: 'Pods de Sobremesa', order: 1 },
  { id: '3', name: 'Pods Especiais', order: 2 },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load categories from localStorage or use initial mock data
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Failed to parse stored categories:', error);
        setCategories(initialCategories);
      }
    } else {
      setCategories(initialCategories);
    }
    setIsLoading(false);
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  const createCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      order: categories.length,
    };
    
    setCategories([...categories, newCategory]);
    toast.success('Categoria criada com sucesso!');
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(
      categories.map(category => 
        category.id === id ? { ...category, name } : category
      )
    );
    toast.success('Categoria atualizada com sucesso!');
  };

  const deleteCategory = (id: string) => {
    // Remove the category and reorder remaining categories
    const updatedCategories = categories
      .filter(category => category.id !== id)
      .map((category, index) => ({
        ...category,
        order: index,
      }));
    
    setCategories(updatedCategories);
    toast.success('Categoria excluída com sucesso!');
  };

  const reorderCategories = (newOrder: Category[]) => {
    // Update the order property based on the new array order
    const updatedCategories = newOrder.map((category, index) => ({
      ...category,
      order: index,
    }));
    
    setCategories(updatedCategories);
    toast.success('Ordem das categorias atualizada!');
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
