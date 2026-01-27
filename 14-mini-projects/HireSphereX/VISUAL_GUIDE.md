# HireSphere X - Visual Walkthrough

## 🎬 User Experience Flow

### 1️⃣ Landing Page (index.html)
```
┌──────────────────────────────────────────────────────┐
│                    HireSphere X                       │
│                                                      │
│    Find Your Dream Job Today                        │
│                                                      │
│    [ Explore Jobs ]  [ Create Free Account ]        │
│                                                      │
│    5000+ Jobs  │  500+ Companies  │  10K+ Placements│
│                                                      │
│    ✓ Smart Search  ✓ Secure  ✓ Fast Hiring         │
│                                                      │
└──────────────────────────────────────────────────────┘
        ↓                                    ↓
    [ Sign In ]                     [ Get Started ]
        ↓                                    ↓
```

### 2️⃣ Login Page (login.html)
```
┌──────────────────────────────────────────────────────┐
│                   Welcome Back                       │
│                                                      │
│  Email: [_____________________]                     │
│  Password: [_____________________]                  │
│                                                      │
│              [ Sign In ]                            │
│                                                      │
│  Don't have an account?                             │
│  [Create one now]                                   │
│                                                      │
│  [✨ Use demo credentials]                          │
│  (Pre-fills: aditya@gmail.com / aditya@2005)       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3️⃣ Dashboard - Main Page (dashboard.html)

#### Top Section:
```
┌──────────────────────────────────────────────────────┐
│ HireSphere X        Jobs    [👤 User ▼]             │
│                                │                     │
│                          ┌──────────────┐            │
│                          │ Logout       │            │
│                          └──────────────┘            │
└──────────────────────────────────────────────────────┘
```

#### Search Section:
```
┌──────────────────────────────────────────────────────┐
│ [Search by job title, skills, company...] [Search]  │
│                                                      │
│ [Job Type ▼]  [Location ▼]  [Reset]                │
│  - All Types    - All        ─────────              │
│  - Full-time    - San Francisco                     │
│  - Part-time    - New York                          │
│  - Remote       - Mumbai                            │
│  - Contract                                         │
│                                                      │
│ 45 results found                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Jobs Grid:
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ TC           │  │ FH           │  │ ECP         │ │
│  │              │  │              │  │             │ │
│  │ Senior Java  │  │ Full Stack   │  │ Next Job   │ │
│  │ Developer    │  │ JavaScript   │  │  ...       │ │
│  │              │  │              │  │             │ │
│  │ Tech Corp    │  │ Finance Hub  │  │ Company    │ │
│  │ San Francisco│  │ New York     │  │ Location   │ │
│  │ Today        │  │ 3 days ago   │  │ 1 week ago │ │
│  │              │  │              │  │             │ │
│  │ [Java][SB]   │  │ [JS][React]  │  │ [Skills]   │ │
│  │ +1 more      │  │ +2 more      │  │             │ │
│  │              │  │              │  │             │ │
│  │ $120K-150K   │  │ $100K-130K   │  │ $80K-110K  │ │
│  │ [🔖]         │  │ [🔖]         │  │ [🔖]       │ │
│  │              │  │              │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                      │
│         ┌──────────────────────────┐               │
│         │   Load More Jobs →        │               │
│         └──────────────────────────┘               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 4️⃣ Job Details Modal

When you click on a job card:

```
┌────────────────────────────────────────────────────┐
│ [X]                                                │
│                                                    │
│ TC   Senior Java Developer                        │
│      Tech Corp                                    │
│                                                    │
│ ┌──────────────────────────────────────────────┐ │
│ │ Job Type: FULL_TIME                          │ │
│ │ Location: San Francisco                      │ │
│ │ Salary: $120,000 - $150,000                  │ │
│ │ Posted: Today                                │ │
│ └──────────────────────────────────────────────┘ │
│                                                    │
│ About the job                                    │
│ ────────────────────────────────────────────────│ │
│ We're looking for an experienced Java developer  │
│ to join our growing team. You'll work on...     │
│ (Full job description)                          │
│                                                    │
│ Skills required                                  │
│ [Java] [Spring Boot] [AWS] [Docker]             │
│                                                    │
│ [💻 Apply Now]  [🔖 Save Job]                   │
│                                                    │
└────────────────────────────────────────────────────┘
```

