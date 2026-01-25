/**
 * HireSphere Quick Start Guide
 * Copy and paste this in browser console to test functionality
 */

// ============================================
// QUICK DEMO - Run in Browser Console
// ============================================

// 1. Create a test user
console.log('Creating test user...');
registerUser({
  name: 'John Developer',
  email: 'john@example.com',
  password: 'password123',
  location: 'San Francisco, USA',
  skills: 'JavaScript, React, Node.js',
  phone: '+1 234 567 8900',
  linkedin: 'linkedin.com/in/johndeveloper'
});

// 2. Login with test user
setTimeout(() => {
  console.log('Logging in...');
  loginUser('john@example.com', 'password123');
}, 2000);

// ============================================
// TESTING COMMANDS
// ============================================

// Check if user is authenticated
isAuthenticated(); // true or false

// Get current session
getCurrentSession(); // Returns user object

// Get all users
JSON.parse(localStorage.getItem('users'));

// Get saved jobs
getSavedJobs(); // Returns array of job IDs

// Clear all data
localStorage.clear();

// ============================================
// API TESTING
// ============================================

// Fetch jobs manually
fetchJobsFromAPI('Frontend Developer', 'USA').then(jobs => {
  console.log('Jobs fetched:', jobs);
});

// Get demo jobs
getLocalDemoJobs('JavaScript');

// ============================================
// DOM MANIPULATION TESTING
// ============================================

// Show notification
showSuccess('Test success message');
showError('Test error message');

// Show loading spinner
showLoadingSpinner('jobsGrid');
hideLoadingSpinner('jobsGrid');

// ============================================
// FILTER AND SORT TESTING
// ============================================

// Apply filters
applyFilters();

// Reset filters
resetFilters();

// Sort jobs
sortJobs();

// ============================================
// USER ACCOUNT TEST DATA
// ============================================

/*
Test Account 1:
Email: test1@example.com
Password: Test@123
Name: Alex Johnson
Location: New York, USA
Skills: JavaScript, Python, React

Test Account 2:
Email: test2@example.com
Password: Test@456
Name: Sarah Williams
Location: London, UK
Skills: Java, Spring Boot, Kubernetes
*/

// ============================================
// BROWSER STORAGE STRUCTURE
// ============================================

/*
Users stored in localStorage['users']:
[
  {
    id: "user_1234567890_abcd",
    name: "John Developer",
    email: "john@example.com",
    password: "base64_encoded_password",
    skills: ["JavaScript", "React", "Node.js"],
    location: "San Francisco, USA",
    phone: "+1 234 567 8900",
    linkedin: "linkedin.com/in/johndeveloper",
    createdAt: "2024-01-24T10:00:00Z",
    savedJobs: ["job_id_1", "job_id_2"]
  }
]

Current session stored in localStorage['currentSession']:
{
  userId: "user_1234567890_abcd",
  name: "John Developer",
  email: "john@example.com",
  skills: ["JavaScript", "React", "Node.js"],
  location: "San Francisco, USA",
  phone: "+1 234 567 8900",
  linkedin: "linkedin.com/in/johndeveloper",
  loginTime: "2024-01-24T12:00:00Z"
}
*/

// ============================================
// COMMON ISSUES & SOLUTIONS
// ============================================

/*
1. localStorage not working
   - Solution: Check if cookies/storage is enabled in browser
   - Use private browsing for testing

2. API returning no results
   - Solution: Check internet connection
   - Verify API key in api.js
   - Try with demo jobs

3. Modal not opening
   - Solution: Check console for JavaScript errors
   - Verify modal element exists in HTML

4. Search not working
   - Solution: Clear filters and try again
   - Check if user is logged in
   - Verify search input is not empty

5. Logout not working
   - Solution: Clear browser cache
   - Try in different browser
   - Check localStorage permissions
*/

// ============================================
// DEVELOPMENT TIPS
// ============================================

/*
1. Use browser DevTools
   - F12 to open developer tools
   - Go to Console tab to run JavaScript
   - Check Network tab for API calls
   - Use Elements tab to inspect HTML

2. Debug JavaScript
   - Add console.log() statements
   - Set breakpoints in DevTools
   - Use debugger keyword in code
   - Monitor localStorage in DevTools

3. Test Responsive Design
   - Use DevTools device toolbar (Ctrl+Shift+M)
   - Test on actual devices
   - Check all breakpoints: 480px, 768px, 1024px

4. Performance Testing
   - Check Network tab for slow requests
   - Monitor JavaScript execution time
   - Optimize images and assets
   - Use Lighthouse in DevTools

5. Accessibility Testing
   - Use keyboard navigation (Tab key)
   - Check color contrast ratios
   - Test with screen readers
   - Verify semantic HTML
*/

// ============================================
// CUSTOMIZATION GUIDE
// ============================================

/*
1. Change Colors
   - Open css/style.css
   - Modify :root CSS variables
   - Examples:
     --primary: #667eea;
     --secondary: #764ba2;
     --accent: #f093fb;

2. Change API Key
   - Open js/api.js
   - Update API_CONFIG.key with your RapidAPI key
   - Get key from: https://rapidapi.com/laimoon-laimoon/api/jsearch

3. Add More Countries
   - Edit COUNTRY_CODE_MAP in api.js
   - Add country name and code
   - Update country select in dashboard.html

4. Modify Job Card Layout
   - Edit createJobCard() function in app.js
   - Modify HTML template
   - Update styles in css/style.css

5. Add New Features
   - Create new function in appropriate module
   - Add event listeners in app.js
   - Update HTML if needed
   - Test thoroughly
*/

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

/*
While on Dashboard:
- Enter key: Submit search
- Escape key: Close modal/dropdown
- Tab key: Navigate through elements
- Ctrl+F: Browser find (search on page)
*/

// ============================================
// DATA EXPORT/IMPORT
// ============================================

// Export all data to JSON
function exportData() {
  const users = localStorage.getItem('users');
  const session = localStorage.getItem('currentSession');
  const data = { users, session };
  console.log(JSON.stringify(data, null, 2));
  // Copy from console and save to file
}

// Import data from JSON
function importData(jsonData) {
  const data = JSON.parse(jsonData);
  if (data.users) localStorage.setItem('users', data.users);
  if (data.session) localStorage.setItem('currentSession', data.session);
  console.log('Data imported successfully');
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Measure page load time
console.time('Page Load');
// Your code here
console.timeEnd('Page Load');

// Monitor API calls
const apiStart = performance.now();
fetchJobsFromAPI('Developer', 'USA').then(() => {
  const apiEnd = performance.now();
  console.log(`API call took ${apiEnd - apiStart}ms`);
});

// ============================================
// ADVANCED TESTING
// ============================================

// Test all auth functions
function testAuthFunctions() {
  console.log('Testing Auth Functions...');
  console.log('isValidEmail:', isValidEmail('test@example.com'));
  console.log('generateUniqueId:', generateUniqueId());
  console.log('isAuthenticated:', isAuthenticated());
  console.log('getCurrentSession:', getCurrentSession());
}

// Test all utility functions
function testUtilityFunctions() {
  console.log('Testing Utility Functions...');
  console.log('truncateText:', truncateText('This is a long text', 10));
  console.log('capitalize:', capitalize('hello'));
  console.log('formatNumber:', formatNumber(1234567));
  console.log('getInitials:', getInitials('Google Company'));
}

// ============================================
// END OF QUICK START GUIDE
// ============================================
