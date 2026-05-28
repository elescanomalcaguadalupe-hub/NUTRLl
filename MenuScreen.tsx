import { useState, useEffect } from 'react';
import { UserProfile, Order } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  pastOrders: Order[];
  activeOrder: Order | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSelectScreen: (screen: any) => void;
}

export default function ProfileScreen({
  user,
  pastOrders,
  activeOrder,
  onUpdateUser,
  onSelectScreen
}: ProfileScreenProps) {
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user.name);
    setAddress(user.address);
  }, [user.name, user.address]);
  
  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      address,
      isLoggedIn: true
    });
    setIsEditing(false);
  };

  const handleLogoutToggle = () => {
    onUpdateUser({
      ...user,
      isLoggedIn: false
    });
    onSelectScreen('welcome');
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-40">
      {/* Header */}
      <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant/30 py-4 px-5 flex justify-between items-center text-center">
        <h1 className="text-xl font-bold font-sans mx-auto">Mi Perfil</h1>
      </header>

      <main className="px-5 pt-5 max-w-2xl mx-auto space-y-5">
        
        {/* Profile Details Container */}
        <div className="bg-surface-container-lowest p-5 rounded-[24px] border border-outline-variant/60 shadow-sm flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/25 bg-primary/5 flex items-center justify-center relative shadow-sm shrink-0">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="material-icons-span text-primary text-3xl">account_circle</span>
            )}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex-grow space-y-1">
            {isEditing ? (
              <div className="space-y-2 text-left">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container rounded-xl px-3 py-2 text-xs font-bold text-on-surface border border-outline-variant/30 focus:outline-none"
                  placeholder="Tu nombre completo"
                />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface-container rounded-xl px-3 py-2 text-xs font-bold text-on-surface border border-outline-variant/30 focus:outline-none"
                  placeholder="Campus / Pabellón"
                />
                <button
                  onClick={handleSave}
                  className="bg-primary text-on-primary font-bold text-[10px] px-3.5 py-1.5 rounded-full hover:bg-primary-container transition-all"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-base font-extrabold text-[#161d1f]">{user.name}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="material-icons-span text-primary text-sm hover:bg-primary/5 p-1 rounded-full cursor-pointer"
                  >
                    edit
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">{user.email}</p>
                <p className="text-xs text-primary font-semibold flex items-center justify-center md:justify-start gap-1">
                  <span className="material-icons-span text-xs">school</span>
                  {user.address}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Nutritional Stats */}
        <section className="bg-surface-container-low rounded-[24px] p-4 border border-outline-variant/30 grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-white rounded-2xl p-3 border border-outline-variant/20 shadow-sm leading-tight">
            <span className="text-xs font-black text-primary block">5 días</span>
            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block">Racha Activa</span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-outline-variant/20 shadow-sm leading-tight">
            <span className="text-xs font-black text-primary block">94%</span>
            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block">Nutric Score</span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-outline-variant/20 shadow-sm leading-tight">
            <span className="text-xs font-black text-primary block">148g</span>
            <span className="text-[10px] text-on-surface-variant font-bold mt-1 block">Prot. Semanal</span>
          </div>
        </section>

        {/* Mis Pedidos Activos Section */}
        <section className="space-y-3 bg-white p-5 rounded-[24px] border border-outline-variant/60 shadow-xs">
          <h2 className="text-xs font-black text-[#1B5E20] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <span>📦 Mis Pedidos</span>
          </h2>
          {activeOrder ? (
            <div className="bg-[#E8F5E9] p-4.5 rounded-2xl border border-[#1b5e20]/15 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className="bg-[#1B5E20] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                    Pedido Activo • #NBX-{activeOrder.id}
                  </span>
                  <p className="text-xs font-black text-slate-800 pt-1">
                    {activeOrder.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                  </p>
                  <p className="text-[10px] text-slate-500 font-extrabold flex items-center gap-1">
                    <span>📍 {activeOrder.deliveryAddress || 'Campus'}</span>
                    <span>•</span>
                    <span>⏰ {activeOrder.deliveryTime}</span>
                  </p>
                </div>
              </div>

              {/* Botón "Ver seguimiento" SOLO cuando hay pedido activo */}
              <button
                onClick={() => onSelectScreen('tracking')}
                className="w-full bg-[#1B5E20] hover:bg-[#144717] text-white py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#1B5E20]/10 active:scale-[0.98] transition-all"
              >
                <span>Ver seguimiento</span>
                <span className="material-icons-span text-sm text-white font-black">gps_fixed</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-5 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
                <span className="material-icons-span text-xl">receipt_long</span>
              </div>
              <p className="text-xs text-slate-500 font-bold">
                No tienes pedidos activos en este momento
              </p>
            </div>
          )}
        </section>

        {/* Historic Orders */}
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#161d1f] flex items-center gap-1.5">
            <span className="material-icons-span text-primary text-base">history</span>
            Historial de Pedidos
          </h2>

          <div className="space-y-3">
            {pastOrders.length === 0 ? (
              <div className="bg-white p-6 rounded-[22px] border border-outline-variant/30 text-center space-y-1.5">
                <span className="material-icons-span text-3xl text-outline-variant">assignment_turned_in</span>
                <p className="text-xs text-on-surface-variant font-bold">Aún no has completado pedidos.</p>
              </div>
            ) : (
              pastOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50 shadow-sm flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-on-surface">#NBX-{ord.id}</p>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                      {ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-[10px] text-primary font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Entregado • {ord.createdAt}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-xs text-primary block">S/ {ord.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Security / Toggle options */}
        <section className="pt-2">
          <button
            onClick={handleLogoutToggle}
            className={`w-full py-4 text-xs font-bold rounded-2xl border transition-colors cursor-pointer ${
              user.isLoggedIn
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
            }`}
          >
            {user.isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión de prueba'}
          </button>
        </section>
      </main>

      {/* Persistent Bottom Navigation */}
      <nav id="bottom-navbar" className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-outline-variant/30 px-3 flex justify-around items-center h-20 shadow-[0_-3px_12px_rgba(0,0,0,0.03)] pb-safe rounded-t-xl">
        <button
          onClick={() => onSelectScreen('welcome')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">home</span>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button
          onClick={() => onSelectScreen('menu')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">restaurant_menu</span>
          <span className="text-[10px] font-bold">Menú</span>
        </button>

        <button
          onClick={() => onSelectScreen('cart')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">receipt_long</span>
          <span className="text-[10px] font-bold">Carrito</span>
        </button>

        <button
          onClick={() => onSelectScreen('profile')}
          className="flex flex-col items-center justify-center gap-1 bg-primary-container/20 text-primary rounded-full px-5 py-2.5 transition-all cursor-pointer"
        >
          <span className="material-icons-span text-xl text-primary font-bold">person</span>
          <span className="text-[10px] font-extrabold text-primary">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
