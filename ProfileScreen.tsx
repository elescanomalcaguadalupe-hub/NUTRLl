import { useMemo, useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (item: MenuItem, change: number, snackText?: string) => void;
  onRemoveItem: (item: MenuItem, snackText?: string) => void;
  onClearCart: () => void;
  onConfirmOrder: (address: string, deliveryTime: string, paymentMethod: 'yape' | 'efectivo') => void;
  onSelectScreen: (screen: 'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth') => void;
  userAddress?: string;
}

export default function CartScreen({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onConfirmOrder,
  onSelectScreen,
  userAddress = '',
}: CartScreenProps) {
  const [address, setAddress] = useState(userAddress);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'efectivo' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    setAddress(userAddress);
  }, [userAddress]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [cart]);

  const handleCheckoutSubmit = () => {
    setError(null);

    if (!address.trim()) {
      setError("Por favor escribe tu dirección de entrega");
      return;
    }

    if (!deliveryTime.trim()) {
      setError("Por favor escribe la hora de entrega");
      return;
    }

    if (!paymentMethod) {
      setError("Por favor elige tu método de pago");
      return;
    }

    // Opens a beautiful confirmation dialog displaying the exact requested message
    setShowSuccessDialog(true);
  };

  const handleConfirmFinalOrder = () => {
    setShowSuccessDialog(false);
    // Finally calls the handler mapped in App.tsx
    if (paymentMethod) {
      onConfirmOrder(address.trim(), deliveryTime.trim(), paymentMethod);
    }
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pb-44 relative">
      {/* App Header */}
      <header className="w-full sticky top-0 z-50 bg-white flex items-center px-4.5 py-3.5 border-b border-slate-100 shadow-xs">
        <button
          onClick={() => onSelectScreen('menu')}
          className="material-icons-span text-[#1B5E20] p-2 -ml-1 rounded-full hover:bg-[#1B5E20]/5 active:scale-95 transition-all text-xl cursor-pointer"
        >
          arrow_back
        </button>
        <h1 className="ml-3 text-base md:text-lg font-black text-slate-800 font-sans">
          Mi Carrito / Pedido
        </h1>
      </header>

      <main className="px-5 pt-5 max-w-xl mx-auto space-y-6">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <span className="material-icons-span text-6xl text-slate-300">shopping_cart</span>
            <h2 className="text-base font-black text-slate-800">Tu carrito está vacío</h2>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-bold">
              Explora las deliciosas y nutritivas opciones que preparamos para ti. ¡Elige tu plato favorito!
            </p>
            <button
              onClick={() => onSelectScreen('menu')}
              className="bg-[#1B5E20] text-white font-black text-xs px-6 py-3.5 rounded-2xl hover:bg-[#144717] active:scale-95 transition-all cursor-pointer shadow-md shadow-[#1B5E20]/15"
            >
              Explorar menú
            </button>
          </div>
        ) : (
          /* Active checkout form layout */
          <>
            {/* 1. Resumen de Pedido */}
            <section className="space-y-3">
              <h2 className="font-black text-xs text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <span>🛒 Resumen del pedido</span>
              </h2>

              <div className="flex flex-col gap-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="bg-white p-3.5 rounded-2xl border border-slate-100 flex gap-4.5 shadow-xs"
                  >
                    <img
                      alt={item.product.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 border border-slate-50"
                      src={item.product.imageUrl}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-xs text-slate-800 font-sans leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {item.product.category} • {item.product.kcal} kcal
                          </p>
                          {item.selectedSnack && (
                            <div className="text-[10px] text-[#1B5E20] font-black mt-1.5 flex flex-wrap items-center gap-1.5 bg-[#1B5E20]/5 px-2.5 py-1 rounded-lg w-fit border border-[#1B5E20]/10">
                              <span>🎁 Snack:</span>
                              <span className="font-extrabold text-slate-700">{item.selectedSnack}</span>
                            </div>
                          )}
                        </div>
                        <span className="font-black text-xs text-slate-800 shrink-0 whitespace-nowrap">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Controls and remove button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-slate-50 rounded-full p-0.5 border border-slate-100">
                          <button
                            onClick={() => onUpdateQuantity(item.product, -1, item.selectedSnack)}
                            className="w-6.5 h-6.5 flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20]/5 active:scale-90 transition-all cursor-pointer rounded-full"
                          >
                            <span className="material-icons-span text-sm font-bold">remove</span>
                          </button>

                          <span className="text-[11px] font-black text-slate-800 px-2.5 w-4 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => onUpdateQuantity(item.product, 1, item.selectedSnack)}
                            className="w-6.5 h-6.5 flex items-center justify-center text-[#1B5E20] hover:bg-[#1B5E20]/5 active:scale-90 transition-all cursor-pointer rounded-full"
                          >
                            <span className="material-icons-span text-sm font-bold">add</span>
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product, item.selectedSnack)}
                          className="material-icons-span text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 active:scale-90 transition-all cursor-pointer text-base"
                          title="Eliminar producto"
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total display segment */}
              <div className="bg-[#1B5E20]/5 rounded-2xl p-4 border border-[#1B5E20]/10 mt-2 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] md:text-xs text-slate-500 font-bold">
                  <span>Subtotal del menú</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-xs text-slate-500 font-bold">
                  <span>Costo de envío</span>
                  <span className="text-[#1B5E20] uppercase text-[10px] tracking-wider">Gratis</span>
                </div>
                <div className="h-px bg-[#1B5E20]/10 my-1.5" />
                <div className="flex justify-between items-center text-[#1B5E20]">
                  <span className="font-extrabold text-xs uppercase tracking-wider">Total a pagar</span>
                  <span className="text-xl md:text-2xl font-black">S/ {subtotal.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* 2. Sección de Entrega */}
            <section className="space-y-2.5">
              <h2 className="font-black text-xs text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                <span>📍 ¿Dónde te entregamos?</span>
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-slate-50 text-slate-800 font-semibold text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1B5E20] focus:bg-white placeholder:text-slate-400 transition-all"
                  placeholder="Ej: Av. Los Jardines 123"
                />
              </div>
            </section>

            {/* 3. Sección de Horario */}
            <section className="space-y-2.5">
              <h2 className="font-black text-xs text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                <span>⏰ ¿A qué hora quieres recibir tu pedido?</span>
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => {
                    setDeliveryTime(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-slate-50 text-slate-800 font-semibold text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1B5E20] focus:bg-white placeholder:text-slate-400 transition-all"
                  placeholder="Ej: 8:00am"
                />
              </div>
            </section>

            {/* 4. Sección de Pago */}
            <section className="space-y-3">
              <h2 className="font-black text-xs text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                <span>💳 Método de pago</span>
              </h2>
              
              <div className="flex flex-col gap-3">
                {/* Yape Option */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('yape');
                      setError(null);
                    }}
                    className={`w-full p-4 rounded-2xl bg-white border-2 text-left flex items-center justify-between transition-all duration-200 shadow-xs cursor-pointer ${
                      paymentMethod === 'yape'
                        ? 'border-[#1B5E20] ring-1 ring-[#1B5E20]/20'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Purple Yape Logo Badge */}
                      <div className="w-10 h-10 rounded-xl bg-[#742d8a] flex items-center justify-center shrink-0 shadow-xs">
                        <span className="text-white text-base font-extrabold tracking-tighter">Y</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-slate-800 font-sans">
                          Yape
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-sans">
                          Pago rápido desde celular
                        </span>
                      </div>
                    </div>
                    {/* Circle Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      paymentMethod === 'yape' ? 'border-[#1B5E20]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'yape' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]" />
                      )}
                    </div>
                  </button>
                  
                  {paymentMethod === 'yape' && (
                    <p className="text-[10px] text-[#1B5E20] font-black pl-1.5 flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] shrink-0 animate-ping" />
                      Te enviaremos el número de Yape al confirmar
                    </p>
                  )}
                </div>

                {/* Efectivo Option */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('efectivo');
                      setError(null);
                    }}
                    className={`w-full p-4 rounded-2xl bg-white border-2 text-left flex items-center justify-between transition-all duration-200 shadow-xs cursor-pointer ${
                      paymentMethod === 'efectivo'
                        ? 'border-[#1B5E20] ring-1 ring-[#1B5E20]/20'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Green cash badge */}
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
                        <span className="material-icons-span text-lg font-bold">payments</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-xs text-slate-800 font-sans">
                          Efectivo
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-sans">
                          Pago contra entrega
                        </span>
                      </div>
                    </div>
                    {/* Circle Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      paymentMethod === 'efectivo' ? 'border-[#1B5E20]' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'efectivo' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]" />
                      )}
                    </div>
                  </button>
                  
                  {paymentMethod === 'efectivo' && (
                    <p className="text-[10px] text-[#1B5E20] font-black pl-1.5 flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] shrink-0 animate-ping" />
                      Paga al recibir tu pedido
                    </p>
                  )}
                </div>
              </div>
            </section>



            {/* Form Validation Errors */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-black rounded-xl flex items-center gap-1.5 animate-pulse mt-2">
                <span className="material-icons-span text-sm">error</span>
                <span>{error}</span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Persistent / Sticky Checkout Trigger Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-5 pt-3 pb-8 border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-xl mx-auto">
            <button
              onClick={handleCheckoutSubmit}
              type="button"
              className="w-full bg-[#1B5E20] text-white py-4 rounded-xl font-black text-xs active:scale-[0.98] transition-all shadow-md shadow-[#1B5E20]/20 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#144717]"
            >
              <span>Confirmar pedido — S/ {subtotal.toFixed(2)}</span>
              <span className="material-icons-span text-base text-white">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Immersive Success confirmation modal overlay */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6.5 max-w-sm w-full border border-slate-100 text-center space-y-5 shadow-2xl relative">
            {/* Ícono grande de check verde arriba ✅ */}
            <div className="w-18 h-18 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full flex items-center justify-center mx-auto">
              <span className="material-icons-span text-4xl">check_circle</span>
            </div>
            
            <div className="space-y-1">
              {/* Título grande */}
              <h3 className="font-black text-xl text-slate-900 tracking-tight">
                ¡Pedido recibido!
              </h3>
              {/* Subtítulo */}
              <p className="text-xs text-slate-500 font-bold">
                Estamos preparando tu pedido 🍽️
              </p>
            </div>

            {/* Sección de datos de entrega con fondo verde claro #E8F5E9 */}
            <div className="bg-[#E8F5E9] p-4 rounded-2xl text-left border border-[#1B5E20]/15 space-y-2.5">
              <p className="text-[10px] text-[#1B5E20] font-black uppercase tracking-wider block border-b border-[#1B5E20]/10 pb-1.5 mb-1">
                Detalle de entrega:
              </p>
              
              <div className="space-y-2 text-[11px] text-slate-700 font-bold leading-normal">
                {/* 📍 Dirección */}
                <div className="flex items-start gap-1.5">
                  <span className="shrink-0">📍</span>
                  <p className="font-extrabold text-slate-800">
                    <span className="text-[#1B5E20] font-black mr-0.5">Dirección:</span> {address}
                  </p>
                </div>

                {/* ⏰ Hora */}
                <div className="flex items-start gap-1.5">
                  <span className="shrink-0">⏰</span>
                  <p className="font-extrabold text-slate-800">
                    <span className="text-[#1B5E20] font-black mr-0.5">Hora:</span> {deliveryTime}
                  </p>
                </div>

                {/* 💳 Pago */}
                <div className="flex items-start gap-1.5">
                  <span className="shrink-0">💳</span>
                  <p className="font-extrabold text-slate-800">
                    <span className="text-[#1B5E20] font-black mr-0.5">Pago:</span> {paymentMethod === 'yape' ? 'Yape 💜' : 'Efectivo 💵'}
                  </p>
                </div>

                {/* 🛒 Productos */}
                <div className="flex items-start gap-1.5 pt-1 border-t border-[#1B5E20]/10">
                  <span className="shrink-0">🛒</span>
                  <div className="space-y-1 w-full">
                    <span className="text-[#1B5E20] font-black block">Productos:</span>
                    <div className="space-y-1 pl-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex flex-col text-[10.5px] leading-tight">
                          <span className="font-extrabold text-slate-800">
                            • {item.product.name} <span className="text-[#1B5E20] font-black ml-0.5">x{item.quantity}</span>
                          </span>
                          {item.selectedSnack && (
                            <span className="text-[9.5px] text-[#1B5E20]/80 font-semibold pl-2.5">
                              🎁 Snack: {item.selectedSnack}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón grande verde: "¡Listo!" */}
            <button
              onClick={handleConfirmFinalOrder}
              type="button"
              className="w-full py-4 bg-[#1B5E20] text-white rounded-xl font-black text-xs hover:bg-[#144717] active:scale-95 transition-all cursor-pointer shadow-md shadow-[#1B5E20]/25 uppercase tracking-wider"
            >
              ¡Listo!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
