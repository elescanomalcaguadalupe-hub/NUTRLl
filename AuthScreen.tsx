import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, CartItem } from '../types';

interface MenuScreenProps {
  items: MenuItem[];
  cart: CartItem[];
  onUpdateQuantity: (item: MenuItem, change: number, snackText?: string) => void;
  onGoToCart: () => void;
  onSelectScreen: (screen: 'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth' | 'notifications') => void;
  userAddress?: string;
  onUpdateAddress?: (address: string) => void;
  hasNotifications?: boolean;
}

export default function MenuScreen({
  items,
  cart,
  onUpdateQuantity,
  onGoToCart,
  onSelectScreen,
  userAddress = '',
  onUpdateAddress,
  hasNotifications = false,
}: MenuScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [veggieToast, setVeggieToast] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<MenuItem | null>(null);
  const [selectedSnack, setSelectedSnack] = useState<string | null>(null);
  const [customFruitText, setCustomFruitText] = useState('');
  const [snackError, setSnackError] = useState<string | null>(null);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState(userAddress);

  useEffect(() => {
    setNewAddress(userAddress);
  }, [userAddress]);

  const handleOpenAddressModal = () => {
    setNewAddress(userAddress);
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    if (onUpdateAddress) {
      onUpdateAddress(newAddress.trim());
    }
    setShowAddressModal(false);
  };

  const getSnackOptionsForProduct = (productId: string) => {
    switch (productId) {
      case '1':
        return {
          optionA: {
            name: 'Bolitas energéticas de avena y maní',
            desc: 'Avena + maní + miel, caseras',
            kcal: '120 kcal'
          },
          optionB: {
            name: 'Fruta',
            desc: 'Natural y fresca',
            kcal: ''
          },
          placeholderB: '¿Plátano o Papaya? Escribe tu elección'
        };
      case '2':
        return {
          optionA: {
            name: 'Galleta de avena',
            desc: 'Casera, sin conservantes',
            kcal: '95 kcal'
          },
          optionB: {
            name: 'Fruta',
            desc: 'Natural y fresca',
            kcal: ''
          },
          placeholderB: '¿Plátano o Naranja? Escribe tu elección'
        };
      case '3':
        return {
          optionA: {
            name: 'Chips de camote al horno',
            desc: 'Sin fritura, con sal de mar',
            kcal: '80 kcal'
          },
          optionB: {
            name: 'Fruta',
            desc: 'Natural y fresca',
            kcal: ''
          },
          placeholderB: '¿Mango o Papaya? Escribe tu elección'
        };
      default:
        return {
          optionA: {
            name: 'Bolitas energéticas de avena y maní',
            desc: 'Avena + maní + miel, caseras',
            kcal: '120 kcal'
          },
          optionB: {
            name: 'Fruta',
            desc: 'Natural y fresca',
            kcal: ''
          },
          placeholderB: '¿Mango o Papaya? Escribe tu elección'
        };
    }
  };

  const handleOpenDetails = (item: MenuItem) => {
    setSelectedProductDetails(item);
    setSelectedSnack(null);
    setCustomFruitText('');
    setSnackError(null);
  };

  // Categories list
  const categories = ['Todos', 'Sándwich', 'Wraps', 'Platos', 'Veggie'];

  // Match selectedCategory & search query
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Veggie shouldn't match any real items right now since they are "Coming soon"
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch = !cleanSearch || 
        item.name.toLowerCase().includes(cleanSearch) ||
        item.description.toLowerCase().includes(cleanSearch) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(cleanSearch));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Map product IDs to actual quantities in cart for real-time display
  const quantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach(item => {
      map[item.product.id] = item.quantity;
    });
    return map;
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, current) => acc + current.quantity, 0);
  }, [cart]);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Veggie') {
      setVeggieToast(true);
      // Automatically hide veggie toast after 3.5 seconds
      setTimeout(() => {
        setVeggieToast(false);
      }, 3500);
    } else {
      setSelectedCategory(cat);
    }
  };

  return (
    <div className="bg-[#fcfdfd] text-on-background min-h-screen pb-32 relative">
      {/* Toast Alert for vegetarian option under preparation */}
      <AnimatePresence>
        {veggieToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-4 inset-x-4 z-50 bg-[#1B5E20] text-white py-3.5 px-4 rounded-xl shadow-xl border border-white/20 max-w-sm mx-auto flex items-center gap-3"
          >
            <span className="material-icons-span text-white text-xl">eco</span>
            <div className="flex-1">
              <p className="text-xs font-black leading-tight">Próximamente 🌱</p>
              <p className="text-[10.5px] font-semibold opacity-90 mt-0.5">Estamos preparando opciones vegetarianas para ti</p>
            </div>
            <button
              onClick={() => setVeggieToast(false)}
              className="material-icons-span text-white/70 hover:text-white transition-colors text-base"
            >
              close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TopAppBar */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5 px-5 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          {/* campus location selector */}
          <div 
            onClick={handleOpenAddressModal}
            className="flex items-center gap-2 max-w-[240px] cursor-pointer hover:bg-slate-50 p-1 px-2 rounded-xl transition-all"
            title={userAddress || '📍 ¿Dónde te entregamos? Toca para agregar'}
          >
            <span className="material-icons-span text-[#1B5E20] text-xl shrink-0">location_on</span>
            <div className="text-left leading-tight truncate flex-1">
              <span className="text-[9px] font-black text-[#1B5E20] tracking-wider uppercase block leading-none">Entrega</span>
              <p className="text-xs font-black text-[#161d1f] mt-0.5 truncate" style={{ minWidth: 0 }}>
                {userAddress || '📍 ¿Dónde te entregamos? Toca para agregar'}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-black text-[#1B5E20] tracking-tighter">NUTRIBOX</h2>

          <button 
            onClick={() => onSelectScreen('notifications')}
            className="relative p-2 rounded-full hover:bg-slate-50 transition-colors border-none bg-transparent flex items-center justify-center cursor-pointer"
            aria-label="Notificaciones"
          >
            <span className="material-icons-span text-[#1B5E20] text-xl">notifications</span>
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#fc9d41] rounded-full ring-1 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </header>

      <main className="px-5 pt-4 max-w-2xl mx-auto space-y-4">
        {/* Search Input Section */}
        <section className="relative">
          <span className="material-icons-span absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/75 select-none text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-on-surface border border-slate-200 rounded-[14px] py-3.5 pl-11 pr-11 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all shadow-xs placeholder:text-on-surface-variant/60"
            placeholder="¿Qué te apetece hoy?"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface material-icons-span text-base p-1 hover:bg-slate-200/50 rounded-full"
            >
              close
            </button>
          )}
        </section>

        {/* Categories Horizontal Scroll */}
        <section className="overflow-x-auto py-1 flex gap-2 hide-scrollbar snap-x whitespace-nowrap scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4.5 py-2.5 rounded-full font-extrabold text-[11px] select-none snap-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1B5E20] text-white shadow-sm shadow-[#1B5E20]/20'
                    : 'bg-white text-on-surface-variant hover:text-on-surface border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'Veggie' ? '🌱 Veggie' : cat}
              </button>
            );
          })}
        </section>

        {/* Big stacked Cards for Delivery View (one below the another, full width) */}
        <section className="space-y-4 pt-1">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
              <span className="material-icons-span text-3xl text-slate-300">sentiment_dissatisfied</span>
              <p className="font-bold text-xs">No hay productos en esta categoría o búsqueda.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }} 
                className="text-[11px] text-[#1B5E20] font-black underline cursor-pointer mt-1"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const count = quantityMap[item.id] || 0;
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-slate-150 transition-all hover:shadow-md flex flex-col w-full relative"
                >
                  {/* Image Header with Detail Action */}
                  <div 
                    onClick={() => handleOpenDetails(item)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50 cursor-pointer group"
                  >
                    <img
                      alt={item.name}
                      src={item.imageUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient overlay for better text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

                    {/* Tag Badges (No 'Mediterráneo', strictly: Nuevo, Top ventas, Alto en proteína, Recomendado, Criollo) */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%] pointer-events-none">
                      {item.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-[#1B5E20]/95 text-white px-2.5 py-1 rounded-full font-sans font-black text-[9px] uppercase tracking-wider shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm font-sans font-black text-[10px] text-on-surface pointer-events-none">
                      <span className="text-[#1B5E20]">⚡</span>
                      <span>{item.kcal} kcal</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4.5 flex flex-col justify-between">
                    {/* Clickable text info area to open modal */}
                    <div 
                      onClick={() => handleOpenDetails(item)}
                      className="cursor-pointer space-y-1.5 group mb-3.5"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-extrabold text-sm text-on-surface group-hover:text-[#1B5E20] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <span className="font-black text-sm text-[#1B5E20] shrink-0 whitespace-nowrap bg-[#1B5E20]/5 px-2.5 py-1 rounded-lg">
                          S/ {item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Nutrition pill summaries & trigger details prompt */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <button 
                        onClick={() => handleOpenDetails(item)}
                        className="text-[10px] font-black text-[#1B5E20] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-icons-span text-xs">info</span>
                        Ver ingredientes y macros
                      </button>

                      {/* Numeric Selector Bar */}
                      <div className="flex items-center bg-slate-100 rounded-full p-1 gap-2.5 border border-slate-200/50">
                        <button
                          onClick={() => {
                            const cartItem = cart.find(c => c.product.id === item.id);
                            if (cartItem) {
                              onUpdateQuantity(item, -1, cartItem.selectedSnack);
                            }
                          }}
                          disabled={count === 0}
                          className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-[#1B5E20] active:scale-90 transition-transform ${
                            count === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1B5E20]/5 cursor-pointer'
                          }`}
                        >
                          <span className="material-icons-span text-[16px] font-bold">remove</span>
                        </button>
                        
                        <span className="text-xs font-black text-on-surface w-3.5 text-center select-none">
                          {count}
                        </span>

                        <button
                          onClick={() => handleOpenDetails(item)}
                          className="w-7.5 h-7.5 bg-[#1B5E20] text-white rounded-full flex items-center justify-center active:scale-95 hover:bg-[#144717] transition-all cursor-pointer shadow-sm"
                        >
                          <span className="material-icons-span text-[16px] text-white font-bold">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </main>

      {/* Floating Action Cart Counter */}
      {totalCartCount > 0 && (
        <div id="cart-fab" className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
          <button
            onClick={onGoToCart}
            className="w-full bg-[#1B5E20] text-white flex items-center justify-between px-6 py-4 rounded-2xl shadow-xl hover:bg-[#134616] active:scale-95 transition-all cursor-pointer font-bold group"
          >
            <div className="flex items-center gap-2">
              <span className="material-icons-span text-white">shopping_basket</span>
              <span className="text-white font-black text-xs">
                Ver Carrito
              </span>
            </div>
            <span className="bg-white/25 text-white text-[10px] font-black px-3 py-1 rounded-full shrink-0">
              {totalCartCount} {totalCartCount === 1 ? 'producto' : 'productos'}
            </span>
          </button>
        </div>
      )}

      {/* Persistent Bottom Nav Bar */}
      <nav id="bottom-navbar" className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-3 flex justify-around items-center h-20 shadow-[0_-3px_12px_rgba(0,0,0,0.02)] pb-safe rounded-t-xl max-w-md mx-auto">
        <button
          onClick={() => onSelectScreen('welcome')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-lg">home</span>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button
          onClick={() => onSelectScreen('menu')}
          className="flex flex-col items-center justify-center gap-1 bg-[#1B5E20]/10 text-[#1B5E20] rounded-full px-5 py-2 transition-all cursor-pointer"
        >
          <span className="material-icons-span text-lg text-[#1B5E20] font-black">restaurant_menu</span>
          <span className="text-[10px] font-extrabold text-[#1B5E20]">Menú</span>
        </button>

        <button
          onClick={() => onSelectScreen('cart')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-lg">receipt_long</span>
          <span className="text-[10px] font-bold">Carrito</span>
        </button>

        <button
          onClick={() => onSelectScreen('profile')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-lg">person</span>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </nav>

      {/* Detailed Product Modal overlay */}
      <AnimatePresence>
        {selectedProductDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-0 md:p-4 backdrop-blur-xs cursor-pointer"
            onClick={() => setSelectedProductDetails(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-md rounded-t-[30px] md:rounded-b-[30px] overflow-hidden max-h-[92vh] flex flex-col text-left cursor-default shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button overlay */}
              <button 
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 z-20 text-white bg-black/40 hover:bg-black/60 transition-all cursor-pointer material-icons-span text-base p-1.5 rounded-full"
              >
                close
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1 hide-scrollbar">
                {/* Large Product Image */}
                <div className="relative aspect-[16/11] w-full bg-slate-100">
                  <img 
                    src={selectedProductDetails.imageUrl} 
                    alt={selectedProductDetails.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  
                  {/* Header Title Placement */}
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                    <div className="flex gap-1">
                      {selectedProductDetails.tags.map(tag => (
                        <span key={tag} className="bg-[#1B5E20] text-white px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-black tracking-tight leading-tight">
                      {selectedProductDetails.name}
                    </h3>
                  </div>
                </div>

                {/* Info Sheet body */}
                <div className="p-6 space-y-5">
                  {/* Price & Description */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">PRECIO UNIVERSITARIO</span>
                    <span className="text-xl font-black text-[#1B5E20]">S/ {selectedProductDetails.price.toFixed(2)}</span>
                  </div>

                  {/* Snack Selector Section */}
                  <div className="space-y-3 pt-1 pb-2">
                    <h4 className="text-[11px] font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎁 Elige tu snack incluido:</span>
                    </h4>
                    
                    {snackError && (
                      <div className="text-[11px] font-bold text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                        <span className="material-icons-span text-sm">error_outline</span>
                        {snackError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Option A Button */}
                      <button
                        onClick={() => {
                          setSelectedSnack('A');
                          setSnackError(null);
                        }}
                        type="button"
                        className={`w-full py-4 px-4.5 rounded-xl text-left font-black transition-all cursor-pointer flex items-center justify-between border-[2px] ${
                          selectedSnack === 'A'
                            ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md shadow-[#1B5E20]/20'
                            : 'bg-white text-[#1B5E20] border-[#1B5E20]/75 hover:bg-[#1B5E20]/5'
                        }`}
                      >
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${selectedSnack === 'A' ? 'bg-white/20 text-white' : 'bg-[#1B5E20]/10 text-[#1B5E20]'}`}>Opción A</span>
                            {getSnackOptionsForProduct(selectedProductDetails.id).optionA.kcal && (
                              <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md ${selectedSnack === 'A' ? 'bg-white/30 text-white' : 'bg-[#1B5E20]/15 text-[#1B5E20]'}`}>
                                ⚡ {getSnackOptionsForProduct(selectedProductDetails.id).optionA.kcal}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black block leading-snug">{getSnackOptionsForProduct(selectedProductDetails.id).optionA.name}</span>
                          <span className={`text-[10px] font-semibold block leading-normal ${selectedSnack === 'A' ? 'text-white/85' : 'text-slate-500'}`}>
                            {getSnackOptionsForProduct(selectedProductDetails.id).optionA.desc}
                          </span>
                        </div>
                        {selectedSnack === 'A' ? (
                          <span className="material-icons-span text-white text-base shrink-0 self-center">check_circle</span>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#1B5E20]/70 shrink-0 self-center" />
                        )}
                      </button>

                      {/* Option B Button */}
                      <button
                        onClick={() => {
                          setSelectedSnack('B');
                          setSnackError(null);
                        }}
                        type="button"
                        className={`w-full py-4 px-4.5 rounded-xl text-left font-black transition-all cursor-pointer flex items-center justify-between border-[2px] ${
                          selectedSnack === 'B'
                            ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md shadow-[#1B5E20]/20'
                            : 'bg-white text-[#1B5E20] border-[#1B5E20]/75 hover:bg-[#1B5E20]/5'
                        }`}
                      >
                        <div className="space-y-1 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md ${selectedSnack === 'B' ? 'bg-white/20 text-white' : 'bg-[#1B5E20]/10 text-[#1B5E20]'}`}>Opción B</span>
                            {getSnackOptionsForProduct(selectedProductDetails.id).optionB.kcal && (
                              <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md ${selectedSnack === 'B' ? 'bg-white/30 text-white' : 'bg-[#1B5E20]/15 text-[#1B5E20]'}`}>
                                ⚡ {getSnackOptionsForProduct(selectedProductDetails.id).optionB.kcal}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black block leading-snug">{getSnackOptionsForProduct(selectedProductDetails.id).optionB.name}</span>
                          <span className={`text-[10px] font-semibold block leading-normal ${selectedSnack === 'B' ? 'text-white/85' : 'text-slate-500'}`}>
                            {getSnackOptionsForProduct(selectedProductDetails.id).optionB.desc}
                          </span>
                        </div>
                        {selectedSnack === 'B' ? (
                          <span className="material-icons-span text-white text-base shrink-0 self-center">check_circle</span>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#1B5E20]/70 shrink-0 self-center" />
                        )}
                      </button>

                      {/* Explicit Text Input for Option B */}
                      {selectedSnack === 'B' && (
                        <div className="mt-1.5 space-y-1.5 pl-0.5 animate-fadeIn">
                          <label className="text-[10px] md:text-[11px] font-black text-[#1B5E20] block uppercase tracking-wider">
                            Especifica tu fruta:
                          </label>
                          <input
                            type="text"
                            value={customFruitText}
                            onChange={(e) => {
                              setCustomFruitText(e.target.value);
                              setSnackError(null);
                            }}
                            placeholder={getSnackOptionsForProduct(selectedProductDetails.id).placeholderB}
                            className="w-full bg-[#1B5E20]/5 text-[#1b5e20] font-bold text-xs px-4.5 py-3.5 rounded-xl border-[2px] border-[#1B5E20] focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]/30 transition-all placeholder:text-[#1B5E20]/50"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-[#1B5E20] uppercase tracking-wider">Descripción</h4>
                    <p className="text-xs text-on-surface-variant font-semibold leading-relaxed">
                      {selectedProductDetails.description}
                    </p>
                  </div>

                  {/* Macros Board */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-black text-[#1B5E20] uppercase tracking-wider">Aporte Nutricional Pro</h4>
                      <span className="text-[11px] text-on-surface-variant font-black flex items-center gap-0.5">
                        ⚡ {selectedProductDetails.kcal} Calorías Totales
                      </span>
                    </div>

                    {/* Macronutrient breakdown row */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex flex-col items-center gap-0.5/home">
                        <span className="material-icons-span text-amber-600 text-sm font-bold">fitness_center</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Proteínas</span>
                        <span className="text-xs font-black text-[#1B5E20]">{selectedProductDetails.macros.protein}</span>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
                        <span className="material-icons-span text-emerald-600 text-sm font-bold">eco</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Carb.</span>
                        <span className="text-xs font-black text-[#1B5E20]">{selectedProductDetails.macros.carbs}</span>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 flex flex-col items-center gap-0.5">
                        <span className="material-icons-span text-blue-600 text-sm font-bold">opacity</span>
                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Grasas</span>
                        <span className="text-xs font-black text-[#1B5E20]">{selectedProductDetails.macros.fat}</span>
                      </div>
                    </div>
                  </div>

                  {/* List of Ingredients */}
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-icons-span text-sm font-bold">local_dining</span>
                      Ingredientes Seleccionados
                    </h4>
                    <ul className="grid grid-cols-1 gap-1.5 pl-1.5">
                      {selectedProductDetails.ingredients.map((ing, i) => (
                        <li key={i} className="text-xs font-bold text-on-surface-variant flex items-start gap-2">
                          <span className="text-[#1B5E20] mt-0.5 select-none">•</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Health Benefits */}
                  <div className="space-y-2 bg-[#1B5E20]/5 p-4 rounded-2xl border border-[#1B5E20]/10">
                    <h4 className="text-[11px] font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-icons-span text-sm font-bold">verified</span>
                      Beneficios Nutricionales
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedProductDetails.benefits.map((benefit, i) => (
                        <li key={i} className="text-xs font-semibold text-on-surface-variant flex items-start gap-2">
                          <span className="material-icons-span text-xs text-[#1B5E20] shrink-0 mt-0.5">check_circle</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-5 border-t border-slate-100 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.02)] flex gap-3.5 items-center shrink-0">
                {/* Quantity select overlay status info */}
                <div className="flex-1">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider block">Total estimado</span>
                  <span className="text-lg font-black text-on-surface">S/ {selectedProductDetails.price.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => {
                    if (!selectedSnack) {
                      setSnackError("Por favor elige tu snack");
                      return;
                    }
                    const options = getSnackOptionsForProduct(selectedProductDetails.id);
                    let finalSnackText = "";
                    if (selectedSnack === 'A') {
                      finalSnackText = options.optionA.name;
                    } else if (selectedSnack === 'B') {
                      if (!customFruitText.trim()) {
                        setSnackError("Por favor escribe qué fruta deseas");
                        return;
                      }
                      finalSnackText = `Fruta: ${customFruitText.trim()}`;
                    }
                    onUpdateQuantity(selectedProductDetails, 1, finalSnackText);
                    setSelectedProductDetails(null);
                  }}
                  className="bg-[#1B5E20] text-white py-3.5 px-6 rounded-2xl hover:bg-[#144717] active:scale-[0.98] transition-all font-black text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-[#1B5E20]/15"
                >
                  <span className="material-icons-span text-white text-base">shopping_cart_add</span>
                  Agregar al carrito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Picker Modal overlay */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-xs"
            onClick={() => setShowAddressModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-sm rounded-[24px] p-6 text-center space-y-5 border border-outline-variant/35 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAddressModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer material-icons-span text-lg p-1.5 hover:bg-slate-100 rounded-full"
              >
                close
              </button>

              <div className="w-14 h-14 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto border border-[#1B5E20]/25">
                <span className="material-icons-span text-[#1B5E20] text-3xl">location_on</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#1B5E20]">Dirección de Entrega</h3>
                <p className="text-xs text-on-surface-variant font-bold leading-normal px-2">
                  Escribe la dirección exacta de tu pabellón, aula o punto del campus.
                </p>
              </div>

              {/* Input for new address */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#1B5E20] block pl-1">
                  Tu dirección actual / nueva
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 font-semibold text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1B5E20] focus:bg-white placeholder:text-slate-400 transition-all"
                  placeholder="Ej: Campus de Ingeniería UPN, Pabellón B, Aula 402"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleSaveAddress}
                  className="w-full py-3.5 bg-[#1B5E20] text-white font-black rounded-xl hover:bg-[#154618] active:scale-[0.98] transition-all cursor-pointer text-xs shadow-md shadow-[#1B5E20]/10"
                >
                  Guardar dirección
                </button>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="w-full py-2 bg-transparent text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-xs"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
