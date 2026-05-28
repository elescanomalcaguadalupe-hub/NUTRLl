import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';
import L from 'leaflet';

function RiderAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-9 h-9 p-1 border border-white/20",
    md: "w-13 h-13 p-1.5 border-2 border-[#1B5E20]/15",
    lg: "w-28 h-28 p-3 hover:scale-105 border-4 border-[#1B5E20]"
  };

  return (
    <div className={`rounded-full bg-[#1B5E20] flex items-center justify-center shrink-0 shadow-md ${sizeClasses[size]} overflow-hidden`}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
        {/* Rear Wheel */}
        <circle cx="18" cy="46" r="6" stroke="currentColor" strokeWidth="4.5" />
        <circle cx="18" cy="46" r="2.5" fill="currentColor" />
        
        {/* Front Wheel */}
        <circle cx="46" cy="46" r="6" stroke="currentColor" strokeWidth="4.5" />
        <circle cx="46" cy="46" r="2.5" fill="currentColor" />
        
        {/* Bike Frame & Connections */}
        <path d="M18 46h13l7-13 8 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 46l-4-23h-6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Delivery Box (representing the NutriBox) */}
        <rect x="8" y="15" width="16" height="18" rx="2" fill="currentColor" />
        <line x1="8" y1="24" x2="24" y2="24" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Seat marker */}
        <path d="M28 34h6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        
        {/* Steering front panel / windshield */}
        <path d="M42 23l3 9h-5zm0 0l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

interface TrackingScreenProps {
  order: Order | null;
  onSelectScreen: (screen: 'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth') => void;
  onResetOrder: () => void;
}

