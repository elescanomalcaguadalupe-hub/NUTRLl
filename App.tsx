import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import CartScreen from './components/CartScreen';
import TrackingScreen from './components/TrackingScreen';
import ProfileScreen from './components/ProfileScreen';
import AuthScreen from './components/AuthScreen';
import NotificationsScreen from './components/NotificationsScreen';
import { MenuItem, CartItem, UserProfile, Order } from './types';
import { MENU_ITEMS } from './data';

export default function App() {
  // Screen Swapper state: starting with welcome screen
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth' | 'notifications'>('welcome');

  // Pre-populate cart with 1 of product 1 and 1 of product 2 to match screenshots precisely
  const [cart, setCart] = useState<CartItem[]>(() => {
    const bowl = MENU_ITEMS.find(item => item.id === '1');
    const burger = MENU_ITEMS.find(item => item.id === '2');
    const initialCart: CartItem[] = [];
    if (bowl) initialCart.push({ product: bowl, quantity: 1, selectedSnack: 'Bolitas energéticas de avena y maní' });
    if (burger) initialCart.push({ product: burger, quantity: 1, selectedSnack: 'Galleta de avena' });
    return initialCart;
  });

  // User student credentials state initialized with user info
  const [user, setUser] = useState<UserProfile>({
    name: "Usuario",
    email: "usuario@gmail.com",
    phone: "+51 987 654 321",
    address: "",
    photoUrl: "",
    isLoggedIn: false
  });

  // Past historic completed order logs to populate the Profile history
  const [pastOrders, setPastOrders] = useState<Order[]>([
    {
      id: "8121",
      items: [
        { product: MENU_ITEMS[1], quantity: 1 },
        { product: MENU_ITEMS[2], quantity: 1 }
      ],
      subtotal: 16.00,
      total: 16.00,
      status: 'entregado',
      estimatedDelivery: '12:45 PM',
      courier: {
        name: "NutriDelivery",
        photoUrl: "",
        rating: 4.9,
        title: "NutriDelivery Pro"
      },
      createdAt: '22 de Mayo, 12:35 PM'
    },
    {
      id: "7554",
      items: [
        { product: MENU_ITEMS[0], quantity: 1 }
      ],
      subtotal: 8.00,
      total: 8.00,
      status: 'entregado',
      estimatedDelivery: '11:15 AM',
      courier: {
        name: "NutriDelivery",
        photoUrl: "",
        rating: 4.9,
        title: "NutriDelivery Pro"
      },
      createdAt: '18 de Mayo, 11:02 AM'
    }
  ]);

  // Active current placed order tracking element
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Seals/stamps loyalty count state (initialized to 3 to match initial "Llevas 3 de 6 sellos" precisely)
  const [sealsCount, setSealsCount] = useState<number>(3);
  // Whether the user has new unread seal notifications (initialized to true to show orange dot initially)
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);

  // Updates specific food item count in the shopping cart
  const handleUpdateQuantity = (item: MenuItem, change: number, snackText?: string) => {
    setCart(prevCart => {
      let existingIndex = -1;
      if (snackText) {
        existingIndex = prevCart.findIndex(c => c.product.id === item.id && c.selectedSnack === snackText);
      } else {
        existingIndex = prevCart.findIndex(c => c.product.id === item.id);
      }
      
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        const newQty = updatedCart[existingIndex].quantity + change;
        
        if (newQty <= 0) {
          // If count falls to 0, completely exclude it from cart list
          updatedCart.splice(existingIndex, 1);
        } else {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: newQty
          };
        }
        return updatedCart;
      } else if (change > 0) {
        // If it starts with positive increment, insert into cart
        return [...prevCart, { product: item, quantity: change, selectedSnack: snackText }];
      }
      return prevCart;
    });
  };

  // Explicitly purge item from shopping cart
  const handleRemoveItem = (item: MenuItem, snackText?: string) => {
    setCart(prevCart => prevCart.filter(c => {
      if (c.product.id !== item.id) return true;
      if (snackText && c.selectedSnack !== snackText) return true;
      return false;
    }));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const navigateToScreen = (screen: 'welcome' | 'menu' | 'cart' | 'tracking' | 'profile' | 'auth' | 'notifications') => {
    if (screen === 'tracking' && !activeOrder) {
      setCurrentScreen('menu');
      return;
    }
    setCurrentScreen(screen);
  };

  const handleConfirmOrder = (deliveryAddress: string, deliveryTime: string, paymentMethod: 'yape' | 'efectivo') => {
    // Save the address automatically to the user's profile for subsequent orders
    setUser(prev => ({ ...prev, address: deliveryAddress }));

    // Increment seals/stamps count and trigger notifications dot
    setSealsCount(prev => {
      const nextCount = Math.min(6, prev + 1);
      if (nextCount > prev) {
        setHasNotifications(true);
      }
      return nextCount;
    });

    const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    
    // Create new tracking order payload
    const newOrder: Order = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      items: [...cart],
      subtotal,
      total: subtotal,
      status: 'preparando',
      estimatedDelivery: deliveryTime,
      deliveryAddress,
      deliveryTime,
      paymentMethod,
      courier: {
        name: "NutriDelivery",
        photoUrl: "",
        rating: 4.9,
        title: "NutriDelivery Pro"
      },
      createdAt: 'Hoy, ' + new Date().toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit' })
    };

    setActiveOrder(newOrder);
    
    // Incorporate order to historic perfil logs
    setPastOrders(prev => [newOrder, ...prev]);
    
    // Smooth transition to active Live Tracking Screen
    setCurrentScreen('tracking');
    
    // Reset shopping cart state for subsequent orders
    setCart([]);
  };

  const handleResetOrder = () => {
    setActiveOrder(null);
    setCart([]);
    setCurrentScreen('menu');
  };

  return (
    <div className="min-h-screen bg-background antialiased max-w-md mx-auto shadow-2xl relative border-x border-outline-variant/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.18 }}
          className="w-full h-full"
        >
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onVerMenu={() => setCurrentScreen('menu')}
              onEntrar={() => setCurrentScreen('auth')}
              user={user}
              onSelectScreen={navigateToScreen}
              onUpdateUser={setUser}
              sealsCount={sealsCount}
            />
          )}

          {currentScreen === 'auth' && (
            <AuthScreen
              onAuthSuccess={(updatedUser) => {
                setUser(prev => ({ ...prev, ...updatedUser, isLoggedIn: true }));
                setCurrentScreen('profile');
              }}
              onBackToHome={() => setCurrentScreen('welcome')}
              onSelectScreen={navigateToScreen}
            />
          )}

          {currentScreen === 'menu' && (
            <MenuScreen
              items={MENU_ITEMS}
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onGoToCart={() => setCurrentScreen('cart')}
              onSelectScreen={navigateToScreen}
              userAddress={user.address}
              onUpdateAddress={(newAddr) => setUser(prev => ({ ...prev, address: newAddr }))}
              hasNotifications={hasNotifications}
            />
          )}

          {currentScreen === 'cart' && (
            <CartScreen
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onConfirmOrder={handleConfirmOrder}
              onSelectScreen={navigateToScreen}
              userAddress={user.address}
            />
          )}

          {currentScreen === 'tracking' && (
            <TrackingScreen
              order={activeOrder}
              onSelectScreen={navigateToScreen}
              onResetOrder={handleResetOrder}
            />
          )}

          {currentScreen === 'profile' && (
            user.isLoggedIn ? (
              <ProfileScreen
                user={user}
                pastOrders={pastOrders}
                activeOrder={activeOrder}
                onUpdateUser={setUser}
                onSelectScreen={navigateToScreen}
              />
            ) : (
              <AuthScreen
                onAuthSuccess={(updatedUser) => {
                  setUser(prev => ({ ...prev, ...updatedUser, isLoggedIn: true }));
                  setCurrentScreen('profile');
                }}
                onBackToHome={() => setCurrentScreen('welcome')}
                onSelectScreen={navigateToScreen}
              />
            )
          )}

          {currentScreen === 'notifications' && (
            <NotificationsScreen
              sealsCount={sealsCount}
              onSelectScreen={navigateToScreen}
              onReadNotifications={() => setHasNotifications(false)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
