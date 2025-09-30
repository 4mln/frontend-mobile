// API Configuration
export const API_CONFIG = {
  // Backend URL - Update this to match your backend
  BASE_URL: (process.env.EXPO_PUBLIC_API_URL || process.env.BACKEND_URL || (__DEV__ 
    ? 'http://localhost:8000' 
    : 'https://api.b2b-marketplace.com')) as string,
  
  // API prefix (set EXPO_PUBLIC_API_PREFIX="" if your backend has no prefix)
  API_PREFIX: (typeof process !== 'undefined' && process.env && typeof process.env.EXPO_PUBLIC_API_PREFIX !== 'undefined'
    ? String(process.env.EXPO_PUBLIC_API_PREFIX)
    : '/api/v1') as string,
  
  // API Version
  VERSION: 'v1',
  
  // Timeout settings
  TIMEOUT: 10000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      SEND_OTP: '/auth/otp/request',
      VERIFY_OTP: '/auth/otp/verify',
      REFRESH_TOKEN: '/refresh',
      PROFILE: '/auth/me/profile',
      CURRENT_USER: '/auth/me',
      LOGOUT: '/auth/me/sessions/logout-all',
    },
    
    // Product endpoints
    PRODUCTS: {
      LIST: '/products',
      GET: '/products/:id',
      CREATE: '/products',
      UPDATE: '/products/:id',
      DELETE: '/products/:id',
      SEARCH: '/products/search',
    },
    
    // Guild endpoints (categories)
    GUILDS: {
      LIST: '/guilds',
      GET: '/guilds/:id',
      PRODUCTS: '/guilds/:id/products',
    },
    
    // Seller endpoints
    SELLERS: {
      LIST: '/sellers',
      GET: '/sellers/:id',
      STOREFRONT: '/sellers/:id/storefront',
    },
    
    // RFQ endpoints
    RFQS: {
      LIST: '/rfqs',
      GET: '/rfqs/:id',
      CREATE: '/rfqs',
      UPDATE: '/rfqs/:id',
      DELETE: '/rfqs/:id',
    },
    
    // Chat endpoints
    CHAT: {
      CONVERSATIONS: '/chat/conversations',
      MESSAGES: '/chat/conversations/:id/messages',
      SEND_MESSAGE: '/chat/conversations/:id/messages',
      CREATE_CONVERSATION: '/chat/conversations',
    },
    
    // Wallet endpoints
    WALLET: {
      BALANCE: '/wallet/balance',
      TRANSACTIONS: '/wallet/transactions',
      TOP_UP: '/wallet/top-up',
      WITHDRAW: '/wallet/withdraw',
    },
  },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// Helper function to get API endpoint
export const getApiEndpoint = (category: keyof typeof API_CONFIG.ENDPOINTS, endpoint: string): string => {
  const categoryEndpoints = API_CONFIG.ENDPOINTS[category] as Record<string, string>;
  return categoryEndpoints[endpoint] || '';
};
