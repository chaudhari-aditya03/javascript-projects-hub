# HireSphere X - Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (Browser)                      │
│                    (Vanilla JS + Tailwind CSS)                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌────────────┐  ┌─────────────┐                │
│  │  index.html │  │ login.html │  │register.html│                │
│  └──────┬──────┘  └─────┬──────┘  └──────┬──────┘                │
│         │                │                 │                     │
│         └────────────────┴─────────────────┘                     │
│                        │                                         │
│                        ▼                                         │
│  ┌──────────────────────────────────────┐                        │
│  │       dashboard.html (Main Page)     │                        │
│  │  ┌────────────────────────────────┐  │                        │
│  │  │  Search Bar + Filters           │  │                       │
│  │  │  Job Grid (Responsive)          │  │                       │
│  │  │  Job Details Modal              │  │                       │
│  │  │  User Profile Dropdown          │  │                       │
│  │  └────────────────────────────────┘  │                        │
│  └────────────────┬─────────────────────┘                        │
│                   │                                              │
│     ┌─────────────┴──────────────┐                               │
│     │                            │                               │
│     ▼                            ▼                               │
│ ┌─────────┐  ┌──────┐  ┌────┐  ┌─────┐                           │
│ │utils.js │  │auth.js│  │api.js│ │app.js│                        │
│ │─────────│  │──────│  │────│  │─────│                           │   
│ │Helpers  │  │Auth  │  │API │  │Logic│                           │
│ │Notify   │  │Login │  │Jobs│  │Init │                           │
│ │Spinner  │  │Token │  │Fetch│ │Event│                           │
│ └────┬────┘  └──┬───┘  └──┬─┘  └──┬──┘                       │
│      │          │         │       │                           │
│      └──────────┴─────────┴───────┘                           │
│                 │                                             │
│         HTTP/CORS + JWT Bearer Token                         │
│                 │                                             │
└─────────────────┼──────────────────────────────────────────────┘
                  │
                  │ http://localhost:8080/api/v1
                  │
┌─────────────────▼──────────────────────────────────────────────┐
│                  Spring Boot Backend (Port 8080)               │
│                  (Java 17 + Spring Security 6.2)               │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │               Request Pipeline (Left to Right)           │ │
│  │                                                          │ │
│  │  Request → JwtAuthFilter → SecurityContext → Controller │ │
│  │    │                          │                          │ │
│  │    └──────────────────────────┘                          │ │
│  │           (Token Validation & Authority Population)     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Controllers                           │ │
│  │  ┌──────────────────┐      ┌──────────────────────┐     │ │
│  │  │ AuthController   │      │   JobController      │     │ │
│  │  │ ─────────────────│      │ ──────────────────────│     │ │
│  │  │ POST /register   │      │ GET /jobs            │     │ │
│  │  │ POST /login      │      │ GET /jobs/search     │     │ │
│  │  │ POST /refresh    │      │ POST /jobs (future)  │     │ │
│  │  └────────┬─────────┘      └──────────┬───────────┘     │ │
│  │           │                           │                 │ │
│  └───────────┼───────────────────────────┼─────────────────┘ │
│              │                           │                   │
│  ┌───────────▼───────────────────────────▼─────────────────┐ │
│  │                   Services Layer                        │ │
│  │  ┌──────────────────────┐    ┌──────────────────────┐  │ │
│  │  │  AuthService(Impl)   │    │  JobService(Impl)    │  │ │
│  │  │ ──────────────────────│    │ ──────────────────────│  │ │
│  │  │ + register()         │    │ + searchJobs()       │  │ │
│  │  │ + login()            │    │ + getAllJobs()       │  │ │
│  │  │ + refresh()          │    │ + mapToResponse()    │  │ │
│  │  │ + validateToken()    │    │ + formatDate()       │  │ │
│  │  └────────┬─────────────┘    └──────────┬───────────┘  │ │
│  │           │                             │               │ │
│  │  ┌────────▼────────────────────────────▼─────────────┐  │ │
│  │  │           JwtService (Utility)                   │  │ │
│  │  │ ─────────────────────────────────────────────────│  │ │
│  │  │ + generateAccessToken()                         │  │ │
│  │  │ + generateRefreshToken()                        │  │ │
│  │  │ + parseToken()                                  │  │ │
│  │  │ + extractClaims()                               │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Repository Layer (Data Access)         │ │
│  │  ┌─────────────────────────────────────────────────┐│ │
│  │  │  UserRepository (extends JpaRepository)         ││ │
│  │  │  RoleRepository                                 ││ │
│  │  │  JobRepository (Custom @Query methods)          ││ │
│  │  │  ├─ searchByKeyword()                           ││ │
│  │  │  ├─ searchByLocation()                          ││ │
│  │  │  └─ searchByKeywordAndLocation()                ││ │
│  │  │  CompanyRepository                              ││ │
│  │  │  SkillRepository                                ││ │
│  │  │  CandidateProfileRepository                     ││ │
│  │  │  RecruiterProfileRepository                     ││ │
│  │  └─────────────────────────────────────────────────┘│ │
│  └──────────────┬───────────────────────────────────────┘ │
│                 │                                         │
└─────────────────┼─────────────────────────────────────────┘
                  │
                  │ JDBC Connection Pool (HikariCP)
                  │