### 5️⃣ Registration Page (register.html)

```
┌──────────────────────────────────────────────────────┐
│                   Create Account                     │
│          Join HireSphere X and find your job        │
│                                                      │
│  Full Name: [_____________________]               │
│  Email: [_____________________]                    │
│  Password: [_____________________]                 │
│  Confirm Password: [_____________________]         │
│                                                      │
│          [ Create Account ]                        │
│                                                      │
│  Already have an account?                          │
│  [Sign in here]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔄 User Interactions

### Scenario 1: New User Registration
```
1. User clicks "Get Started" on landing page
2. Fills registration form (Full Name, Email, Password)
3. Clicks "Create Account"
4. ✅ Account created, redirected to login
5. Logs in with new credentials
6. ✅ Dashboard loads with jobs
```

### Scenario 2: Existing User Login
```
1. User clicks "Sign In" on landing page
2. Enters Email & Password (or clicks "Use demo credentials")
3. Clicks "Sign In"
4. ✅ Backend validates credentials
5. ✅ JWT tokens issued (access + refresh)
6. ✅ Tokens stored in localStorage
7. ✅ Redirected to dashboard
8. Dashboard automatically loads available jobs
```

### Scenario 3: Job Search
```
1. On dashboard, user types "Java" in search box
2. Optional: Selects "Full-time" from Job Type
3. Optional: Selects "San Francisco" from Location
4. Clicks "Search" button
5. ✅ API call: GET /api/v1/jobs/search?keyword=java&...
6. ✅ Backend searches jobs table
7. ✅ Results filtered and returned (paginated)
8. ✅ Frontend displays matching jobs in grid
9. User sees "3 results found"
```

### Scenario 4: Save a Job
```
1. User hovers over job card → Sees bookmark icon
2. Clicks bookmark icon (✓ Highlighted = Save)
3. ✅ Job added to localStorage['savedJobs']
4. ✅ Shows success notification: "Job saved!"
5. Icon changes color (gray → blue)
6. Anytime: Can click again to unsave
```

### Scenario 5: View Job Details
```
1. User clicks on a job card
2. ✅ Modal appears with full job details
3. User reads:
   - Full description
   - Complete skills required
   - Salary range, location, job type
   - Posted date
4. Can click "Apply Now" (placeholder)
5. Can click "Save Job" or close modal
6. Clicking X or outside modal closes it
```

### Scenario 6: Logout
```
1. User clicks profile dropdown (top right)
2. Clicks "Logout"
3. ✅ Tokens cleared from localStorage
4. ✅ Shows "Logged out" notification
5. ✅ Redirected to login page
6. User must log in again to access dashboard
```

---

## 🎨 Color Palette & Typography

### Colors (LinkedIn-Inspired)
```
Primary Blue:    #0A66C2  (Call-to-action buttons, links)
Dark Blue:       #004182  (Hover states, emphasis)
Light BG:        #EEF3F8  (Page background)
White:           #FFFFFF  (Cards, modals)
Gray Text:       #666666  (Secondary text)
Success Green:   #28A745  (Success messages)
Error Red:       #DC3545  (Error messages)
```

### Typography
- **Logo**: 24px, Bold, Blue
- **Headings**: 28-32px, Bold, Dark Gray
- **Subheadings**: 18-20px, Semibold, Blue
- **Body Text**: 14-16px, Regular, Gray
- **Labels**: 12-14px, Medium, Dark Gray

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- 1 job card per row
- Full-width search bar
- Stacked filters
- Mobile-friendly modals

### Tablet (640px - 1024px)
- 2 job cards per row
- Responsive grid
- Horizontal filter layout
- Medium modals

### Desktop (> 1024px)
- 3 job cards per row
- Full search interface
- Horizontal filters
- Full-width modals

---

## 🔐 Authentication Visual

### Before Login:
```
┌─────────────────────────────────────────────────────┐
│ HireSphere X  |  Sign In    Get Started            │
└─────────────────────────────────────────────────────┘
        ↓
     Login Form
        ↓
