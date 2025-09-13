import apiClient from './api';

// Types
export interface RFQ {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity?: string;
  budget?: string;
  deliveryDate?: string;
  location?: string;
  specifications?: string;
  status: 'open' | 'closed' | 'awarded';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  quotes: Quote[];
  attachments?: Attachment[];
}

export interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplier: Supplier;
  price: number;
  description: string;
  deliveryTime: string;
  terms: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  verified: boolean;
  location: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size: number;
}

export interface CreateRFQRequest {
  title: string;
  description: string;
  category: string;
  quantity?: string;
  budget?: string;
  deliveryDate?: string;
  location?: string;
  specifications?: string;
  attachments?: Attachment[];
}

export interface UpdateRFQRequest {
  title?: string;
  description?: string;
  category?: string;
  quantity?: string;
  budget?: string;
  deliveryDate?: string;
  location?: string;
  specifications?: string;
  status?: 'open' | 'closed' | 'awarded';
  attachments?: Attachment[];
}

export interface RFQFilters {
  category?: string;
  status?: string;
  location?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'budget_high' | 'budget_low';
  page?: number;
  limit?: number;
}

export interface RFQSearchResponse {
  rfqs: RFQ[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateQuoteRequest {
  price: number;
  description: string;
  deliveryTime: string;
  terms: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// RFQ service functions
export const rfqService = {
  /**
   * Get all RFQs with optional filters
   */
  async getRFQs(filters?: RFQFilters): Promise<ApiResponse<RFQSearchResponse>> {
    try {
      const response = await apiClient.get('/rfqs', { params: filters });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch RFQs',
        success: false,
      };
    }
  },

  /**
   * Get a specific RFQ by ID
   */
  async getRFQById(id: string): Promise<ApiResponse<RFQ>> {
    try {
      const response = await apiClient.get(`/rfqs/${id}`);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch RFQ',
        success: false,
      };
    }
  },

  /**
   * Create a new RFQ
   */
  async createRFQ(data: CreateRFQRequest): Promise<ApiResponse<RFQ>> {
    try {
      const response = await apiClient.post('/rfqs', data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to create RFQ',
        success: false,
      };
    }
  },

  /**
   * Update an existing RFQ
   */
  async updateRFQ(id: string, data: UpdateRFQRequest): Promise<ApiResponse<RFQ>> {
    try {
      const response = await apiClient.put(`/rfqs/${id}`, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to update RFQ',
        success: false,
      };
    }
  },

  /**
   * Delete an RFQ
   */
  async deleteRFQ(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/rfqs/${id}`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to delete RFQ',
        success: false,
      };
    }
  },

  /**
   * Search RFQs
   */
  async searchRFQs(query: string, filters?: Omit<RFQFilters, 'search'>): Promise<ApiResponse<RFQSearchResponse>> {
    try {
      const response = await apiClient.get('/rfqs/search', {
        params: { q: query, ...filters },
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to search RFQs',
        success: false,
      };
    }
  },

  /**
   * Get user's RFQs
   */
  async getUserRFQs(filters?: Omit<RFQFilters, 'user'>): Promise<ApiResponse<RFQSearchResponse>> {
    try {
      const response = await apiClient.get('/me/rfqs', { params: filters });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch user RFQs',
        success: false,
      };
    }
  },

  /**
   * Submit a quote for an RFQ
   */
  async submitQuote(rfqId: string, data: CreateQuoteRequest): Promise<ApiResponse<Quote>> {
    try {
      const response = await apiClient.post(`/rfqs/${rfqId}/quotes`, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to submit quote',
        success: false,
      };
    }
  },

  /**
   * Get quotes for an RFQ
   */
  async getRFQQuotes(rfqId: string): Promise<ApiResponse<Quote[]>> {
    try {
      const response = await apiClient.get(`/rfqs/${rfqId}/quotes`);
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch quotes',
        success: false,
      };
    }
  },

  /**
   * Accept a quote
   */
  async acceptQuote(rfqId: string, quoteId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.patch(`/rfqs/${rfqId}/quotes/${quoteId}/accept`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to accept quote',
        success: false,
      };
    }
  },

  /**
   * Reject a quote
   */
  async rejectQuote(rfqId: string, quoteId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.patch(`/rfqs/${rfqId}/quotes/${quoteId}/reject`);
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to reject quote',
        success: false,
      };
    }
  },

  /**
   * Get user's quotes
   */
  async getUserQuotes(filters?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<Quote[]>> {
    try {
      const response = await apiClient.get('/me/quotes', { params: filters });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to fetch user quotes',
        success: false,
      };
    }
  },

  /**
   * Upload RFQ attachments
   */
  async uploadAttachments(attachments: FormData): Promise<ApiResponse<Attachment[]>> {
    try {
      const response = await apiClient.post('/rfqs/attachments', attachments, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error: any) {
      return {
        error: error.response?.data?.detail || 'Failed to upload attachments',
        success: false,
      };
    }
  },
};