┌─────────────────▼──────────────────────────────────────────┐
│              MySQL 8.0 Database                             │
│         (hirespherex schema)                                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Core Tables:                                              │
│  ┌─────────────┬─────────────┬─────────────────────────┐   │
│  │ users       │ roles       │ user_roles (Junction)  │   │
│  │ ────────────│─────────────│─────────────────────────│   │
│  │ id          │ id          │ user_id (FK)           │   │
│  │ email (UQ)  │ name        │ role_id (FK)           │   │
│  │ password    │             │                       │   │
│  │ enabled     │             │ (Composite PK)        │   │
│  │ created_at  │             │                       │   │
│  │ updated_at  │             │                       │   │
│  └─────────────┴─────────────┴─────────────────────────┘   │
│                                                             │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ companies    │ skills       │ job_skills (Junction)│    │
│  │──────────────│──────────────│──────────────────────│    │
│  │ id           │ id           │ job_id (FK)         │    │
│  │ name         │ name (UQ)    │ skill_id (FK)       │    │
│  │ location     │              │                    │    │
│  │ industry     │              │ (Composite PK)     │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ jobs                                               │    │
│  │──────────────────────────────────────────────────── │    │
│  │ id | title | description | location | job_type   │    │
│  │ min_salary | max_salary | currency | recruiter_id│    │
│  │ company_id | status | soft_deleted | created_at  │    │
│  │ updated_at | posted_date                          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Additional Tables:                                        │
│  ├─ candidate_profiles                                     │
│  ├─ recruiter_profiles                                     │
│  ├─ job_applications                                       │
│  ├─ saved_jobs                                             │
│  ├─ interviews                                             │
│  ├─ notifications                                          │
│  └─ audit_logs                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### 1. Registration Flow
```
┌──────────────────────────────────────────────────────────────┐
│ REGISTRATION FLOW                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Frontend (register.html)                                 │
│     └─► User fills: Full Name, Email, Password              │
│         └─► Calls: registerUser(fullName, email, password) │
│                                                              │
│  2. API Call: POST /api/v1/auth/register                   │
│     ├─ Body: { fullName, email, password }                │
│     └─ Headers: Content-Type: application/json            │
│                                                              │
│  3. Backend Processing                                       │
│     ├─ AuthController.register()                           │
│     │  └─ AuthService.register()                           │
│     │     ├─ Check if email exists                         │
│     │     ├─ Hash password with BCrypt                     │
│     │     ├─ Create User entity                            │
│     │     ├─ Assign CANDIDATE role                         │
│     │     └─ Save to database                              │
│     │                                                        │
│     └─ Response: 201 Created                                │
│        └─ (User created, redirect to login)                │
│                                                              │
│  4. Frontend: Redirect to login.html                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2. Login Flow
```
┌──────────────────────────────────────────────────────────────┐
│ LOGIN FLOW                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Frontend (login.html)                                    │
│     └─► User fills: Email, Password                         │
│         └─► Calls: loginUser(email, password)             │
│                                                              │
│  2. API Call: POST /api/v1/auth/login                      │
│     ├─ Body: { email, password }                           │
│     └─ Headers: Content-Type: application/json            │
│                                                              │
│  3. Backend Processing                                       │
│     ├─ AuthController.login()                              │
│     │  └─ AuthService.login()                              │
│     │     ├─ Find user by email                            │
│     │     ├─ Verify password hash                          │
│     │     ├─ Load user authorities (roles)                 │
│     │     ├─ Generate Access Token (30 min)               │
│     │     ├─ Generate Refresh Token (7 days)              │
│     │     └─ Return TokenResponse                          │
│     │                                                        │
│     └─ Response: 200 OK                                     │
│        └─ { accessToken, refreshToken, tokenType }        │
│                                                              │
│  4. Frontend: Store Tokens & Redirect                       │
│     ├─ localStorage.setItem('accessToken', token)          │
│     ├─ localStorage.setItem('refreshToken', token)         │
│     ├─ localStorage.setItem('tokenType', 'Bearer')         │
│     └─ Redirect to dashboard.html                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3. Job Search Flow
```
┌──────────────────────────────────────────────────────────────┐
│ JOB SEARCH FLOW                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Frontend (dashboard.html)                                │
│     └─► User enters search query & filters                  │
│         └─► Calls: fetchJobsFromAPI(filters)              │
│                                                              │
│  2. API Call: GET /api/v1/jobs/search?keyword=...&...      │
│     ├─ Query Params: keyword, location, page, size         │
│     ├─ Headers: Authorization: Bearer <accessToken>        │
│     └─ Headers: Content-Type: application/json            │
│                                                              │
│  3. Backend Processing                                       │
│     ├─ JwtAuthFilter                                        │
│     │  ├─ Extract token from Authorization header          │
│     │  ├─ Parse JWT                                        │
│     │  ├─ Load user authorities                            │
│     │  └─ Populate SecurityContext                         │
│     │                                                        │
│     ├─ JobController.search()                              │
│     │  └─ JobService.searchJobs()                          │
│     │     ├─ Call JobRepository custom query               │
│     │     │  ├─ Filter by keyword                          │
│     │     │  ├─ Filter by location                         │
│     │     │  ├─ Filter by status = ACTIVE                  │
│     │     │  ├─ Filter by softDeleted = false              │
│     │     │  └─ Apply pagination                           │
│     │     │                                                  │
│     │     ├─ Map Job entities to JobResponse DTOs         │
│     │     │  ├─ Format salary range                        │
│     │     │  ├─ Format posted date (relative)              │
│     │     │  ├─ Include skills array                       │
│     │     │  └─ Include company info                       │
│     │     │                                                  │
│     │     └─ Return Page<JobResponse>                      │
│     │                                                        │
│     └─ Response: 200 OK                                     │
│        └─ {                                                 │
│            content: [                                       │
│              { id, title, company, location, salary, ... }│
│            ],                                              │
│            totalElements, totalPages, number, size         │
│          }                                                  │
│                                                              │
│  4. Frontend: Display Results                               │
│     ├─ Normalize API response                              │
│     ├─ Render job cards in grid                            │
│     ├─ Handle pagination                                   │
│     └─ Allow save/apply actions                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## JWT Token Structure

```
┌────────────────────────────────────────────────────────────┐
│ JWT Token (Encoded)                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZGl0eW@gmail... │
│                                                            │
└────────────────────────────────────────────────────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
    HEADER            PAYLOAD              SIGNATURE
    ──────            ───────              ─────────
    
