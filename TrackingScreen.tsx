import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

export function extractFirstNameFromEmail(email: string): string {
  if (!email) return "Usuario";
  const localPart = email.split('@')[0] || "";
  const firstPart = localPart.split(/[\._\-]/)[0] || "";
  if (!firstPart) return "Usuario";
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1).toLowerCase();
}

interface AuthScreenProps {
  onAuthSuccess: (user: Partial<UserProfile>) => void;
  onBackToHome: () => void;
  onSelectScreen?: (screen: any) => void;
}

export default function AuthScreen({ onAuthSuccess, onBackToHome, onSelectScreen }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  
  // Login input states
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register input states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regUniversity, setRegUniversity] = useState('UPN - Campus Norte');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // OTP/WhatsApp Code verification states
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showWhatsappBanner, setShowWhatsappBanner] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-generate verification code and show mock WhatsApp prompt
  const triggerOtpSend = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpCode('');
    setOtpError('');
    setShowWhatsappBanner(false);
    
    // Simulate minor delay of receiving message
    setTimeout(() => {
      setShowWhatsappBanner(true);
    }, 1200);
  };

  // Dismiss WhatsApp banner after 12 seconds
  useEffect(() => {
    if (showWhatsappBanner) {
      const timer = setTimeout(() => {
        setShowWhatsappBanner(false);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [showWhatsappBanner]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setLoginError('Ingresa tu correo o número de celular');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoginError('');
    // Successful simulation logic
    // Create prefilled user object or custom input values
    const email = loginId.includes('@') ? loginId : `${loginId}@gmail.com`;
    const cleanName = extractFirstNameFromEmail(email);
    
    onAuthSuccess({
      name: cleanName || "Usuario Nutribox",
      email: email,
      phone: loginId.match(/^\d+$/) ? loginId : "+51 987 654 321",
      address: "",
      photoUrl: "",
      isLoggedIn: true
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegisterError('Ingresa tu nombre completo');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegisterError('Ingresa un correo electrónico válido');
      return;
    }
    if (!regPhone.trim()) {
      setRegisterError('Ingresa tu número de celular para contacto');
      return;
    }
    if (regPassword.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegisterError('Las contraseñas no coinciden');
      return;
    }
    if (!regUniversity.trim()) {
      setRegisterError('Ingresa tu Universidad o Facultad');
      return;
    }

    setRegisterError('');
    
    // Move to WhatsApp OTP Verification Step
    setMode('otp');
    triggerOtpSend();
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      if (otpCode === generatedOtp || otpCode === '1234') { // Allow fallback code '1234' for easier testing
        setShowWhatsappBanner(false);
        // Successful registration completed!
        const extracted = extractFirstNameFromEmail(regEmail);
        onAuthSuccess({
          name: extracted || regName,
          email: regEmail,
          phone: regPhone.startsWith('+') ? regPhone : `+51 ${regPhone}`,
          address: "",
          photoUrl: "",
          isLoggedIn: true
        });
      } else {
        setOtpError('Código de verificación incorrecto. Por favor, revisa e intenta de nuevo.');
      }
    }, 1500);
  };

  return (
    <div className="bg-[#fcfdfd] text-on-background min-h-screen relative flex flex-col justify-between pb-8">
      {/* Floating Mock WhatsApp Heads-up Notification Banner */}
      <AnimatePresence>
        {showWhatsappBanner && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-12 left-4 right-4 z-50 bg-[#25D366] text-white p-4 rounded-2xl shadow-xl border border-white/20 max-w-sm mx-auto cursor-pointer"
            onClick={() => {
              setOtpCode(generatedOtp);
              setShowWhatsappBanner(false);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-icons-span text-[#25D366] text-xl font-bold">chat</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wide uppercase opacity-95">WhatsApp • NutriBox</span>
                  <span className="text-[10px] opacity-75">Ahora</span>
                </div>
                <p className="text-xs font-bold leading-snug mt-0.5">
                  Felicidades por registrarte en NutriBox. Tu código de acceso es <span className="font-black underline tracking-wider text-white text-sm bg-black/15 px-2 py-0.5 rounded-md ml-1">{generatedOtp}</span>
                </p>
                <span className="text-[9px] font-semibold opacity-85 block mt-1">💡 Toca esta notificación para autorellenar el código</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Header / Back Button */}
      <header className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-b border-outline-variant/10 z-10 shrink-0">
        <button
          onClick={() => {
            if (mode === 'otp') {
              setMode('register');
            } else {
              onBackToHome();
            }
          }}
          className="material-icons-span text-primary p-2.5 -ml-2.5 rounded-full hover:bg-black/5 active:scale-95 transition-all text-xl cursor-pointer"
        >
          arrow_back
        </button>
        <span className="font-extrabold text-[#1B5E20] tracking-wider text-xs">AUTENTICACIÓN</span>
        <div className="w-9" /> {/* Spacer */}
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[440px] mx-auto px-6 flex flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Logo / Brand Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2">
                  <span className="material-icons-span text-[#1B5E20] text-4xl">location_on</span>
                  <h1 className="font-sans font-black text-3xl tracking-tight text-[#1B5E20]">NUTRIBOX</h1>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Inicia sesión para pedir comida sana y práctica en tu universidad</p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                  <span className="material-icons-span text-base shrink-0">info_outline</span>
                  <span>{loginError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Identifier Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Correo o Número de Celular</label>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg">alt_route</span>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-3.5 pl-11 pr-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/55"
                      placeholder="ejemplo@correo.com o +51..."
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[11px] font-extrabold text-on-surface-variant uppercase tracking-wider">Contraseña</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contacto administrativo restablecido. Se ha enviado un instructivo simulado a tu correo."); }} className="text-[11px] font-black text-[#1B5E20] hover:underline">¿Olvidaste tu contraseña?</a>
                  </div>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-lg">vpn_key</span>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-3.5 pl-11 pr-11 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/55"
                      placeholder="Ingresa tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="material-icons-span absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-on-surface cursor-pointer text-lg"
                    >
                      {showLoginPassword ? 'visibility_off' : 'visibility'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-13 mt-2 bg-[#1B5E20] text-white font-bold rounded-[14px] hover:bg-[#154618] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#1B5E20]/15"
                >
                  <span className="material-icons-span text-lg text-white">login</span>
                  Iniciar sesión
                </button>
              </form>

              {/* Separator */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-x-0 h-px bg-slate-200" />
                <span className="relative bg-[#fcfdfd] px-3.5 text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider">O continúa con</span>
              </div>

              {/* Identity Providers */}
              <button
                onClick={() => {
                  const email = "usuario@gmail.com";
                  onAuthSuccess({
                    name: "Usuario",
                    email: email,
                    phone: "+51 987 654 321",
                    address: "",
                    photoUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    isLoggedIn: true
                  });
                }}
                className="w-full h-12 bg-white border border-slate-200 rounded-[14px] hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-on-surface-variant font-bold text-xs"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              {/* Secondary CTA */}
              <div className="text-center pt-2">
                <p className="text-xs text-on-surface-variant font-medium">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => {
                      setRegisterError('');
                      setMode('register');
                    }}
                    className="text-[#1B5E20] font-black hover:underline cursor-pointer"
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Logo / Brand Header */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5">
                  <span className="material-icons-span text-[#1B5E20] text-3xl">location_on</span>
                  <h1 className="font-sans font-black text-2xl tracking-tight text-[#1B5E20]">NUTRIBOX</h1>
                </div>
                <h2 className="text-sm font-bold text-on-surface">Crea tu cuenta universitaria</h2>
                <p className="text-[11px] text-on-surface-variant font-medium">Regístrate para recibir comida sana de manera práctica</p>
              </div>

              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <span className="material-icons-span text-base shrink-0">info_outline</span>
                  <span>{registerError}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Complete Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Nombre Completo</label>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">person</span>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                      placeholder="Usuario"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#3d4a3f] uppercase tracking-wider ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">mail</span>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                      placeholder="tu_correo@universidad.edu.pe"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone Contact */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Celular (WhatsApp para entrega)</label>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366] text-base font-bold">chat</span>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                      placeholder="987 654 321"
                    />
                  </div>
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Contraseña</label>
                    <div className="relative">
                      <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">vpn_key</span>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-8 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                        placeholder="Mín. 6 carac."
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="material-icons-span absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/75 hover:text-on-surface cursor-pointer text-sm"
                      >
                        {showRegPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Confirmar</label>
                    <div className="relative">
                      <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">vpn_key</span>
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-8 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                        placeholder="Mín. 6 carac."
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="material-icons-span absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/75 hover:text-on-surface cursor-pointer text-sm"
                      >
                        {showRegConfirmPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* University / Faculty selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider ml-1">Universidad o Facultad</label>
                  <div className="relative">
                    <span className="material-icons-span absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-base">school</span>
                    <input
                      type="text"
                      required
                      value={regUniversity}
                      onChange={(e) => setRegUniversity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-2.5 pl-9 pr-4 text-xs font-bold text-on-surface focus:outline-none focus:ring-1.5 focus:ring-[#1B5E20]/30 focus:border-[#1B5E20] transition-all placeholder:text-on-surface-variant/50"
                      placeholder="UPN - Campus Norte"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 mt-3 bg-[#1B5E20] text-white font-bold rounded-[12px] hover:bg-[#154618] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#1B5E20]/15"
                >
                  <span className="material-icons-span text-white text-base font-bold font-sans">app_registration</span>
                  Crear cuenta
                </button>
              </form>

              {/* Secondary CTA */}
              <div className="text-center pt-1.5">
                <p className="text-xs text-on-surface-variant font-medium">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => {
                      setLoginError('');
                      setMode('login');
                    }}
                    className="text-[#1B5E20] font-black hover:underline cursor-pointer"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto border border-[#25D366]/20">
                <span className="material-icons-span text-[#128C7E] text-3xl font-bold">chat</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-[#1B5E20]">Verificación por WhatsApp</h2>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-[320px] mx-auto">
                  Hemos enviado un código SMS o mensaje de confirmación de 4 dígitos para validar el número de celular <span className="font-extrabold text-on-surface">+{regPhone}</span>.
                </p>
              </div>

              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 max-w-sm mx-auto text-left">
                  <span className="material-icons-span text-base shrink-0">info_outline</span>
                  <span>{otpError}</span>
                </div>
              )}

              {/* Enter OTP Code Form */}
              <form onSubmit={handleOtpVerify} className="space-y-4 max-w-sm mx-auto">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-wider block">Código de Verificación</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-48 bg-slate-50 border border-slate-300 rounded-2xl py-3 text-center text-xl font-black tracking-[0.6em] text-on-surface focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/35 focus:border-[#1B5E20] mx-auto transition-all"
                    placeholder="••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.length < 4}
                  className="w-full h-12 bg-[#1B5E20] text-white font-bold rounded-xl hover:bg-[#154618] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#1B5E20]/15"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons-span text-white text-base">verified</span>
                      <span>Confirmar registro</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend details */}
              <div className="space-y-2 pt-2">
                <p className="text-xs text-on-surface-variant font-medium">¿No recibiste el código?</p>
                <button
                  onClick={() => triggerOtpSend()}
                  className="bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/20 hover:bg-[#25D366]/20 px-4 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5"
                >
                  <span className="material-icons-span text-sm font-sans">history</span>
                  Volver a enviar por WhatsApp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Trust Signoff Footer */}
      <footer className="w-full text-center py-2 px-6">
        <p className="text-[10px] text-on-surface-variant/75 font-semibold">
          Tu información se encuentra encriptada y protegida bajo políticas universitarias.
        </p>
      </footer>
    </div>
  );
}
