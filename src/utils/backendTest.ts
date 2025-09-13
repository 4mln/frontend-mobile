import { API_CONFIG } from '@/config/api';

export interface BackendTestResult {
  isConnected: boolean;
  status?: number;
  error?: string;
  responseTime?: number;
  backendUrl: string;
}

/**
 * Test connection to the backend
 */
export const testBackendConnection = async (): Promise<BackendTestResult> => {
  const startTime = Date.now();
  const backendUrl = API_CONFIG.BASE_URL;
  
  try {
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend health check successful:', data);
      
      return {
        isConnected: true,
        status: response.status,
        responseTime,
        backendUrl,
      };
    } else {
      return {
        isConnected: false,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
        backendUrl,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('Backend connection test failed:', error);
    
    return {
      isConnected: false,
      error: errorMessage,
      responseTime,
      backendUrl,
    };
  }
};

/**
 * Test OTP endpoint availability
 */
export const testOTPEndpoint = async (): Promise<BackendTestResult> => {
  const startTime = Date.now();
  const backendUrl = API_CONFIG.BASE_URL;
  
  try {
    // Test with a dummy phone number to check if endpoint exists
    const response = await fetch(`${backendUrl}${API_CONFIG.ENDPOINTS.AUTH.SEND_OTP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ phone: '09123456789' }),
      signal: AbortSignal.timeout(5000),
    });
    
    const responseTime = Date.now() - startTime;
    
    // We expect either success or validation error, not 404
    if (response.status === 200 || response.status === 422) {
      return {
        isConnected: true,
        status: response.status,
        responseTime,
        backendUrl,
      };
    } else {
      return {
        isConnected: false,
        status: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
        backendUrl,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      isConnected: false,
      error: errorMessage,
      responseTime,
      backendUrl,
    };
  }
};

/**
 * Run comprehensive backend tests
 */
export const runBackendTests = async (): Promise<{
  health: BackendTestResult;
  otp: BackendTestResult;
  overall: boolean;
}> => {
  console.log('Testing backend connection...');
  
  const [healthResult, otpResult] = await Promise.all([
    testBackendConnection(),
    testOTPEndpoint(),
  ]);
  
  const overall = healthResult.isConnected && otpResult.isConnected;
  
  console.log('Backend test results:', {
    health: healthResult,
    otp: otpResult,
    overall,
  });
  
  return {
    health: healthResult,
    otp: otpResult,
    overall,
  };
};
