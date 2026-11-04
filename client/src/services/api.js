const api = {
  // Base configuration
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

  // Core fetch wrapper to emulate axios behavior with automatic authorization header
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    // If request payload is FormData (for image uploads), don't set Content-Type header
    // browser will set it automatically with appropriate boundary
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const controller = new AbortController();
    const timeout = options.timeout || 35000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let response;
    try {
      response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: options.signal || controller.signal,
        headers
      });
      clearTimeout(timeoutId);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Server request timed out. Please retry in a moment.');
      }
      throw fetchErr;
    }

    const data = await response.json();

    if (!response.ok) {
      // If unauthorized, we could trigger user logout in AuthContext
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.errors = data.errors; // For form validation errors array
      throw error;
    }

    return data;
  },

  // HTTP Method Helpers
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};

export default api;
