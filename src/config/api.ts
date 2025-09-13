// API Configuration
export const API_CONFIG = {
  // Backend URL - Update this to match your backend
  BASE_URL: __DEV__ 
    ? 'http://localhost:8000' 
    : 'https://api.b2b-marketplace.com',
  
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
      SEND_OTP: '/otp/request',
      VERIFY_OTP: '/otp/verify',
      REFRESH_TOKEN: '/auth/refresh',
      PROFILE: '/me/profile',
      CURRENT_USER: '/me',
      LOGOUT: '/me/sessions/logout-all',
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
    
    // Guild endpoints
    GUILDS: {
      LIST: '/guilds',
      GET: '/guilds/:id',
      PRODUCTS: '/guilds/:id/products',
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