```

### After Login:
```
┌─────────────────────────────────────────────────────┐
│ HireSphere X  |  Jobs    👤 aditya [▼]             │
└─────────────────────────────────────────────────────┘
                         │
                    ┌────────────┐
                    │  aditya@   │
                    │    ...     │
                    │ Logout     │
                    └────────────┘
```

---

## 📊 Data Flow Visualization

### Frontend to Backend:
```
User Action (Type query)
        │
        ▼
JavaScript Event Listener
        │
        ▼
Call fetchJobsFromAPI()
        │
        ├─ Get authorization header
        ├─ Build query parameters
        └─ Make fetch() request
        │
        ▼
Browser sends HTTP request with JWT
        │
        ▼
Spring Boot receives request
        │
        ├─ JwtAuthFilter validates token
        ├─ JobController processes request
        ├─ JobService searches database
        └─ Repository executes SQL query
        │
        ▼
Database returns results
        │
        ▼
Backend maps to JSON response
        │
        ▼
Browser receives response
        │
        ├─ Parse JSON
        ├─ Display jobs in grid
        └─ Show pagination
```

---

## 💾 Data Storage

### Frontend (localStorage)
```
accessToken: "eyJhbGc..."       (30 minutes)
refreshToken: "eyJhbGc..."      (7 days)
tokenType: "Bearer"
userEmail: "aditya@gmail.com"
savedJobs: [
  { id: 1, title: "Senior Java Dev", ... },
  { id: 3, title: "Full Stack Dev", ... }
]
```

### Backend (MySQL)
```
users table        → User credentials, roles
jobs table         → Job listings
companies table    → Company info
skills table       → Skill definitions
job_skills table   → Job-Skill relationships
saved_jobs table   → Bookmarked jobs (future)
job_applications   → Applications (future)
```

---

## 🔄 Request/Response Examples

### Login Request/Response
```
REQUEST:
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "aditya@gmail.com",
  "password": "aditya@2005"
}

RESPONSE (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### Job Search Request/Response
```
REQUEST:
GET /api/v1/jobs/search?keyword=java&location=SF&page=0&size=10
Authorization: Bearer eyJhbGc...

RESPONSE (200 OK):
{
  "content": [
    {
      "id": 1,
      "title": "Senior Java Developer",
      "company": { "id": 1, "name": "Tech Corp" },
      "location": "San Francisco",
      "employmentType": "FULL_TIME",
      "minSalary": 120000,
      "maxSalary": 150000,
      "currency": "USD",
      "description": "...",
      "skills": [
        { "id": 1, "name": "Java" },
        { "id": 4, "name": "Spring Boot" }
      ],
      "postedDate": "2024-12-15T10:30:00Z",
      "status": "ACTIVE"
    }
  ],
  "totalElements": 45,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```

---

## 🎯 Key Features Showcase

### ✅ Real-time Search
- Type in search box
- Results filter instantly (debounced for performance)
- Shows "X results found"

### ✅ Smart Filters
- Job Type dropdown
- Location dropdown
- Reset button to clear all

### ✅ Job Cards Display
- Company avatar (random color)
- Job title & company name
- Location with icon
- Posted date (e.g., "3 days ago")
- Salary range (formatted: $120K-$150K)
- Skills preview (first 3 + "+X more")
- Bookmark button (blue when saved)

### ✅ Modal Details
- Full company avatar
- Complete description
- All required skills
- Detailed metadata
- Apply & Save buttons

### ✅ User Profile
- Displays logged-in user email
- Dropdown menu with Logout
- Closes when clicking outside

---

**This visual walkthrough represents the complete user experience of HireSphere X!**

For technical details, see [ARCHITECTURE.md](./ARCHITECTURE.md)
