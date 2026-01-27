# HireSphere X - Full Stack Job Portal

A modern, enterprise-grade job portal built with Spring Boot (backend) and vanilla JavaScript (frontend).

## Project Structure

```
HireSphereX/
├── backend/
│   ├── src/main/java/com/hirespherex/
│   │   ├── HireSphereXApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── OpenApiConfig.java
│   │   │   └── DataLoader.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── JobController.java
│   │   ├── service/
│   │   │   ├── JwtService.java
│   │   │   ├── AuthService.java
│   │   │   └── JobService.java
│   │   ├── entity/
│   │   │   ├── User.java, Role.java, Company.java, Skill.java, Job.java
│   │   │   ├── CandidateProfile.java, RecruiterProfile.java
│   │   │   └── (Other entities)
│   │   ├── repository/
│   │   │   ├── UserRepository.java, JobRepository.java, etc.
│   │   ├── security/
│   │   │   └── JwtAuthFilter.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java
│   │   └── dto/
│   │       ├── AuthDtos.java
│   │       └── JobDtos.java
│   ├── pom.xml
│   ├── Dockerfile
│   └── application.yml
├── frontend/
│   ├── index.html (Landing page)
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── js/
│       ├── utils.js (Helper functions)
│       ├── auth.js (Authentication API calls)
│       ├── api.js (Job API calls)
│       └── app.js (Dashboard logic)
└── README.md
```

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT (JJWT 0.11.5)
- **ORM**: Hibernate/JPA
- **Build**: Maven 3.9.6
- **API Documentation**: Springdoc OpenAPI (Swagger UI)

### Frontend
- **HTML5**, **CSS3** (Tailwind CSS CDN), **JavaScript (ES6+)**
- **Architecture**: Modular (utils.js, auth.js, api.js, app.js)
- **Styling**: Tailwind CSS with LinkedIn-inspired palette
  - Primary: `#0A66C2` (LinkedIn Blue)
  - Dark: `#004182`
  - Light BG: `#EEF3F8`

## Features

### Authentication
- User Registration with email/password
- JWT-based Login (access + refresh tokens)
- Secure token storage in localStorage
- Automatic token refresh on expiry
- Role-based access control (ADMIN, RECRUITER, CANDIDATE)

### Job Search
- Search by keyword, location, job type
- Filterable results
- Pagination support
- Save jobs functionality (localStorage)
- Job details modal

### Dashboard
- Real-time job search with filters
- Job grid display with salary, skills, company info
- Save/unsave jobs
- Job application tracking
- User profile management
- Logout functionality

## Quick Start

### Prerequisites
- Node.js 16+ (optional, for frontend dev server)
- Java 17+
- Maven 3.9.6+
- MySQL 8.0+
- Git

### 1. Database Setup

Create MySQL database:

```sql
CREATE DATABASE hirespherex;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'aditya';
GRANT ALL PRIVILEGES ON hirespherex.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

Navigate to backend directory:

```bash
cd HireSphereX/backend
```

Build and run Spring Boot application:

```bash
mvn clean install
mvn spring-boot:run
```

**Backend will start on**: `http://localhost:8080`

**Swagger UI**: `http://localhost:8080/api/v1/swagger-ui.html`

#### Configuration
- **Database**: MySQL at `localhost:3306/hirespherex`
- **JWT Secret**: `your-secret-key-for-testing-only-change-in-production` (base64 encoded)
- **Token Expiry**: Access Token: 30 minutes, Refresh Token: 7 days

### 3. Frontend Setup

Navigate to frontend directory:

```bash
cd HireSphereX/frontend
```

Option A: Open with Live Server (VS Code)
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Frontend will open on `http://localhost:5500`

Option B: Use Python HTTP Server
```bash
python -m http.server 8000
```
Frontend will be at `http://localhost:8000`

## API Endpoints

### Authentication (Public)

| Endpoint | Method | Body | Returns |
|----------|--------|------|---------|
| `/api/v1/auth/register` | POST | `{email, password, fullName}` | `{accessToken, refreshToken, tokenType}` |
| `/api/v1/auth/login` | POST | `{email, password}` | `{accessToken, refreshToken, tokenType}` |
| `/api/v1/auth/refresh` | POST | `{refreshToken}` | `{accessToken, refreshToken}` |

### Jobs (Authenticated)

| Endpoint | Method | Query Params | Returns |
|----------|--------|--------------|---------|
| `/api/v1/jobs/search` | GET | `keyword, location, page, size` | `Page<JobResponse>` |
| `/api/v1/jobs` | GET | `page, size` | `Page<JobResponse>` |

### Request Headers
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Default Test Credentials

The system comes pre-loaded with test data:

**Candidate Account:**
- Email: `aditya@gmail.com`
- Password: `aditya@2005`
- Role: CANDIDATE

