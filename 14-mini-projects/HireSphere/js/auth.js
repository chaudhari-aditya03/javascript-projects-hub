/**
 * Authentication Module for HireSphere
 * Handles user login, registration, and session management
 */

/**
 * Register new user
 * @param {Object} userData - User data object
 * @returns {boolean} Success/failure
 */
function registerUser(userData) {
  try {
    // Validate input
    if (!userData.name || !userData.email || !userData.password || !userData.location) {
      showError('Please fill all required fields');
      return false;
    }

    // Validate email format
    if (!isValidEmail(userData.email)) {
      showError('Please enter a valid email address');
      return false;
    }

    // Validate password length
    if (userData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return false;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === userData.email)) {
      showError('Email already registered');
      return false;
    }

    // Create user object
    const user = {
      id: generateUniqueId(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: btoa(userData.password), // Basic encoding (not secure - use backend in production)
      skills: userData.skills ? userData.skills.split(',').map(s => s.trim()) : [],
      location: userData.location.trim(),
      phone: userData.phone?.trim() || '',
      linkedin: userData.linkedin?.trim() || '',
      createdAt: new Date().toISOString(),
      savedJobs: []
    };

    // Store user
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('✅ User registered successfully');
    showSuccess('Registration successful! Redirecting to login...');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);

    return true;

  } catch (error) {
    console.error('❌ Registration error:', error);
    showError('Registration failed. Please try again.');
    return false;
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} Success/failure
 */
function loginUser(email, password) {
  try {
    // Validate input
    if (!email || !password) {
      showError('Please enter email and password');
      return false;
    }

    // Retrieve users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user
    const user = users.find(u => 
      u.email === email.toLowerCase().trim() && 
      u.password === btoa(password)
    );

    if (!user) {
      showError('Invalid email or password');
      return false;
    }

    // Create session
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      location: user.location,
      phone: user.phone,
      linkedin: user.linkedin,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentSession', JSON.stringify(session));
    console.log('✅ User logged in successfully');
    showSuccess('Login successful! Redirecting to dashboard...');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

    return true;

  } catch (error) {
    console.error('❌ Login error:', error);
    showError('Login failed. Please try again.');
    return false;
  }
}

/**
 * Logout user
 */
function logoutUser() {
  localStorage.removeItem('currentSession');
  console.log('✅ User logged out');
  showSuccess('You have been logged out');
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

/**
 * Get current user session
 * @returns {Object|null} Current session or null
 */
function getCurrentSession() {
  const session = localStorage.getItem('currentSession');
  return session ? JSON.parse(session) : null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
  return getCurrentSession() !== null;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

/**
 * Update user profile
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success/failure
 */
function updateUserProfile(updates) {
  try {
    const session = getCurrentSession();
    if (!session) return false;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === session.userId);

    if (userIndex === -1) return false;

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Update session
    const updatedSession = {
      ...session,
      ...updates
    };
    localStorage.setItem('currentSession', JSON.stringify(updatedSession));

    console.log('✅ Profile updated');
    return true;

  } catch (error) {
    console.error('❌ Profile update error:', error);
    return false;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Valid/invalid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateUniqueId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Seed demo user if not present
 */
function seedDemoUser() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const demoEmail = 'aditya@gmail.com';
  const demoPassword = 'aditya@2005';

  if (!users.some(u => u.email === demoEmail)) {
    const demoUser = {
      id: generateUniqueId(),
      name: 'Aditya Demo',
      email: demoEmail,
      password: btoa(demoPassword),
      skills: ['JavaScript', 'React', 'Node.js'],
      location: 'Mumbai, India',
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/aditya-demo',
      createdAt: new Date().toISOString(),
      savedJobs: []
    };
    users.push(demoUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✅ Seeded demo user');
  }
}

// Ensure demo account exists for quick login
seedDemoUser();

/**
 * Save job to user's saved jobs
 * @param {string} jobId - Job ID to save
 */
function saveJobForLater(jobId) {
  try {
    const session = getCurrentSession();
    if (!session) {
      showError('Please login to save jobs');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === session.userId);

    if (userIndex === -1) return;

    const user = users[userIndex];
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update session
      session.savedJobs = user.savedJobs;
      localStorage.setItem('currentSession', JSON.stringify(session));
      
      showSuccess('Job saved successfully');
    }

  } catch (error) {
    console.error('❌ Save job error:', error);
  }
}

/**
 * Get saved jobs for current user
 * @returns {Array} Array of saved job IDs
 */
function getSavedJobs() {
  const session = getCurrentSession();
  if (!session) return [];

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === session.userId);

  return user?.savedJobs || [];
}
