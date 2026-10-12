export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  offersCount: number;
  keywords: string[];
}

export const productsDatabase: Product[] = [
  // Garmin
  {
    id: '1',
    name: 'Garmin Edge 850',
    category: 'Ciclocomputer GPS',
    image: '🚴',
    minPrice: 439.99,
    maxPrice: 549.99,
    avgPrice: 469.00,
    offersCount: 10,
    keywords: ['garmin', 'edge', '850', 'gps', 'ciclocomputer', 'bici', 'cycling'],
  },
  {
    id: '2',
    name: 'Garmin Edge 550',
    category: 'Ciclocomputer GPS',
    image: '🚴',
    minPrice: 279.99,
    maxPrice: 349.99,
    avgPrice: 299.00,
    offersCount: 8,
    keywords: ['garmin', 'edge', '550', 'gps', 'ciclocomputer', 'bici'],
  },
  {
    id: '3',
    name: 'Garmin Fenix 7',
    category: 'Smartwatch Sportivo',
    image: '⌚',
    minPrice: 599.00,
    maxPrice: 899.00,
    avgPrice: 699.00,
    offersCount: 12,
    keywords: ['garmin', 'fenix', '7', 'smartwatch', 'orologio', 'sport'],
  },
  
  // Apple
  {
    id: '4',
    name: 'iPhone 15 Pro',
    category: 'Smartphone',
    image: '📱',
    minPrice: 1099.00,
    maxPrice: 1499.00,
    avgPrice: 1249.00,
    offersCount: 15,
    keywords: ['iphone', '15', 'pro', 'apple', 'smartphone', 'telefono'],
  },
  {
    id: '5',
    name: 'iPhone 15',
    category: 'Smartphone',
    image: '📱',
    minPrice: 899.00,
    maxPrice: 1199.00,
    avgPrice: 999.00,
    offersCount: 18,
    keywords: ['iphone', '15', 'apple', 'smartphone', 'telefono'],
  },
  {
    id: '6',
    name: 'MacBook Air M3',
    category: 'Laptop',
    image: '💻',
    minPrice: 1199.00,
    maxPrice: 1599.00,
    avgPrice: 1349.00,
    offersCount: 9,
    keywords: ['macbook', 'air', 'm3', 'apple', 'laptop', 'computer'],
  },
  {
    id: '7',
    name: 'iPad Pro M2',
    category: 'Tablet',
    image: '📱',
    minPrice: 1099.00,
    maxPrice: 1499.00,
    avgPrice: 1249.00,
    offersCount: 11,
    keywords: ['ipad', 'pro', 'm2', 'apple', 'tablet'],
  },
  
  // Gaming
  {
    id: '8',
    name: 'PlayStation 5',
    category: 'Console Gaming',
    image: '🎮',
    minPrice: 449.00,
    maxPrice: 549.00,
    avgPrice: 499.00,
    offersCount: 14,
    keywords: ['playstation', 'ps5', '5', 'sony', 'console', 'gaming'],
  },
  {
    id: '9',
    name: 'Xbox Series X',
    category: 'Console Gaming',
    image: '🎮',
    minPrice: 449.00,
    maxPrice: 549.00,
    avgPrice: 499.00,
    offersCount: 12,
    keywords: ['xbox', 'series', 'x', 'microsoft', 'console', 'gaming'],
  },
  {
    id: '10',
    name: 'Nintendo Switch OLED',
    category: 'Console Gaming',
    image: '🎮',
    minPrice: 319.00,
    maxPrice: 379.00,
    avgPrice: 349.00,
    offersCount: 16,
    keywords: ['nintendo', 'switch', 'oled', 'console', 'gaming'],
  },
  {
    id: '11',
    name: 'Steam Deck',
    category: 'Console Portatile',
    image: '🎮',
    minPrice: 419.00,
    maxPrice: 679.00,
    avgPrice: 549.00,
    offersCount: 7,
    keywords: ['steam', 'deck', 'valve', 'console', 'portatile', 'gaming'],
  },
  
  // Audio
  {
    id: '12',
    name: 'AirPods Pro 2',
    category: 'Cuffie Wireless',
    image: '🎧',
    minPrice: 229.00,
    maxPrice: 299.00,
    avgPrice: 259.00,
    offersCount: 20,
    keywords: ['airpods', 'pro', '2', 'apple', 'cuffie', 'auricolari', 'wireless'],
  },
  {
    id: '13',
    name: 'Sony WH-1000XM5',
    category: 'Cuffie Noise Cancelling',
    image: '🎧',
    minPrice: 329.00,
    maxPrice: 449.00,
    avgPrice: 379.00,
    offersCount: 13,
    keywords: ['sony', 'wh-1000xm5', 'xm5', 'cuffie', 'noise cancelling', 'wireless'],
  },
  {
    id: '14',
    name: 'Bose QuietComfort Ultra',
    category: 'Cuffie Noise Cancelling',
    image: '🎧',
    minPrice: 379.00,
    maxPrice: 479.00,
    avgPrice: 429.00,
    offersCount: 10,
    keywords: ['bose', 'quietcomfort', 'ultra', 'cuffie', 'noise cancelling'],
  },
  
  // Scarpe Sportive
  {
    id: '15',
    name: 'Nike Air Max 90',
    category: 'Scarpe Sportive',
    image: '👟',
    minPrice: 119.00,
    maxPrice: 179.00,
    avgPrice: 149.00,
    offersCount: 25,
    keywords: ['nike', 'air', 'max', '90', 'scarpe', 'sneakers', 'sport'],
  },
  {
    id: '16',
    name: 'Adidas Ultraboost',
    category: 'Scarpe Running',
    image: '👟',
    minPrice: 149.00,
    maxPrice: 219.00,
    avgPrice: 179.00,
    offersCount: 18,
    keywords: ['adidas', 'ultraboost', 'scarpe', 'running', 'corsa'],
  },
  {
    id: '17',
    name: 'New Balance 550',
    category: 'Scarpe Lifestyle',
    image: '👟',
    minPrice: 99.00,
    maxPrice: 149.00,
    avgPrice: 119.00,
    offersCount: 22,
    keywords: ['new', 'balance', '550', 'scarpe', 'sneakers', 'lifestyle'],
  },
  
  // TV
  {
    id: '18',
    name: 'Samsung QLED 55"',
    category: 'Smart TV',
    image: '📺',
    minPrice: 699.00,
    maxPrice: 999.00,
    avgPrice: 849.00,
    offersCount: 11,
    keywords: ['samsung', 'qled', '55', 'tv', 'televisione', 'smart tv'],
  },
  {
    id: '19',
    name: 'LG OLED 55"',
    category: 'Smart TV',
    image: '📺',
    minPrice: 999.00,
    maxPrice: 1499.00,
    avgPrice: 1199.00,
    offersCount: 9,
    keywords: ['lg', 'oled', '55', 'tv', 'televisione', 'smart tv'],
  },
  
  // Fotocamere
  {
    id: '20',
    name: 'Sony A7 IV',
    category: 'Fotocamera Mirrorless',
    image: '📷',
    minPrice: 2199.00,
    maxPrice: 2699.00,
    avgPrice: 2399.00,
    offersCount: 8,
    keywords: ['sony', 'a7', 'iv', '4', 'fotocamera', 'mirrorless', 'camera'],
  },
  {
    id: '21',
    name: 'Canon EOS R6',
    category: 'Fotocamera Mirrorless',
    image: '📷',
    minPrice: 1999.00,
    maxPrice: 2499.00,
    avgPrice: 2199.00,
    offersCount: 7,
    keywords: ['canon', 'eos', 'r6', 'fotocamera', 'mirrorless', 'camera'],
  },
  
  // Elettrodomestici
  {
    id: '22',
    name: 'Dyson V15 Detect',
    category: 'Aspirapolvere',
    image: '🧹',
    minPrice: 599.00,
    maxPrice: 799.00,
    avgPrice: 699.00,
    offersCount: 14,
    keywords: ['dyson', 'v15', 'detect', 'aspirapolvere', 'pulizia'],
  },
  {
    id: '23',
    name: 'iRobot Roomba j7+',
    category: 'Robot Aspirapolvere',
    image: '🤖',
    minPrice: 599.00,
    maxPrice: 899.00,
    avgPrice: 749.00,
    offersCount: 10,
    keywords: ['irobot', 'roomba', 'j7', 'robot', 'aspirapolvere', 'pulizia'],
  },
];

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  
  return productsDatabase
    .map(product => {
      let score = 0;
      
      // Match nel nome
      searchTerms.forEach(term => {
        if (product.name.toLowerCase().includes(term)) {
          score += 10;
        }
        
        // Match nelle keyword
        product.keywords.forEach(keyword => {
          if (keyword.includes(term) || term.includes(keyword)) {
            score += 5;
          }
        });
        
        // Match nella categoria
        if (product.category.toLowerCase().includes(term)) {
          score += 3;
        }
      });
      
      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
    .slice(0, 8); // Max 8 risultati
}
