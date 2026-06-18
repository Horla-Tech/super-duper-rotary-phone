export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  specs: string[];
  inStock: boolean;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "400W Monocrystalline Solar Panel",
    category: "Solar Panels",
    price: 85000,
    image: "/gallery/solar-residential.jpg",
    badge: "Best Seller",
    description: "High-efficiency monocrystalline panel for residential and commercial installations.",
    specs: ["400W Peak Power", "Mono PERC Technology", "25-Year Warranty", "IP68 Rated Junction Box"],
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "200W Monocrystalline Solar Panel",
    category: "Solar Panels",
    price: 45000,
    image: "/gallery/solar-battery.jpg",
    description: "Compact and efficient — ideal for smaller homes and off-grid setups.",
    specs: ["200W Peak Power", "High Efficiency Cells", "10-Year Product Warranty", "Anodised Aluminium Frame"],
    inStock: true,
    featured: false,
  },
  {
    id: 3,
    name: "5kVA/48V Hybrid Solar Inverter",
    category: "Inverters",
    price: 320000,
    image: "/gallery/inverter-setup.jpg",
    badge: "Premium",
    description: "Smart hybrid inverter with built-in MPPT controller and grid-tie capability.",
    specs: ["5kVA Continuous Output", "Built-in 80A MPPT", "Grid-tie + Off-grid", "App Monitoring"],
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: "3.5kVA/24V Pure Sine Wave Inverter",
    category: "Inverters",
    price: 180000,
    image: "/gallery/inverter-setup.jpg",
    description: "Reliable pure sine wave output — safe for all sensitive electronics and appliances.",
    specs: ["3.5kVA Output", "Pure Sine Wave", "Auto Transfer Switch", "Overload Protection"],
    inStock: true,
    featured: false,
  },
  {
    id: 5,
    name: "200Ah 12V LiFePO4 Lithium Battery",
    category: "Batteries",
    price: 350000,
    image: "/gallery/backup-commercial.jpg",
    badge: "Top Pick",
    description: "Premium lithium iron phosphate — 3000+ cycles, lightweight, and inherently safe.",
    specs: ["200Ah Capacity", "LiFePO4 Chemistry", "3000+ Cycle Life", "Built-in BMS Protection"],
    inStock: true,
    featured: true,
  },
  {
    id: 6,
    name: "200Ah 12V Gel Deep Cycle Battery",
    category: "Batteries",
    price: 120000,
    image: "/gallery/backup-commercial.jpg",
    description: "Maintenance-free gel battery ideal for solar and inverter backup systems.",
    specs: ["200Ah Capacity", "Sealed Gel Technology", "Maintenance Free", "Deep Cycle Design"],
    inStock: true,
    featured: false,
  },
  {
    id: 7,
    name: "60A MPPT Solar Charge Controller",
    category: "Accessories",
    price: 75000,
    image: "/gallery/smart-home.jpg",
    description: "Intelligent MPPT controller with real-time monitoring and multiple protection modes.",
    specs: ["60A Charge Current", "MPPT Technology", "LCD Display", "12/24/48V Auto-detect"],
    inStock: true,
    featured: true,
  },
  {
    id: 8,
    name: "6mm² Solar DC Cable — 10m Roll",
    category: "Accessories",
    price: 15000,
    image: "/gallery/electrical-office.jpg",
    description: "UV-resistant, double-insulated DC cable rated for outdoor solar installations.",
    specs: ["6mm² Cross Section", "UV Resistant PVC", "1000V DC Rated", "10m Per Roll"],
    inStock: true,
    featured: false,
  },
];

export const CATEGORIES = ["All", "Solar Panels", "Inverters", "Batteries", "Accessories"];

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}

export function buildWhatsAppUrl(product: Product): string {
  const message = `Hello SYO Energy! I'm interested in ordering:\n\n*Product:* ${product.name}\n*Price:* ${formatPrice(product.price)}\n\nPlease confirm availability and delivery details. Thank you!`;
  return `https://wa.me/2348064263647?text=${encodeURIComponent(message)}`;
}