export default function TrackingScreen({
  order,
  onSelectScreen,
  onResetOrder
}: TrackingScreenProps) {
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 = Preparando, 2 = En camino, 3 = Cerca, 4 = Entregado
  const [showChat, setShowChat] = useState(false);
  const [showCall, setShowCall] = useState(false);
  
  // Chat messaging list
  const [messages, setMessages] = useState([
    { id: '1', sender: 'carlos', text: '¡Hola! Ya estoy preparando mi mochila térmica Nutribox para llevar tu comida calientita. ¿Alguna indicación específica?', time: '12:20' }
  ]);
  const [inputText, setInputText] = useState('');
  const [courierRinging, setCourierRinging] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);

  const getRiderCoordinates = (step: number): [number, number] => {
    switch (step) {
      case 1: return [-12.0010, -77.0840];
      case 2: return [-12.0022, -77.0858];
      case 3: return [-12.0030, -77.0868];
      case 4: return [-12.0035, -77.0875];
      default: return [-12.0010, -77.0840];
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates between Kitchen and Client
    const centerLatLng: [number, number] = [-12.00225, -77.08575];

    const map = L.map(mapContainerRef.current, {
      center: centerLatLng,
      zoom: 16,
      zoomControl: true,
      maxZoom: 19,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true
    });

    mapInstanceRef.current = map;

    // OpenStreetMap layer (completely free and open source)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom pins
    const kitchenIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 bg-[#1B5E20] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <span class="text-xs">🍳</span>
          </div>
          <div class="bg-[#1B5E20] text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap uppercase tracking-tighter">
            Cocina NutriBox 🍳
          </div>
        </div>
      `,
      className: '',
      iconSize: [80, 50],
      iconAnchor: [40, 25]
    });

    const clientIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md relative">
            <span class="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-35 animate-ping"></span>
            <span class="text-xs">📍</span>
          </div>
          <div class="bg-green-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs mt-1 whitespace-nowrap uppercase tracking-tighter">
            Tu Entrega (Pab. B) 🏫
          </div>
        </div>
      `,
      className: '',
      iconSize: [80, 50],
      iconAnchor: [40, 25]
    });

    L.marker([-12.0010, -77.0840], { icon: kitchenIcon }).addTo(map);
    L.marker([-12.0035, -77.0875], { icon: clientIcon }).addTo(map);

    const routePoints: [number, number][] = [
      [-12.0010, -77.0840],
      [-12.0015, -77.0850],
      [-12.0022, -77.0858],
      [-12.0030, -77.0868],
      [-12.0035, -77.0875]
    ];

    // Elegant multi-layer polyline for campus connection trail
    L.polyline(routePoints, {
      color: '#ffffff',
      weight: 10,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    L.polyline(routePoints, {
      color: '#1B5E20',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const riderIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-12 w-12 rounded-full bg-amber-500 opacity-25 animate-ping"></span>
            <div class="w-10 h-10 bg-[#fc9d41] text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
              <span class="text-lg">🛵</span>
            </div>
          </div>
          <div class="bg-amber-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-2xs mt-1 whitespace-nowrap uppercase tracking-tighter">
            NutriDelivery
          </div>
        </div>
      `,
      className: '',
      iconSize: [100, 60],
      iconAnchor: [50, 30]
    });

    const currentCoords = getRiderCoordinates(currentStep);
    const riderMarker = L.marker(currentCoords, { icon: riderIcon }).addTo(map);
    riderMarkerRef.current = riderMarker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Move and Pan the Rider
  useEffect(() => {
    const currentCoords = getRiderCoordinates(currentStep);
    if (riderMarkerRef.current) {
      riderMarkerRef.current.setLatLng(currentCoords);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(currentCoords, { animate: true, duration: 1 });
    }
  }, [currentStep]);

  // Progresses steps slowly over time automatically to build an active live app feeling
  useEffect(() => {
    const stepTimer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      }
    }, 28000);

    return () => clearTimeout(stepTimer);
  }, [currentStep]);

  const sendUserMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    setTimeout(() => {
      let reply = '¡Listo! Entendido, ya estoy avanzando.';
      if (currentStep === 1) {
        reply = '¡Genial! Aún están sazonando los garbanzos en cocina. Te aviso apenas salga rumbo a tu pabellón.';
      } else if (currentStep === 2) {
        reply = 'Perfecto, ya estoy muy cerca. Llego en un par de minutos.';
      } else if (currentStep === 3) {
        reply = 'Ya estoy por el hall principal. ¿Deseas que espere en la puerta o ingreso?';
      } else if (currentStep === 4) {
        reply = 'Ya entregado, ¡gracias por recargar energía saludable con Nutribox! Recuerda calificarme ⭐';
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'carlos',
          text: reply,
          time: new Date().toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  return (
    <div className="bg-[#fcfdfd] text-[#2c3539] overflow-x-hidden min-h-screen pb-40">
      {/* Top Header */}
      <header className="w-full sticky top-0 z-50 bg-white flex items-center justify-between px-5 py-3 border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-icons-span text-[#1B5E20]">location_on</span>
          <span className="font-extrabold text-xl text-[#1B5E20] tracking-tight">NUTRIBOX</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Simulation Controls */}
          <div className="flex gap-1 bg-slate-100 py-1 px-1.5 rounded-full border border-slate-200/50 max-md:hidden">
            <span className="text-[9px] uppercase font-black text-slate-500 flex items-center px-1.5 font-sans">Simular:</span>
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`text-[9.5px] font-black px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  currentStep === s 
                    ? 'bg-[#1B5E20] text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 shadow-2xs'
                }`}
              >
                {s === 1 && '1. Cocina'}
                {s === 2 && '2. Ruta'}
                {s === 3 && '3. Cerca'}
                {s === 4 && '4. Entrega'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={onResetOrder}
            className="text-xs text-[#1B5E20] font-black border border-[#1B5E20]/20 bg-[#1B5E20]/5 hover:bg-[#1B5E20]/10 transition-colors py-1.5 px-3.5 rounded-full cursor-pointer uppercase tracking-tight"
          >
            Nuevo pedido
          </button>
        </div>
      </header>

      {/* Map Segment with overlay card */}
      <section className="relative w-full h-[320px] md:h-[380px] overflow-hidden bg-slate-100 border-b border-slate-100">
        <div className="absolute inset-0 z-0">
          {/* Interactive OSM map via Leaflet container with green styles */}
          <div ref={mapContainerRef} className="w-full h-full nutribox-map z-0" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* Floating estimated counter badge - White card over the map */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center max-w-[160px]">
            <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase leading-none text-center">Llegada Estimada</span>
            <span className="text-sm font-black text-[#1B5E20] font-sans mt-1.5 uppercase whitespace-nowrap">
              {currentStep === 4 ? '¡ENTREGADO!' : order?.estimatedDelivery || '12:45 PM'}
            </span>
          </div>
        </div>
      </section>

      {/* Stepper progress content section */}
      <section className="bg-[#fcfdfd] px-5 -mt-6 relative z-20 rounded-t-[28px] pt-6 max-w-2xl mx-auto space-y-6">
        
        {/* Step Header info */}
        <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-4">
          <div>
            <span className="text-[9px] font-black tracking-wider uppercase bg-[#1B5E20]/5 text-[#1B5E20] border border-[#1B5E20]/15 px-2.5 py-1 rounded-md">
              Estado del pedido
            </span>
            <h2 className="text-lg font-black text-slate-900 leading-tight mt-2 font-sans">
              {currentStep === 1 && 'Cocinando tu energía 🍳'}
              {currentStep === 2 && 'Pedido listo y en camino 🛵'}
              {currentStep === 3 && 'Aproximándose a ti 🏁'}
              {currentStep === 4 && '¡Tu entrega ha finalizado! 🎉'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 italic mt-1 leading-normal">
              Código de pedido: <span className="text-[#1B5E20] font-black">#NBX-{order?.id || '8821'}</span>
            </p>
          </div>
          
          <div className="bg-[#E8F5E9] border border-[#1B5E20]/15 px-3 py-1.5 rounded-xl text-center shrink-0">
            <span className="text-[#1B5E20] font-black text-xs">
              S/ {order?.total ? order.total.toFixed(2) : '16.00'}
            </span>
          </div>
        </div>

        {/* Steps progress cards list */}
        <div className="relative flex flex-col gap-5 mt-2">
          {/* Connecting vertical trail line */}
          <div className="absolute left-4.5 top-3 bottom-3 w-0.5 bg-slate-100 z-0" />

          {/* STEP 1: Preparando pedido */}
          <div className={`flex items-start gap-4 z-10 p-3 rounded-2xl border transition-all ${
            currentStep === 1 
              ? 'bg-[#E8F5E9]/50 border-[#1B5E20]/30 shadow-2xs' 
              : currentStep > 1 
                ? 'bg-transparent border-transparent opacity-85' 
                : 'bg-transparent border-transparent opacity-50'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              currentStep >= 1 
                ? 'bg-[#1B5E20] text-white border-[#1B5E20]' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {currentStep > 1 ? (
                <span className="material-icons-span text-xs font-black">check</span>
              ) : (
                <span className="material-icons-span text-xs font-black">restaurant</span>
              )}
            </div>
            
            <div className="leading-tight">
              <p className={`text-xs font-black ${currentStep >= 1 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
                1. Preparando pedido
              </p>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
                Tu Bowl de Proteína está siendo elaborado con insumos frescos por nuestra cocina.
              </p>
            </div>
          </div>

          {/* STEP 2: En camino */}
          <div className={`flex items-start gap-4 z-10 p-3 rounded-2xl border transition-all ${
            currentStep === 2 
              ? 'bg-[#E8F5E9]/50 border-[#1B5E20]/30 shadow-2xs' 
              : currentStep > 2 
                ? 'bg-transparent border-transparent opacity-85' 
                : 'bg-transparent border-transparent opacity-50'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              currentStep >= 2 
                ? 'bg-[#1B5E20] text-white border-[#1B5E20] ring-4 ring-[#1B5E20]/10' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {currentStep > 2 ? (
                <span className="material-icons-span text-xs font-black">check</span>
              ) : (
                <span className="material-icons-span text-xs font-black">delivery_dining</span>
              )}
            </div>

            <div className="leading-tight">
              <p className={`text-xs font-black ${currentStep >= 2 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
                2. En camino
              </p>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
                NutriDelivery está transportando tu pedido en envase térmico directo para conservar la frescura.
              </p>
            </div>
          </div>

          {/* STEP 3: Cerca de tu ubicación */}
          <div className={`flex items-start gap-4 z-10 p-3 rounded-2xl border transition-all ${
            currentStep === 3 
              ? 'bg-[#E8F5E9]/50 border-[#1B5E20]/30 shadow-2xs' 
              : currentStep > 3 
                ? 'bg-transparent border-transparent opacity-85' 
                : 'bg-transparent border-transparent opacity-50'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              currentStep >= 3 
                ? 'bg-[#1B5E20] text-white border-[#1B5E20]' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              {currentStep > 3 ? (
                <span className="material-icons-span text-xs font-black">check</span>
              ) : (
                <span className="material-icons-span text-xs font-black">near_me</span>
              )}
            </div>

            <div className="leading-tight">
              <p className={`text-xs font-black ${currentStep >= 3 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
                3. Cerca de tu ubicación
              </p>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
                Rider aproximándose a {order?.deliveryAddress || 'tu ubicación'}. ¡Prepárate para recibir tu plato!
              </p>
            </div>
          </div>

          {/* STEP 4: Entregado */}
          <div className={`flex items-start gap-4 z-10 p-3 rounded-2xl border transition-all ${
            currentStep === 4 
              ? 'bg-[#E8F5E9]/50 border-[#1B5E20]/30 shadow-2xs' 
              : 'bg-transparent border-transparent opacity-50'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
              currentStep >= 4 
                ? 'bg-[#1B5E20] text-white border-[#1B5E20]' 
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}>
              <span className="material-icons-span text-xs font-black">home_work</span>
            </div>

            <div className="leading-tight">
              <p className={`text-xs font-black ${currentStep >= 4 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
                4. Entregado
              </p>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
                ¡Frescura entregada a tiempo! Buen provecho universitario con NutriBox.
              </p>
            </div>
          </div>
        </div>

        {/* Courier Info Card */}
        <div className="p-4 rounded-2xl border border-slate-105 bg-white flex items-center gap-3.5 shadow-2xs">
          <RiderAvatar size="md" />
          
          <div className="flex-grow min-w-0 text-left">
            <p className="font-extrabold text-xs text-slate-855">NutriDelivery</p>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => { setShowCall(true); setCourierRinging(true); }}
              className="w-9 h-9 rounded-full border border-[#1B5E20]/30 hover:bg-[#1B5E20]/5 text-[#1B5E20] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            >
              <span className="material-icons-span text-base font-bold">call</span>
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="w-9 h-9 rounded-full bg-[#1B5E20] text-white flex items-center justify-center active:scale-95 hover:bg-[#144717] transition-all cursor-pointer shadow-xs"
            >
              <span className="material-icons-span text-base font-bold text-white">chat</span>
            </button>
          </div>
        </div>
      </section>

      {/* Manual progression buttons on mobile view */}
      <div className="md:hidden mt-6 px-5 max-w-2xl mx-auto">
        <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-2xl flex items-center justify-between gap-2.5">
          <span className="text-[10px] font-black uppercase text-slate-500">Avance Rápido:</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={() => setCurrentStep(s)}
                className={`text-[10.5px] w-8 h-8 rounded-full font-black transition-all border ${
                  currentStep === s 
                    ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV BAR */}
      <nav id="bottom-navbar" className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-3 flex justify-around items-center h-20 shadow-[0_-3px_12px_rgba(0,0,0,0.02)] pb-safe rounded-t-xl">
        <button
          onClick={() => onSelectScreen('welcome')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">home</span>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button
          onClick={() => onSelectScreen('menu')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">restaurant_menu</span>
          <span className="text-[10px] font-bold">Menú</span>
        </button>

        <button
          onClick={() => { onResetOrder(); onSelectScreen('menu'); }}
          className="flex flex-col items-center justify-center gap-1 px-4 text-slate-400 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl">receipt_long</span>
          <span className="text-[10px] font-bold">Nuevo</span>
        </button>

        <button
          onClick={() => onSelectScreen('profile')}
          className="flex flex-col items-center justify-center gap-1 px-4 text-[#1B5E20] bg-[#1B5E20]/5 rounded-full py-2 px-4 transition-colors cursor-pointer"
        >
          <span className="material-icons-span text-xl font-bold">person</span>
          <span className="text-[10px] font-extrabold">Perfil</span>
        </button>
      </nav>

      {/* CHAT WITH COURIER MODAL */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full md:max-w-md md:rounded-[26px] overflow-hidden flex flex-col h-[70vh] md:h-[550px]"
            >
              <div className="bg-[#1B5E20] p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <RiderAvatar size="sm" />
                  <div className="text-left">
                    <h4 className="font-extrabold text-white text-xs leading-none">NutriDelivery</h4>
                    <span className="text-[9px] text-white/85 flex items-center gap-1 mt-1 font-bold">
                      <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" />
                      NutriDelivery en ruta
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowChat(false)}
                  className="material-icons-span text-white p-2 rounded-full hover:bg-white/10 cursor-pointer text-lg font-bold"
                >
                  close
                </button>
              </div>

              {/* Chat list messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.map((m) => {
                  const isCourier = m.sender === 'carlos';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[80%] ${isCourier ? 'self-start mr-auto' : 'self-end ml-auto'}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs font-semibold leading-normal ${
                        isCourier 
                          ? 'bg-white text-slate-800 shadow-xs border border-slate-100 rounded-tl-xs' 
                          : 'bg-[#1B5E20] text-white rounded-tr-xs shadow-xs'
                      }`}>
                        {m.text}
                      </div>
                      <span className={`text-[9px] text-slate-450 mt-1 ${isCourier ? 'text-left' : 'text-right'}`}>
                        {m.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Input trigger */}
              <div className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  placeholder="Escribe un mensaje..."
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendUserMessage()}
                  className="flex-1 bg-slate-50 hover:bg-slate-100/50 rounded-full px-4 text-xs font-bold text-slate-700 border border-slate-200/50 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] focus:bg-white transition-all"
                />
                <button
                  onClick={sendUserMessage}
                  className="w-10 h-10 bg-[#1B5E20] text-white rounded-full flex items-center justify-center shrink-0 active:scale-90 hover:bg-[#144717] transition-transform cursor-pointer"
                >
                  <span className="material-icons-span text-[18px] text-white">send</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO CALL CALLING IN-APP OVERLAY */}
      <AnimatePresence>
        {showCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-[120] backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <div className="space-y-10 max-w-sm w-full">
              <div className="space-y-3 flex flex-col items-center">
                <RiderAvatar size="lg" />
                <div>
                  <h3 className="text-xl font-bold text-white">NutriDelivery</h3>
                  <p className="text-xs text-amber-450 font-black tracking-wide mt-1 uppercase">
                    {courierRinging ? 'Llamando...' : 'Conexión Establecida'}
                  </p>
                </div>
              </div>

              {courierRinging ? (
                /* Ringing controls */
                <div className="space-y-4">
                  <p className="text-xs text-white/70 font-bold leading-normal">
                    NutriDelivery...
                  </p>
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => setShowCall(false)}
                      className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center active:scale-95 shadow-lg shadow-red-650/20 cursor-pointer"
                    >
                      <span className="material-icons-span text-white text-2xl">call_end</span>
                    </button>
                    <button
                      onClick={() => setCourierRinging(false)}
                      className="w-16 h-16 bg-[#1B5E20] text-white rounded-full flex items-center justify-center active:scale-95 shadow-lg shadow-green-950/20 cursor-pointer"
                    >
                      <span className="material-icons-span text-white text-2xl">call</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Connected mock conversation screen */
                <div className="bg-white/10 p-6 rounded-2xl border border-white/15 space-y-4">
                  <p className="text-sm font-bold text-white leading-relaxed">
                    "¡Hola! Ya estoy a unos segundos de llegar con tu pedido."
                  </p>
                  <button
                    onClick={() => setShowCall(false)}
                    className="w-14 h-14 bg-red-600 mx-auto text-white rounded-full flex items-center justify-center active:scale-95 shadow-lg cursor-pointer"
                  >
                    <span className="material-icons-span text-white text-xl">call_end</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
