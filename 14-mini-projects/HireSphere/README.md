# HireSphere - Online Job Portal

A modern, responsive job portal built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Find and apply for jobs from top companies worldwide using real-time job data from the JSearch API.

## 🎯 Features

### 1. **Landing Page**
- Modern hero section with call-to-action buttons
- Feature showcase highlighting key benefits
- Navigation bar with links to all pages
- Responsive design for all devices

### 2. **Authentication System**
- **Login Page**: Sign in with email and password
- **Register Page**: Create new account with:
  - Full name, email, and password
  - Skills (comma-separated)
  - Location and phone number
  - LinkedIn profile and other optional fields
- **Session Management**: Uses localStorage for user sessions
- **Authentication Guard**: Protected dashboard access

### 3. **Main Dashboard**
- **Advanced Search**: Search jobs by title, keywords, and skills
- **Smart Filters**:
  - Job Type (Full-time, Part-time, Remote, Contract)
  - Experience Level (Entry, Mid, Senior)
  - Location (15+ countries supported)
  - Salary Range ($0-60k, $60k-100k, $100k+)
- **Profile Section**: Shows logged-in user info
- **Responsive Grid**: Job cards adapt to all screen sizes

### 4. **Job Display & Management**
- **Job Cards**: Beautiful card layout with company info, location, salary, and more
- **Job Details Modal**: Click any job to view full details
- **Save Jobs**: Bookmark favorite jobs for later review
- **Direct Apply**: Apply directly through job links (external)
- **Loading States**: Loading spinner during API calls

### 5. **API Integration**
- **JSearch API** (RapidAPI): Real-time job data from thousands of companies
- **Fallback Demo Data**: Uses demo jobs when API is unavailable
- **Error Handling**: Graceful error handling with user feedback
- **Rate Limiting**: Respects API rate limits

### 6. **User Experience**
- **Notifications**: Success, error, and info notifications
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Smooth Animations**: CSS animations for visual appeal
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📁 Project Structure

```
HireSphere/
├── index.html              # Landing page
├── login.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main job search dashboard
│
├── css/
│   └── style.css           # Main stylesheet (900+ lines)
│
└── js/
    ├── api.js              # API integration & job fetching
    ├── auth.js             # Authentication & user management
    ├── utils.js            # Utility functions & helpers
    └── app.js              # Main application logic
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser
- Internet connection for API calls

### Installation

1. **Download the project**
   ```bash
   # Navigate to the HireSphere folder
   cd path/to/HireSphere
   ```

2. **Open in browser**
   - Open `index.html` in your web browser, or
   - Use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Test the application**
   - Visit the landing page
   - Create a new account
   - Search for jobs and apply

## 🔐 Authentication

### Default User Credentials (Demo)
The application stores users in browser's `localStorage`. Users can:
- Create new accounts on the register page
- Login with their credentials
- Data persists across browser sessions

### User Data Stored
```javascript
{
  id: "unique_user_id",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  skills: ["JavaScript", "React"],
  location: "New York, USA",
  phone: "+1 234 567 8900",
  linkedin: "linkedin.com/in/johndoe",
  savedJobs: ["job_id_1", "job_id_2"],
  createdAt: "2024-01-24T10:00:00Z"
}
```

## 🔍 Job Search & Filtering

### Search Capabilities
- **By Title**: Search "Frontend Developer", "React Engineer", etc.
- **By Skills**: Search specific tech skills like "JavaScript", "Python"
- **By Location**: Choose from 15+ countries
- **By Type**: Full-time, Part-time, Remote, Contract
- **By Level**: Entry, Mid-level, or Senior positions
- **By Salary**: Filter by salary ranges

### Search Algorithm
1. Fetches jobs from JSearch API
2. Filters by selected criteria
3. Displays results in responsive grid
4. Updates result count dynamically

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: 
  - Primary: `#667eea` (Blue)
  - Secondary: `#764ba2` (Purple)
  - Accent: `#f093fb` (Pink)
  - Success: `#48bb78` (Green)
  - Error: `#f56565` (Red)

### Animations & Transitions
- Smooth page transitions
- Button hover effects
- Card elevation on hover
- Loading spinner animation
- Modal slide-up animation
- Notification slide-in effects

### Responsive Breakpoints
- **Desktop**: Full layout with 3-column grid
- **Tablet**: 2-column grid, adjusted filters
- **Mobile**: 1-column grid, stacked layout

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| IE 11 | ⚠️ Partial |

## 🔧 Code Structure