┌─────────────────────┬──────────────────────┬──────────────┐
│ Header (JSON)       │ Payload (JSON)       │ Signature    │
│ ────────────────    │ ──────────────────   │ ────────────│
│ {                   │ {                    │ HMACSHA256( │
│   "alg":            │   "sub":             │   Base64Url(│
│   "HS256",          │   "aditya@gmail...", │   header)   │
│   "typ": "JWT"      │   "exp": 1734567..., │     +       │
│ }                   │   "iat": 1734550..., │   "."+      │
│                     │   "roles":           │   Base64Url(│
│                     │   ["CANDIDATE"]      │   payload), │
│                     │ }                    │   secret    │
│                     │                      │ )           │
└─────────────────────┴──────────────────────┴──────────────┘

│
├─ sub: Email (Subject - User ID)
├─ exp: Expiration time (Unix timestamp)
├─ iat: Issued at time
└─ roles: User authorities/roles
```

---

## Security Flow

```
┌────────────────────────────────────────────────────────────────┐
│ SECURITY & AUTHENTICATION FLOW                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Frontend → Backend: HTTP Request with Bearer Token        │
│     ──────────────────────────────────────────────────────    │
│     GET /api/v1/jobs                                          │
│     Authorization: Bearer eyJhbGc...                          │
│                                                                │
│  2. Backend: Spring Security Filter Chain                     │
│     ──────────────────────────────────────────────────────    │
│     ┌─────────────────────────────────────────────────────┐  │
│     │ SecurityConfig (DelegatingFilterProxy)              │  │
│     │ ┌───────────────────────────────────────────────┐   │  │
│     │ │ (1) JwtAuthFilter (Custom)                   │   │  │
│     │ │     ├─ Extract token from header             │   │  │
│     │ │     ├─ Check if request is to permitted      │   │  │
│     │ │     │  paths (/auth/*, /swagger-ui/*)       │   │  │
│     │ │     ├─ If permit-all path → Allow request    │   │  │
│     │ │     ├─ Else validate token:                  │   │  │
│     │ │     │  ├─ Parse JWT using secret             │   │  │
│     │ │     │  ├─ Check expiration                   │   │  │
│     │ │     │  ├─ Extract email & roles              │   │  │
│     │ │     │  └─ Populate SecurityContext           │   │  │
│     │ │     └─ Continue filter chain                 │   │  │
│     │ │                                              │   │  │
│     │ │ (2) AuthenticationFilter                     │   │  │
│     │ │     └─ Check if SecurityContext is populated │   │  │
│     │ │        (already done by JwtAuthFilter)       │   │  │
│     │ │                                              │   │  │
│     │ │ (3) AuthorizationFilter                      │   │  │
│     │ │     ├─ Check @PreAuthorize annotations       │   │  │
│     │ │     ├─ Verify user has required roles        │   │  │
│     │ │     └─ Allow/Deny request                    │   │  │
│     │ │                                              │   │  │
│     │ │ (4) Request Handler                          │   │  │
│     │ │     └─ Route to appropriate controller       │   │  │
│     │ └───────────────────────────────────────────────┘   │  │
│     └─────────────────────────────────────────────────────┘  │
│                                                                │
│  3. Response Handling                                         │
│     ──────────────────────────────────────────────────────    │
│     ✅ If valid token & authorized:                          │
│        └─► Process request → Return 200 with data           │
│                                                                │
│     ❌ If invalid/expired token:                             │
│        └─► Return 401 Unauthorized                          │
│                                                                │
│     ❌ If insufficient permissions:                          │
│        └─► Return 403 Forbidden                             │
│                                                                │
│     ❌ If exception occurs:                                  │
│        └─► GlobalExceptionHandler.handle()                  │
│            └─► Return structured error response             │
│                                                                │
│  4. Token Refresh Flow (When Access Token Expires)           │
│     ──────────────────────────────────────────────────────    │
│     Frontend detects 401 error                               │
│        └─► POST /api/v1/auth/refresh                        │
│            ├─ Body: { refreshToken }                        │
│            ├─ Headers: Authorization: Bearer <oldToken>     │
│            └─► Response: { newAccessToken, ... }            │
│                └─► Store new token                          │
│                └─► Retry original request                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Database Relationships

```
┌────────────────────────────────────────────────────────────┐
│ Entity Relationship Diagram                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│                      USERS                                │
│                        │                                  │
│          ┌─────────────┼─────────────┐                    │
│          │             │             │                    │
│          ▼ (M:N)       ▼ (1:1)       ▼ (1:1)             │
│        ROLES    CANDIDATE_PROFILE RECRUITER_PROFILE      │
│                                                            │
│  (via user_roles                                          │
│   junction table)                                         │
│                                                            │
│                                                            │
│  RECRUITER_PROFILE ─────────┐                            │
│           │                 │                            │
│           │ (1:N)           │ (N:1)                      │
│           ▼                 ▼                            │
│           JOBS ────────── COMPANIES                      │
│           │                                              │
│           │ (M:N)                                        │
│           ├───────────────── SKILLS                      │
│           │                                              │
│           │ (via job_skills junction table)              │
│           │                                              │
│           │ (1:N) ┌──────────────────────┐               │
│           ├──────►│ JOB_APPLICATIONS     │               │
│           │       │ (Track applications) │               │
│           │       └──────────────────────┘               │
│           │                                              │
│           │ (1:N) ┌──────────────────────┐               │
│           └──────►│ SAVED_JOBS           │               │
│                   │ (Bookmarks)          │               │
│                   └──────────────────────┘               │
│                                                            │
│  INTERVIEWS ────────────────┐                            │
│           │                 │                            │
│           │ (N:1)           │ (N:1)                      │
│           ▼                 ▼                            │
│    JOB_APPLICATIONS    USERS                            │
│                                                            │
│  NOTIFICATIONS                                           │
│           │                                              │
│           │ (N:1)                                        │
│           ▼                                              │
│         USERS                                            │
│                                                            │
│  AUDIT_LOGS                                              │
│           │                                              │
│           │ (Logs all user actions)                     │
│           └─► (No direct FK, audit purpose)              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Design Patterns Used

### 1. MVC Pattern
- **Model**: Entity classes (User, Job, Company, etc.)
- **View**: HTML templates + JavaScript UI
- **Controller**: Spring REST controllers

### 2. Service Layer Pattern
- Separation of business logic from controllers
- `*Service` interfaces + `*ServiceImpl` implementations
- Promotes testability and reusability

### 3. Repository Pattern
- Data access abstraction using Spring Data JPA
- Custom queries with @Query annotations
- Automatic CRUD operations

### 4. DTO Pattern
- Transfer objects for API requests/responses
- Separate internal entities from API contracts
- Type safety and explicit API surface

### 5. Filter Pattern
- `JwtAuthFilter` for request preprocessing
- Security context population
- Cross-cutting concerns

### 6. Singleton Pattern
- Spring Beans (default scope)
- Service classes instantiated once
- Shared across requests

### 7. Builder Pattern
- Lombok `@Builder` annotation
- Fluent object construction
- Test data creation

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ PRODUCTION DEPLOYMENT (Cloud Example)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                Internet/Users                          │ │
│  └────────────────────┬─────────────────────────────────┘ │ │
│                       │ HTTPS                             │ │
│  ┌────────────────────▼─────────────────────────────────┐ │ │
│  │            CDN (CloudFlare/CloudFront)               │ │ │
│  │    (Static files, caching, DDoS protection)          │ │ │
│  └────────────────────┬─────────────────────────────────┘ │ │
│                       │                                   │ │
│  ┌────────────────────▼─────────────────────────────────┐ │ │
│  │            Load Balancer (ALB/NLB)                   │ │ │
│  │    (Distribute traffic, SSL termination)              │ │ │
│  └────────────────────┬─────────────────────────────────┘ │ │
│                       │                                   │ │
│     ┌─────────────────┼─────────────────┐                │ │
│     │                 │                 │                │ │
│  ┌──▼────┐        ┌──▼────┐        ┌──▼────┐           │ │
│  │ Fargate│        │ Fargate│       │ Fargate│           │ │
│  │Task 1  │        │Task 2  │       │Task 3  │           │ │
│  │ (Java) │        │ (Java) │       │ (Java) │           │ │
│  └────┬───┘        └───┬────┘       └───┬────┘           │ │
│       │                │                │                │ │
│       └────────────────┼────────────────┘                │ │
│                        │                                 │ │
│  ┌─────────────────────▼──────────────────────────────┐ │ │
│  │          RDS Multi-AZ MySQL Database               │ │ │
│  │   (Master → Standby with automatic failover)       │ │ │
│  └──────────────────────────────────────────────────┘ │ │
│                                                        │ │
│  ┌──────────────────────────────────────────────────┐ │ │
│  │         ElastiCache (Redis for Sessions)          │ │ │
│  │         (Optional: Future enhancement)            │ │ │
│  └──────────────────────────────────────────────────┘ │ │
│                                                        │ │
│  ┌──────────────────────────────────────────────────┐ │ │
│  │         CloudWatch (Monitoring & Logging)        │ │ │
│  │         (Metrics, Alarms, Dashboards)            │ │ │
│  └──────────────────────────────────────────────────┘ │ │
│                                                        │ │
└────────────────────────────────────────────────────────┘ │
```

---

## Configuration Profiles

```
┌──────────────────────────────────────────────────────────┐
│ Spring Boot Profiles                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ DEFAULT (application.yml)                                │
│ ├─ Database: localhost:3306/hirespherex                 │
│ ├─ Logging: INFO level                                  │
│ ├─ JPA: update (dev-friendly)                           │
│ └─ JWT: embedded secret key                             │
│                                                          │
│ DEV (application-dev.yml)                                │
│ ├─ Database: localhost:3306/hirespherex_dev             │
│ ├─ Logging: DEBUG level                                 │
│ ├─ JPA: update (auto-create/update schema)              │
│ ├─ H2 console: Enabled for testing                      │
│ └─ CORS: Localhost origins only                         │
│                                                          │
│ PROD (application-prod.yml)                              │
│ ├─ Database: RDS endpoint (env variables)                │
│ ├─ Logging: ERROR/WARN level                            │
│ ├─ JPA: validate (schema pre-created)                   │
│ ├─ JWT: From environment (${JWT_SECRET})               │
│ ├─ CORS: Production domain only                         │
│ ├─ Security: Enhanced settings                          │
│ └─ Metrics: Actuator endpoints enabled                  │
│                                                          │
│ Usage:                                                  │
│ $ java -jar app.jar --spring.profiles.active=prod       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

```
┌──────────────────────────────────────────────────────────┐
│ OPTIMIZATION STRATEGIES                                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Database:                                               │
│ ├─ Indexed columns: email, status, softDeleted         │
│ ├─ Pagination: 10 items per page (configurable)        │
│ ├─ Query optimization: Specific selects, no N+1        │
│ └─ Connection pooling: HikariCP with 10 connections    │
│                                                          │
│ Application:                                            │
│ ├─ Token validation: Cached (parsed once)              │
│ ├─ Bean caching: @Cacheable on service methods         │
│ ├─ Lazy loading: Entity relationships                  │
│ └─ Compression: Gzip on responses                      │
│                                                          │
│ Frontend:                                               │
│ ├─ CDN: Tailwind CSS via CDN                           │
│ ├─ Debouncing: Search input                            │
│ ├─ localStorage: Client-side caching                   │
│ └─ Lazy loading: Images (future)                       │
│                                                          │
│ Infrastructure:                                         │
│ ├─ Horizontal scaling: Multiple containers             │
│ ├─ Load balancing: ALB with auto-scaling               │
│ ├─ Database: Multi-AZ for high availability            │
│ └─ CDN: Static assets from edge locations              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌──────────────────────────────────────────────────────────┐
│ LOGGING & MONITORING                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Logging Framework: SLF4J + Logback                      │
│ ├─ Application logs: /logs/hirespherex.log              │
│ ├─ Error logs: /logs/error.log                         │
│ ├─ Audit logs: /logs/audit.log                         │
│ └─ Access logs: /logs/access.log                       │
│                                                          │
│ Metrics (Micrometer):                                   │
│ ├─ Request count & latency                              │
│ ├─ Database connection pool                             │
│ ├─ JVM memory & GC                                      │
│ └─ Custom business metrics                              │
│                                                          │
│ Monitoring Tools:                                        │
│ ├─ CloudWatch (AWS)                                     │
│ ├─ Prometheus + Grafana (on-prem)                       │
│ ├─ New Relic (APM)                                      │
│ └─ DataDog (comprehensive monitoring)                   │
│                                                          │
│ Alerts:                                                 │
│ ├─ High error rate (>5%)                                │
│ ├─ Database connection pool exhausted                   │
│ ├─ Response time > 2s (p95)                             │
│ └─ Disk space low                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

**Last Updated**: December 2024  
**Architecture Version**: 1.0
