/**
 * Utility Functions for HireSphere
 * Common helper functions used across the application
 */

/**
 * Show success notification
 * @param {string} message - Success message
 * @param {number} duration - Display duration in ms
 */
function showSuccess(message, duration = 3000) {
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Show error notification
 * @param {string} message - Error message
 * @param {number} duration - Display duration in ms
 */
function showError(message, duration = 3000) {
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

/**
 * Show loading spinner
 * @param {string} containerId - Container element ID
 */
function showLoadingSpinner(containerId = 'jobsGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>Loading jobs...</p>
    </div>
  `;
  container.style.gridColumn = '1 / -1';
}

/**
 * Hide loading spinner
 * @param {string} containerId - Container element ID
 */
function hideLoadingSpinner(containerId = 'jobsGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const spinner = container.querySelector('.spinner-container');
  if (spinner) spinner.remove();
  container.style.gridColumn = 'auto';
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Debounce function for search
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} Throttled function
 */
function throttle(func, delay = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Highlight search term in text
 * @param {string} text - Text to highlight
 * @param {string} term - Term to highlight
 * @returns {string} HTML with highlighted term
 */
function highlightSearchTerm(text, term) {
  if (!term) return text;
  
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
function truncateText(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get contrasting text color based on background
 * @param {string} bgColor - Background color in hex
 * @returns {string} Text color (black or white)
 */
function getContrastColor(bgColor) {
  const rgb = parseInt(bgColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Generate random color
 * @returns {string} Random color in hex
 */
function generateRandomColor() {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#30cfd0', '#330867',
    '#f5af19', '#f12711'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get company initials for avatar
 * @param {string} companyName - Company name
 * @returns {string} Initials (max 2 characters)
 */
function getInitials(companyName) {
  return companyName
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Copied to clipboard!');
  }).catch(() => {
    showError('Failed to copy');
  });
}

/**
 * Get URL parameters
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
function buildQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} In viewport or not
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 * @param {string} elementId - Element ID to scroll to
 */
function smoothScroll(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Animate number counter
 * @param {HTMLElement} element - Target element
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(Math.round(target));
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.round(current));
    }
  }, 16);
}

/**
 * Add event delegation
 * @param {string} selector - Parent selector
 * @param {string} eventType - Event type
 * @param {string} delegateSelector - Delegate selector
 * @param {Function} callback - Callback function
 */
function delegateEvent(selector, eventType, delegateSelector, callback) {
  const parent = document.querySelector(selector);
  if (!parent) return;

  parent.addEventListener(eventType, (e) => {
    const delegateElement = e.target.closest(delegateSelector);
    if (delegateElement) {
      callback.call(delegateElement, e);
    }
  });
}

/**
 * Safe JSON parse
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}
