export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  kcal: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: string[];
  benefits: string[];
  tags: string[];
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
  selectedSnack?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  isLoggedIn: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'preparando' | 'en_camino' | 'cerca' | 'entregado';
  estimatedDelivery: string;
  courier: {
    name: string;
    photoUrl: string;
    rating: number;
    title: string;
  };
  createdAt: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  paymentMethod?: 'yape' | 'efectivo';
}
