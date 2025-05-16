// No arquivo da página do carrinho (src/pages/CartPage.tsx ou similar)

// Importe o componente FixedCheckoutButton
import { FixedCheckoutButton } from '../components/FixedCheckoutButton';

// No final do componente, adicione:
{/* Botão de finalizar pedido fixo para mobile */}
{items.length > 0 && (
  <FixedCheckoutButton
    totalPrice={totalPrice}
    onClick={handleCheckout}
  />
)}
