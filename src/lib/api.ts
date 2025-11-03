// API service for Digital Fortress backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Failed to connect to server. Please make sure the backend is running on ${API_BASE_URL.replace('/api','')}`);
    }
    throw error;
  }
}

// Upload file helper
async function uploadFile(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
}

// Authentication APIs
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

// Posts APIs
export const postsAPI = {
  getAll: async () => {
    const data = await apiRequest('/posts');
    // Handle both response formats: { data: [...] } or { data: { data: [...] } }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return data.data?.data || [];
  },

  getById: async (id: string) => {
    const data = await apiRequest(`/posts/${id}`);
    return data.data;
  },

  create: async (postData: {
    title: string;
    content: string;
    riskType: string;
    riskLevel: 'low' | 'medium' | 'high';
    isAnonymous: boolean;
    media?: File;
  }) => {
    const token = authAPI.getToken();
    if (!token) throw new Error('Not authenticated');

    if (postData.media) {
      // Upload with file
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('riskType', postData.riskType);
      formData.append('riskLevel', postData.riskLevel);
      formData.append('isAnonymous', String(postData.isAnonymous));
      formData.append('media', postData.media);

      return await uploadFile('/posts', formData, token);
    } else {
      // Upload without file
      return await apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          riskType: postData.riskType,
          riskLevel: postData.riskLevel,
          isAnonymous: postData.isAnonymous,
        }),
      });
    }
  },

  like: async (postId: string) => {
    const data = await apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
    return data.data;
  },

  comment: async (postId: string, message: string) => {
    const data = await apiRequest(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return data.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return await apiRequest('/health');
  },
};

// Deception & Awareness Feed APIs
export const deceptionAPI = {
  // Get public feed
  getPublicFeed: async (limit = 20, skip = 0) => {
    const data = await apiRequest(`/deceptions/public?limit=${limit}&skip=${skip}`);
    return data.data || [];
  },

  // Get specific event details
  getEventDetails: async (id: string) => {
    const data = await apiRequest(`/deceptions/${id}`);
    return data.data;
  },

  // Log a deception event (used by extension/system)
  logEvent: async (eventData: {
    title: string;
    summary: string;
    type: string;
    threat_source?: string;
    protected_items?: string[];
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    source?: string;
  }) => {
    const token = authAPI.getToken();
    return await apiRequest('/deceptions/log', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  // Report suspicious site (user manual report)
  reportSuspicious: async (reportData: {
    url: string;
    description: string;
    type?: string;
  }) => {
    return await apiRequest('/deceptions/report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },
};

