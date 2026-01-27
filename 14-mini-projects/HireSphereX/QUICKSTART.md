# HireSphere X - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Start MySQL Database
```bash
# Ensure MySQL is running
# Create database (if not exists)
mysql -u root -p
> CREATE DATABASE hirespherex;
> CREATE DATABASE hirespherex_dev;
> exit
```

### Step 2: Start Backend
```bash
cd HireSphereX/backend
mvn spring-boot:run
```
✅ Backend ready at: `http://localhost:8080`
📚 Swagger Docs: `http://localhost:8080/api/v1/swagger-ui.html`

### Step 3: Start Frontend
```bash
cd HireSphereX/frontend
# Option A: Use VS Code Live Server (install extension, then)
# Right-click index.html → "Open with Live Server"

# Option B: Use Python
python -m http.server 8000

# Option C: Use Node
npx http-server
```
✅ Frontend ready at: `http://localhost:5500` (or 8000/8080 depending on option)

### Step 4: Test the Application

#### Register New User
1. Navigate to `http://localhost:5500/register.html`
2. Fill in details:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: Test@123
3. Click "Create Account"
4. You're redirected to login

#### Login with Demo Account
1. Navigate to `http://localhost:5500/login.html`
2. Click "Use demo credentials" OR enter:
   - Email: `aditya@gmail.com`
   - Password: `aditya@2005`
3. Click "Sign in"
4. Dashboard loads with jobs!

#### Search & Filter Jobs
- **Search**: Type in search box (job title, skills, company)
- **Filter by Location**: Select from dropdown
- **Filter by Job Type**: Select from dropdown
- **Save Job**: Click bookmark icon
- **View Details**: Click job card

#### Apply for Job
- Click job card → "Apply Now" button
- (Backend integration for applications pending)

---

## 📋 API Endpoints Reference

### Auth Endpoints
```
POST   /api/v1/auth/register      (Public)
POST   /api/v1/auth/login         (Public)
POST   /api/v1/auth/refresh       (Requires Bearer token)
```

### Job Endpoints
```
GET    /api/v1/jobs               (Requires Bearer token)
GET    /api/v1/jobs/search        (Requires Bearer token)
```

### Headers Required
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 🔐 Login Credentials

### Pre-configured Test Account (Candidate)
- **Email**: aditya@gmail.com
- **Password**: aditya@2005

### Pre-configured Test Account (Recruiter)
- **Email**: recruiter@tech.com
- **Password**: recruiter@tech.com

---

## 🛠️ Troubleshooting

### Backend not starting?
```
Problem: Port 8080 already in use
Solution: Kill the process or change port in application.yml

Problem: MySQL connection error
Solution: Ensure MySQL is running and database exists
```

### Frontend not loading jobs?
```
Problem: CORS error in console
Solution: Ensure API_BASE_URL is http://localhost:8080 in js/auth.js

Problem: 401 Unauthorized
Solution: Log out, clear localStorage, log back in
```

### Can't register new user?
```
Problem: Email already exists
Solution: Use a different email address

Problem: Password validation failed
Solution: Ensure password meets requirements
```

---

## 📚 Project Files

```
Frontend Structure:
├── index.html          (Landing page)
├── login.html          (Login form)
├── register.html       (Registration form)
├── dashboard.html      (Main job search page)
├── js/
│   ├── utils.js        (Helper functions)
│   ├── auth.js         (Auth API calls)
│   ├── api.js          (Job API calls)
│   └── app.js          (Dashboard logic)

Backend Structure:
├── src/main/java/com/hirespherex/
│   ├── HireSphereXApplication.java
│   ├── config/
│   ├── controller/
│   ├── service/
│   ├── entity/
│   ├── repository/
│   └── security/
├── pom.xml
├── application.yml
└── Dockerfile
```

---

## 🎯 Next Steps

1. **Explore Job Search**
   - Login with demo credentials
   - Search for "Java" or "JavaScript"
   - Apply filters by location

2. **Create Custom Account**
   - Register with your email
   - Complete your profile
   - Save jobs for later

3. **Integrate with Backend**
   - Deploy to cloud (AWS, Azure, GCP)
   - Set up production database
   - Configure JWT secrets

4. **Customize**
   - Modify colors in dashboard.html (Tailwind classes)
   - Add more job filters in app.js
   - Extend entities in backend

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change JWT secret in application-prod.yml
- [ ] Set up production MySQL database
- [ ] Update API_BASE_URL in frontend to production URL
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Test all API endpoints
- [ ] Set up logging and monitoring
- [ ] Create admin user account

---

## 💡 Tips & Tricks

### Local Development
- Use Dev Tools (F12) to inspect API calls
- Check localStorage: F12 → Application → Local Storage
- Monitor network tab for API responses

### Testing
- Use Postman/Insomnia to test API endpoints
- Swagger UI at: `http://localhost:8080/api/v1/swagger-ui.html`
- Test with demo credentials first

### Performance
- Jobs are paginated (10 per page by default)
- Use search filters to narrow results
- Saved jobs stored in localStorage

---

## 📞 Support

For issues or questions:
1. Check the SETUP.md file for detailed documentation
2. Review error messages in browser console (F12)
3. Check backend logs in terminal
4. Visit Swagger UI to verify API responses

---

**Happy Job Hunting! 🎉**

Last Updated: December 2024