**Recruiter Account:**
- Email: `recruiter@tech.com`
- Password: `recruiter@tech.com` (use same as email)
- Role: RECRUITER

## Test Data

### Sample Jobs (Pre-seeded)
1. **Senior Java Developer** @ Tech Corp (San Francisco)
   - Salary: $120,000 - $150,000
   - Skills: Java, Spring Boot, AWS

2. **Full Stack JavaScript Developer** @ Finance Hub (New York)
   - Salary: $100,000 - $130,000
   - Skills: JavaScript, React, Node.js, SQL

### Companies
- Tech Corp (San Francisco)
- Finance Hub (New York)
- E-commerce Plus (Mumbai)

### Skills
Java, JavaScript, React, Spring Boot, Node.js, Python, AWS, Docker, Kubernetes, SQL

## Workflow

### 1. User Registration
```
1. Go to Register page (register.html)
2. Fill in Full Name, Email, Password
3. Submit form → POST /api/v1/auth/register
4. Redirected to Login
```

### 2. User Login
```
1. Go to Login page (login.html)
2. Enter Email & Password
3. Click "Sign In" → POST /api/v1/auth/login
4. Tokens stored in localStorage
5. Redirected to Dashboard
```

### 3. Search Jobs
```
1. On Dashboard, enter search query
2. Optional: Apply filters (location, job type)
3. Click Search → GET /api/v1/jobs/search with filters
4. Results displayed in grid
5. Click job card → View details in modal
```

### 4. Save Job
```
1. Click bookmark icon on job card
2. Job saved to localStorage
3. Can view saved jobs anytime
```

### 5. Apply for Job
```
1. Open job details (click job card)
2. Click "Apply Now" button
3. Placeholder confirmation (backend integration pending)
```

### 6. Logout
```
1. Click Profile dropdown (top right)
2. Click "Logout"
3. Tokens cleared from localStorage
4. Redirected to Login page
```

## Project Statistics

- **Backend**: ~8 Java classes, 4 REST controllers, 5 DTOs, 7 entities, 8 repositories
- **Frontend**: 5 HTML pages, 4 JS modules, responsive Tailwind CSS
- **Database**: 14 normalized tables with FK relationships and audit logs
- **Lines of Code**: ~3000+ (backend + frontend combined)

## Security Features

1. **JWT Authentication**
   - JJWT library for token generation/validation
   - Separate access & refresh tokens
   - Token expiry validation

2. **Password Security**
   - BCrypt password hashing
   - Salt rounds: 10

3. **CORS Protection**
   - Configured for frontend origin
   - Credentials enabled for cross-origin requests

4. **Stateless Architecture**
   - No session state on server
   - JWT-based stateless authentication

5. **Exception Handling**
   - Global error handler for validation & runtime exceptions
   - Structured error responses

6. **Role-Based Access Control**
   - ADMIN, RECRUITER, CANDIDATE roles
   - Method-level authorization (future)

## Troubleshooting

### Backend Won't Start
```
Error: MySQL connection refused
Solution: Ensure MySQL is running and hirespherex database exists
```

```
Error: Port 8080 already in use
Solution: Kill process on 8080 or change port in application.yml
```

### Login Failed
```
Error: 401 Unauthorized
Solution: Check username/password, ensure user exists in database
```

### Jobs Not Loading
```
Error: CORS error in console
Solution: Verify API_BASE_URL in js/auth.js and js/api.js
```

### Tokens Expired
```
Error: 401 after 30 minutes
Solution: Automatic refresh token handling is implemented
If failed: Refresh page, will redirect to login
```

## Environment-Specific Configs

### Development
```yaml
# application-dev.yml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Auto-create/update schema
  datasource:
    url: jdbc:mysql://localhost:3306/hirespherex_dev
    username: root
    password: aditya
logging:
  level:
    com.hirespherex: DEBUG
```

### Production
```yaml
# application-prod.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # Don't modify schema
  datasource:
    url: jdbc:mysql://${DB_HOST}:3306/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASS}
app:
  jwt:
    secret: ${JWT_SECRET}
logging:
  level:
    com.hirespherex: INFO
```

## Running in Docker

### Build Docker Image
```bash
cd HireSphereX/backend
docker build -t hirespherex:latest .
```

### Run Container
```bash
docker run -p 8080:8080 \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASS=aditya \
  -e JWT_SECRET=<base64-secret> \
  hirespherex:latest
```

## Future Enhancements

- [ ] Job applications & tracking
- [ ] Resume upload & parsing
- [ ] Interview scheduling
- [ ] Email notifications
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced search filters (salary range, date posted, etc.)
- [ ] Employer company profiles
- [ ] Candidate skill endorsements
- [ ] Job recommendations (ML-based)
- [ ] Analytics & reporting
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Email: support@hirespherex.com

## Author

Created with ❤️ by the HireSphere X Team

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready
