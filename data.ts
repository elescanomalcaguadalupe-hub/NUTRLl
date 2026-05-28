import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: "Caja Clásica Proteica",
    category: 'Sándwich',
    price: 8.00,
    imageUrl: "https://i.imgur.com/rQNNTOI.png",
    description: "Sándwich de pollo deshilachado con palta y yogurt natural. Fresco, cremoso y lleno de proteína.",
    kcal: 420,
    macros: {
      protein: "30g",
      carbs: "42g",
      fat: "14g"
    },
    ingredients: [
      "Pan integral con semillas de chía y sésamo",
      "Pechuga de pollo seleccionada deshilachada",
      "Palta Hass fresca tipo puré",
      "Yogurt natural descremado cremoso",
      "Toque sutil de finas hierbas y limón"
    ],
    benefits: [
      "Bajo en grasas trans y saturadas",
      "Aporte continuo de energía gracias a carbohidratos complejos",
      "Excelente relación proteína-caloría para saciedad prolongada"
    ],
    tags: ["Nuevo", "Recomendado"]
  },
  {
    id: '2',
    name: "Wrap Criollo Lomo Saltado Light",
    category: 'Wraps',
    price: 8.00,
    imageUrl: "https://i.imgur.com/AjaWEXj.png",
    description: "Wrap integral relleno de pollo salteado al estilo criollo con cebolla, tomate y ají amarillo.",
    kcal: 390,
    macros: {
      protein: "27g",
      carbs: "45g",
      fat: "10g"
    },
    ingredients: [
      "Fina tortilla de trigo integral de alta elasticidad",
      "Dados de pechuga de pollo salteados al wok",
      "Cebolla morada en pluma",
      "Tomates rojos frescos jugosos",
      "Tiras finas de ají amarillo peruano",
      "Aderezo ligero criollo con sillao bajo en sodio"
    ],
    benefits: [
      "Rico en fibra dietética que favorece la digestión",
      "Muy bajo en grasa agregada gracias a la cocción rápida al wok",
      "Perfecto almuerzo práctico y balanceado para comer entre horas"
    ],
    tags: ["Top ventas", "Criollo"]
  },
  {
    id: '3',
    name: "Power Anticuchero",
    category: 'Platos',
    price: 8.00,
    imageUrl: "https://i.imgur.com/FQ3XuXS.png",
    description: "Pollo anticuchero con papa amarilla, ensalada fresca y cremita de ají amarillo.",
    kcal: 480,
    macros: {
      protein: "35g",
      carbs: "48g",
      fat: "12g"
    },
    ingredients: [
      "Trozos de pechuga de pollo marinados al ají panca",
      "Papas amarillas rústicas sancochadas",
      "Mix de ensalada fresca (lechuga, tomate, zanahoria)",
      "Crema artesanal saludable de ají amarillo sin mayonesa",
      "Vinagreta cítrica ligera"
    ],
    benefits: [
      "Súper alto valor proteico para reconstrucción muscular",
      "Hierro y vitaminas antioxidantes del ají panca natural",
      "Sabor tradicional peruano con mínimo aporte de grasa saturada"
    ],
    tags: ["Alto en proteína", "Criollo"]
  }
];
