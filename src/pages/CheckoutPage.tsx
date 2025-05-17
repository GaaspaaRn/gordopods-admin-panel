// No arquivo da página de checkout (src/pages/CheckoutPage.tsx ou similar)

// Adicione no final do formulário:
{/* Botão de finalizar pedido fixo para mobile */}
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden">
  <Button
    onClick={handleSubmit}
    className="w-full py-6 text-lg"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      'Processando...'
    ) : (
      <>
        Finalizar Pedido ({formatCurrency(totalPrice)})
        <Send className="ml-2 h-5 w-5" />
      </>
    )}
  </Button>
</div>

{/* Espaçador para evitar que o conteúdo fique escondido atrás do botão fixo em mobile */}
<div className="h-24 md:hidden"></div>
