import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface WelcomeScreenProps {
  onVerMenu: () => void;
  onEntrar: () => void;
  user: UserProfile;
  onSelectScreen: (screen: 'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth' | 'notifications') => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  sealsCount?: number;
}

export default function WelcomeScreen({ 
  onVerMenu, 
  onEntrar, 
  user, 
  onSelectScreen, 
  onUpdateUser,
  sealsCount = 3,
}: WelcomeScreenProps) {
  const [showStampsModal, setShowStampsModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState(user.address || '');

  const handleOpenAddressModal = () => {
    setNewAddress(user.address || '');
    setShowAddressModal(true);
  };

  const handleSaveAddress = () => {
    onUpdateUser({
      ...user,
      address: newAddress.trim()
    });
    setShowAddressModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 relative overflow-hidden bg-background">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-[#1B5E20]/8 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-secondary-container/5 rounded-full blur-[60px] -z-10" />

      {/* Brand Identity / Header (Conditional based on logged-in state) */}
      <header className="w-full max-w-[440px] mx-auto flex flex-col items-center mt-4 text-center z-10 shrink-0">
        {/* NutriBox Brand Text/Logo */}
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons-span text-[#1B5E20] text-3xl">location_on</span>
          <span className="font-sans font-black text-3xl tracking-tight text-[#1B5E20]">NUTRIBOX</span>
        </div>

        {user.isLoggedIn ? (
          <div className="w-full flex flex-col items-center gap-2 mt-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1B5E20]/5 px-5 py-2.5 rounded-2xl border border-[#1B5E20]/15 w-full text-center"
            >
              <p className="text-sm font-black text-[#1B5E20] flex items-center justify-center gap-1.5 leading-none">
                <span>Hola, {user.name} 👋</span>
              </p>
            </motion.div>

            {/* Address clickable light green card */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleOpenAddressModal}
              className="w-full bg-[#E8F5E9] hover:bg-[#ddebde] transition-colors py-2.5 px-3.5 rounded-2xl border border-[#1B5E20]/20 flex items-center justify-between text-left cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2 overflow-hidden w-full">
                <span className="material-icons-span text-[#1B5E20] text-lg shrink-0">location_on</span>
                <div className="truncate flex-1">
                  <span className="text-[10px] text-[#1B5E20] font-black uppercase tracking-wider block leading-none">Entregar en:</span>
                  <span className="text-xs font-bold text-slate-700 truncate block mt-1">
                    {user.address ? user.address : '📍 ¿Dónde te entregamos? Toca para agregar'}
                  </span>
                </div>
              </div>
              <span className="material-icons-span text-[#1B5E20] text-sm shrink-0 ml-1">edit</span>
            </motion.button>
          </div>
        ) : (
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-[#1B5E20] tracking-tight">La mejor opción para tu campus</h2>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sano, rápido y rico.</p>
          </div>
        )}
      </header>

      {/* Central Impact Hero */}
      <main className="relative w-full max-w-[440px] mx-auto flex flex-col items-center justify-center py-6 my-auto">
        {/* Floating Motivation Phrases & Icons Around Image */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute top-4 left-0 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-[#1B5E20]/10 z-20 floating-element"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#1B5E20]">
            <span className="material-icons-span text-xs">local_fire_department</span>
            Alimenta tu potencial
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-1/4 -right-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-[#1B5E20]/10 z-20 floating-element"
          style={{ animationDelay: '1.2s' }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#1B5E20]">
            <span className="material-icons-span text-xs">schedule</span>
            Listo en minutos
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-10 -left-1 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-[#1B5E20]/10 z-20 floating-element"
          style={{ animationDelay: '0.8s' }}
        >
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#1B5E20]">
            <span className="material-icons-span text-xs">school</span>
            Directo a tu facultad
          </span>
        </motion.div>

        {/* Floating decorative icons */}
        <div className="absolute -top-6 right-16 w-10 h-10 bg-[#1B5E20]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 z-10 floating-element" style={{ animationDelay: '1.5s' }}>
          <span className="material-icons-span text-[#1B5E20] text-base">eco</span>
        </div>
        <div className="absolute bottom-1/2 -right-6 w-9 h-9 bg-[#fc9d41]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 z-10 floating-element" style={{ animationDelay: '2s' }}>
          <span className="material-icons-span text-[#8f4e00] text-base">electric_bolt</span>
        </div>
        <div className="absolute -bottom-2 right-12 w-11 h-11 bg-[#1B5E20]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 z-10 floating-element" style={{ animationDelay: '0.2s' }}>
          <span className="material-icons-span text-[#1B5E20] text-lg">nutrition</span>
        </div>

        {/* Main Product Image Container */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative w-56 h-56 md:w-64 md:h-64 pulse-soft z-0"
        >
          <div className="absolute inset-0 bg-[#1B5E20]/5 rounded-full blur-2xl -z-10" />
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnJ_PJwrFONiPWZ_CtShZdOUI2Zyz-yvGlgU3VnEIC2pr-V4MVyk5kLRcOEmEDVohHMe-R1XJEx_oZKwZSifnbmxUwwfrHWAa-8YZeaOoE4dUm5GTUGs1nDd8aJ2TyglAGIJQj742KL-6wlVD_l5D7_EGyExKRX0BS-TqdQjBmN-h0IG4V7OolF1cNpCt6zdEYuB-02mkFEuxFF6TygqS2QhDdcRcmWLnpZdwR07JT7TvZDWGdrp-5Ms9kc4RxtVB4LcXdmBqodIg2cgc" 
            alt="Nutribox Pack" 
            className="w-full h-full object-cover rounded-full shadow-lg border border-[#1B5E20]/15"
          />
        </motion.div>
      </main>

      {/* Action Buttons & Navigation (Conditional split) */}
      <div className="w-full max-w-[440px] mx-auto text-center mb-4 z-15">
        {!user.isLoggedIn ? (
          /* LOGGED OUT STATE */
          <div className="space-y-4 px-2">
            <div>
              <h3 className="text-lg font-black text-[#1B5E20] mb-1">Comida saludable para estudiantes</h3>
              <p className="text-xs font-semibold text-on-surface-variant max-w-[325px] mx-auto">
                Práctica, fresca y accesible para tu día a día universitario sin filas ni demoras.
              </p>
            </div>

            <button 
              id="crear_cuenta_btn"
              onClick={onEntrar}
              className="w-full h-14 bg-[#1B5E20] text-white font-black rounded-2xl hover:bg-[#154618] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#1B5E20]/20 text-sm"
            >
              <span className="material-icons-span text-xl text-white">login</span>
              Entrar / Crear cuenta
            </button>
          </div>
        ) : (
          /* LOGGED IN USER STATE */
          <div className="space-y-3 px-2">
            <div>
              <h3 className="text-base font-black text-[#1B5E20]">¡Bienvenido de vuelta!</h3>
              <p className="text-xs font-semibold text-on-surface-variant">¿Qué se te antoja almorzar saludable hoy?</p>
            </div>

            {/* Primary Action Button */}
            <button 
              id="ver_menu_btn"
              onClick={onVerMenu}
              className="w-full h-14 bg-[#1B5E20] text-white font-black rounded-2xl hover:bg-[#154618] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#1B5E20]/25 text-sm"
            >
              <span className="material-icons-span text-xl text-white">restaurant_menu</span>
              Ver menú
            </button>

            {/* Secondary Actions in Grid or Row Stack */}
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => onSelectScreen('profile')}
                className="h-12 bg-white border border-slate-200 text-on-surface font-extrabold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <span className="material-icons-span text-base text-[#1B5E20]">receipt_long</span>
                Mis pedidos
              </button>

              <button 
                onClick={() => setShowStampsModal(true)}
                className="h-12 bg-white border border-slate-200 text-on-surface font-extrabold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs animate-pulse-soft"
              >
                <span className="material-icons-span text-base text-[#fc9d41]">stars</span>
                Mis sellos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Support */}
      <footer className="w-full max-w-[440px] mx-auto flex flex-col items-center gap-3 pt-4 border-t border-slate-100 z-10 shrink-0">
        <a 
          href="https://wa.me/51987654321" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/10 text-[#128C7E] rounded-full border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-all font-extrabold text-xs cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
          Contacto por WhatsApp
        </a>
        <p className="text-xs text-on-surface-variant font-medium">
          ¿Dudas?{' '}
          <a
            href="https://wa.me/51987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1B5E20] font-black hover:underline"
          >
            Escríbenos
          </a>
        </p>
      </footer>

      {/* Sellos / Loyalty Card Stamp System Modal overlay */}
      <AnimatePresence>
        {showStampsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-sm rounded-[24px] p-6 text-center space-y-5 border border-outline-variant/35 shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowStampsModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer material-icons-span text-lg p-1.5 hover:bg-slate-100 rounded-full"
              >
                close
              </button>

              <div className="w-14 h-14 bg-[#fc9d41]/10 rounded-full flex items-center justify-center mx-auto border border-[#fc9d41]/25">
                <span className="material-icons-span text-[#8f4e00] text-3xl">stars</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-[#1B5E20]">Tus Nutri-Sellos</h3>
                <p className="text-xs text-on-surface-variant font-bold leading-normal px-2">
                  Por cada 6 compras te regalamos la 7ma completamente GRATIS 🎁
                </p>
              </div>

              {/* Stamp Grid Track (Show 7 slots: 6 purchases + 1 gift) */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-7 gap-1.5 justify-items-center">
                {[1, 2, 3, 4, 5, 6, 7].map((index) => {
                  const isGift = index === 7;
                  const isStamped = index <= sealsCount; // dynamically bounded
                  return (
                    <div 
                      key={index}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all relative ${
                        isGift
                          ? 'bg-amber-100/40 border-amber-400 border-dashed scale-105 shadow-sm'
                          : isStamped 
                            ? 'bg-[#1B5E20]/10 border-[#1B5E20] scale-105 shadow-sm shadow-[#1B5E20]/10' 
                            : 'bg-white border-dashed border-slate-300'
                      }`}
                    >
                      {isGift ? (
                        <span className="text-sm">🎁</span>
                      ) : isStamped ? (
                        <span className="material-icons-span text-[#1B5E20] text-lg font-bold">eco</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">{index}</span>
                      )}

                      {/* Small number badge inside or below */}
                      <span className="absolute -bottom-1 -right-1 bg-white border border-slate-200 text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center text-on-surface-variant">
                        {index}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1 bg-[#1B5E20]/5 py-2.5 px-4 rounded-xl inline-block text-center border border-[#1B5E20]/10">
                  <span className="text-xs font-black text-[#1B5E20] block">Llevas {sealsCount} de 6 sellos</span>
                  <span className="text-[10.5px] text-on-surface-variant font-medium block">
                    {sealsCount >= 6 
                      ? '¡Excelente! Tu próxima NutriBox es GRATIS 🎁' 
                      : `¡Solo te faltan ${6 - sealsCount} pedidos más para reclamar tu premio!`}
                  </span>
                </div>

                <button 
                  onClick={() => setShowStampsModal(false)}
                  className="w-full py-3.5 bg-[#1B5E20] text-white font-black rounded-xl hover:bg-[#154618] active:scale-[0.98] transition-all cursor-pointer text-xs shadow-md shadow-[#1B5E20]/10"
                >
                  ¡Genial, seguir acumulando!
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
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white w-full max-w-sm rounded-[24px] p-6 text-center space-y-5 border border-outline-variant/35 shadow-2xl relative"
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
