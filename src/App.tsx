
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { StoreSettingsProvider } from "./contexts/StoreSettingsContext";
import { ProductProvider } from "./contexts/ProductContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import StoreCustomization from "./pages/admin/StoreCustomization";
import Settings from "./pages/admin/Settings";
import StoreFront from "./pages/store/StoreFront";
import NotFound from "./pages/NotFound";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CategoryProvider>
        <StoreSettingsProvider>
          <ProductProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/loja" element={<StoreFront />} />
                  
                  {/* Protected admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/categorias" 
                    element={
                      <ProtectedRoute>
                        <Categories />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/produtos" 
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/personalizacao" 
                    element={
                      <ProtectedRoute>
                        <StoreCustomization />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/configuracoes" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ProductProvider>
        </StoreSettingsProvider>
      </CategoryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
