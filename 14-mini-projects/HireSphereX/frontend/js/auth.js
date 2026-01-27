// ============================================================================
// AUTH.JS - Authentication Service for HireSphere X
// Handles: Register, Login, Logout, Session Management
// Communicates with: /api/v1/auth/* endpoints
// ============================================================================

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function apiFetch(path, options = {}, autoRefresh = true) {
  const headers = options.headers ? { ...options.headers } : {};
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const authHeader = getAuthHeader();
  if (authHeader) headers['Authorization'] = authHeader;

  const requestOptions = { ...options, headers };
  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);

  if (response.status === 401 && autoRefresh) {
    try {
      await refreshAccessToken();
      const retryHeaders = { ...headers, Authorization: getAuthHeader() };
      const retryOptions = { ...options, headers: retryHeaders };
      return apiFetch(path, retryOptions, false);
    } catch (err) {
      logoutUser();
      throw err;
    }
  }

  return response;
}

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
async function registerUser(fullName, email, password) {
  try {
    showLoadingSpinner();

    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    }, false);

    const data = await response.json();
    hideLoadingSpinner();

    if (!response.ok) {
      // Backend returns { timestamp, status, error, message, ... }
      throw new Error(data.message || 'Registration failed');
    }

    showSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } catch (error) {
    hideLoadingSpinner();
    console.error('Registration error:', error);
    showError(error.message || 'Registration failed. Please try again.');
  }
}

/**
 * Login user
 * POST /api/v1/auth/login
 */
async function loginUser(email, password) {
  try {
    showLoadingSpinner();

    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);

    const data = await response.json();
    hideLoadingSpinner();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Backend returns { accessToken, refreshToken, tokenType }
    const { accessToken, refreshToken, tokenType } = data;

    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('tokenType', tokenType || 'Bearer');

    // Parse token to get user info
    const decoded = parseJWT(accessToken);
    if (decoded) {
      localStorage.setItem('userEmail', decoded.sub || email);
    }

    showSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  } catch (error) {
    hideLoadingSpinner();
    console.error('Login error:', error);
    showError(error.message || 'Login failed. Please check your credentials.');
  }
}

/**
 * Logout user (clear tokens and redirect to login)
 */
function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('userEmail');
  showSuccess('Logged out successfully');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 500);
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  // Check if token is expired
  try {
    const decoded = parseJWT(token);
    const expiryTime = decoded.exp * 1000; // exp is in seconds
    return Date.now() < expiryTime;
  } catch (e) {
    return false;
  }
}

/**
 * Get current session (user info from token)
 */
function getCurrentSession() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = parseJWT(token);
    return {
      email: decoded.sub || localStorage.getItem('userEmail'),
      roles: decoded.roles || [],
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Get authorization header with Bearer token
 */
function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  return token ? `${tokenType} ${token}` : null;
}

/**
 * Require authentication (redirect to login if not authenticated)
 */
function requireAuth() {
  if (!isAuthenticated()) {
    showError('Please log in to continue');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
    return false;
  }
  return true;
}

/**
 * Refresh access token using refresh token
 * POST /api/v1/auth/refresh
 */
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    const { accessToken, refreshToken: newRefreshToken } = data;
    localStorage.setItem('accessToken', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    // If refresh fails, logout user
    logoutUser();
    throw error;
  }
}

async function fetchProfile() {
  const response = await apiFetch('/auth/me', { method: 'GET' });
  if (!response.ok) throw new Error('Failed to load profile');
  return response.json();
}