### api.js - API Integration
```javascript
- fetchJobsFromAPI()      // Fetch jobs from JSearch
- getLocalDemoJobs()      // Get fallback demo data
- normalizeJobType()      // Normalize job types
- formatSalary()          // Format salary strings
- formatDate()            // Format date strings
```

### auth.js - Authentication
```javascript
- registerUser()          // Create new account
- loginUser()             // Sign in user
- logoutUser()            // Sign out user
- getCurrentSession()     // Get current user
- isAuthenticated()       // Check auth status
- updateUserProfile()     // Update user data
- saveJobForLater()       // Bookmark jobs
- getSavedJobs()          // Get saved jobs
```

### utils.js - Utilities
```javascript
- showSuccess()           // Show success notification
- showError()             // Show error notification
- showLoadingSpinner()    // Display loader
- debounce()              // Debounce function
- throttle()              // Throttle function
- truncateText()          // Truncate text
- generateRandomColor()   // Generate colors
- getInitials()           // Get company initials
- And 15+ more utilities
```

### app.js - Application Logic
```javascript
- initDashboard()         // Initialize dashboard
- searchJobs()            // Search jobs
- applyFilters()          // Apply filter criteria
- displayJobs()           // Display job cards
- openJobDetails()        // Show job details modal
- toggleSaveJob()         // Save/unsave job
- loadMore()              // Pagination
```

## 🔑 Key Functions

### Search Jobs
```javascript
// Called when user clicks search
async function searchJobs() {
  const jobTitle = "Frontend Developer";
  const location = "USA";
  
  const jobs = await fetchJobsFromAPI(jobTitle, location);
  // Display jobs in grid
}
```

### Register User
```javascript
function registerUser(userData) {
  // Validate input
  // Check if email exists
  // Create user object
  // Store in localStorage
  // Redirect to login
}
```

### Apply Filters
```javascript
function applyFilters() {
  // Get filter values
  // Filter jobs array
  // Update display
  // Update result count
}
```

## 🌐 API Configuration

### JSearch API (RapidAPI)
```javascript
const API_CONFIG = {
  baseUrl: 'https://jsearch.p.rapidapi.com/search',
  key: 'YOUR_API_KEY',
  host: 'jsearch.p.rapidapi.com'
};
```

### API Endpoint
```
GET /search?query={job_title}&country={country_code}&num_pages=1
```

### Response Example
```json
{
  "data": [
    {
      "job_id": "abc123",
      "job_title": "Frontend Developer",
      "employer_name": "Tech Corp",
      "job_city": "San Francisco",
      "job_country": "USA",
      "job_employment_type": "FULLTIME",
      "job_salary_currency": "$",
      "job_min_salary": 120000,
      "job_max_salary": 150000,
      "job_description": "...",
      "job_posted_at_datetime_utc": "2024-01-24T...",
      "job_apply_link": "https://..."
    }
  ]
}
```

## 🎓 Learning Resources

This project demonstrates:
- **HTML5**: Semantic markup, forms, modals
- **CSS3**: Grid, Flexbox, animations, gradients
- **Vanilla JavaScript**: 
  - DOM manipulation
  - Event listeners
  - Async/await
  - LocalStorage API
  - Fetch API
  - Regular expressions
  - Array methods (map, filter, find)

## 🐛 Troubleshooting

### Issue: "No jobs found"
- **Cause**: API rate limit exceeded or no internet
- **Solution**: Wait a few minutes or use demo jobs

### Issue: Login not working
- **Cause**: localStorage disabled in browser
- **Solution**: Enable localStorage or use private browsing

### Issue: Jobs not loading
- **Cause**: CORS issue or invalid API key
- **Solution**: Check API key and network connection

## 🚀 Future Enhancements

- [ ] Backend server with database
- [ ] User authentication with JWT
- [ ] Email notifications for job alerts
- [ ] Advanced search with saved searches
- [ ] Application tracking system
- [ ] Company profiles
- [ ] Resume upload and matching
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Real company logos

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a comprehensive job portal demonstration showcasing modern web development practices.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Test with demo data first
4. Check browser console for errors

## 📞 Contact & Resources

- **JSearch API**: https://rapidapi.com/laimoon-laimoon/api/jsearch
- **Font Awesome Icons**: https://fontawesome.com/
- **Modern CSS**: https://developer.mozilla.org/en-US/docs/Web/CSS

---

**Built with ❤️ using HTML, CSS, and Vanilla JavaScript**

Enjoy using HireSphere! 🌍
