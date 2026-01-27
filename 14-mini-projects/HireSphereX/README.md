# HireSphere X - Enterprise Job Portal

<div align="center">

![HireSphere X](https://img.shields.io/badge/HireSphere%20X-v1.0.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-green)
![Java](https://img.shields.io/badge/Java-17-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern, scalable, and enterprise-grade job portal platform connecting job seekers with top companies.

[🚀 Quick Start](#quick-start) • [📚 Documentation](#documentation) • [🛠️ Tech Stack](#tech-stack) • [🤝 Contributing](#contributing)

</div>

---

## Overview

**HireSphere X** is a full-stack job portal application that enables candidates to search, save, and apply for jobs, while recruiters can post and manage job openings. Built with enterprise-level architecture principles.

### Key Highlights
- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **Role-Based Access Control** (ADMIN, RECRUITER, CANDIDATE)
- ✅ **Advanced Job Search** with filters and pagination
- ✅ **Secure Password Management** with BCrypt hashing
- ✅ **RESTful API** with comprehensive documentation (Swagger)
- ✅ **Responsive UI** with Tailwind CSS
- ✅ **Production-Ready** with error handling and logging

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (optional)
- **Java** 17+
- **Maven** 3.9.6+
- **MySQL** 8.0+
- **Git**

### 1️⃣ Clone & Setup Database
```bash
# Create MySQL database
mysql -u root -p
> CREATE DATABASE hirespherex;
> exit
```

### 2️⃣ Start Backend
```bash
cd HireSphereX/backend
mvn spring-boot:run
```
✅ Backend: `http://localhost:8080`
📚 Swagger: `http://localhost:8080/api/v1/swagger-ui.html`

### 3️⃣ Start Frontend
```bash
cd HireSphereX/frontend
# Option: Live Server (VS Code) or python -m http.server 8000
```
✅ Frontend: `http://localhost:5500` (or 8000)

### 4️⃣ Login & Test
- Email: `aditya@gmail.com`
- Password: `aditya@2005`

---

## 📚 Documentation

### Guides
- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Setup Instructions](./SETUP.md)** - Detailed setup and configuration
- **[API Documentation](./API.md)** - REST API endpoints and examples
- **[Architecture Guide](./ARCHITECTURE.md)** - System design and patterns

### Key Resources
- **Backend**: `HireSphereX/backend/` - Spring Boot application
- **Frontend**: `HireSphereX/frontend/` - Vanilla JavaScript + Tailwind CSS
- **Database**: Schema and test data seeding

---

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 3.2.2 |
| Language | Java | 17 |
| ORM | Hibernate/JPA | 6.2 |
| Database | MySQL | 8.0 |
| Security | Spring Security | 6.2 |
| JWT | JJWT | 0.11.5 |
| Build | Maven | 3.9.6 |
| Documentation | Springdoc OpenAPI | 2.0.2 |

### Frontend
| Component | Technology |
|-----------|-----------|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN) |
| Language | JavaScript (ES6+) |
| Icons | Font Awesome 6.4 |
| Architecture | Modular (MVC-like) |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Containerization | Docker |
| Container Registry | Docker Hub |
| CI/CD | GitHub Actions (optional) |
| Cloud | AWS/Azure/GCP Ready |

---

## 📁 Project Structure

```
HireSphereX/
├── backend/
│   ├── src/
│   │   └── main/java/com/hirespherex/
│   │       ├── HireSphereXApplication.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java        # JWT + CORS setup
│   │       │   ├── OpenApiConfig.java         # Swagger configuration
│   │       │   └── DataLoader.java            # Test data seeding
│   │       ├── controller/
│   │       │   ├── AuthController.java        # Login/Register/Refresh
│   │       │   └── JobController.java         # Job CRUD & Search
│   │       ├── service/
│   │       │   ├── AuthService.java/Impl.java
│   │       │   ├── JobService.java/Impl.java
│   │       │   └── JwtService.java            # Token management
│   │       ├── entity/                        # JPA Entities
│   │       │   ├── User.java
│   │       │   ├── Role.java
│   │       │   ├── Job.java
│   │       │   ├── Company.java
│   │       │   ├── Skill.java
│   │       │   └── (7 more entities)
│   │       ├── repository/                    # Spring Data JPA
│   │       │   ├── UserRepository.java
│   │       │   ├── JobRepository.java
│   │       │   └── (6 more repositories)
│   │       ├── dto/                           # Data Transfer Objects
│   │       │   ├── AuthDtos.java
│   │       │   └── JobDtos.java
│   │       ├── security/
│   │       │   └── JwtAuthFilter.java
│   │       ├── exception/
│   │       │   └── GlobalExceptionHandler.java
│   │       └── util/
│   │           └── JwtUtil.java
│   ├── pom.xml                                # Maven dependencies
│   ├── application.yml                        # Default config
│   ├── application-dev.yml                    # Dev config
│   ├── application-prod.yml                   # Prod config
│   ├── schema.sql                             # Database schema
│   └── Dockerfile                             # Docker image
├── frontend/
│   ├── index.html                             # Landing page
│   ├── login.html                             # Login form
│   ├── register.html                          # Registration form
│   ├── dashboard.html                         # Main job portal
│   └── js/
│       ├── utils.js                           # Helper functions
│       ├── auth.js                            # Auth API calls
│       ├── api.js                             # Job API calls
│       └── app.js                             # Dashboard logic
├── .env.example                               # Environment variables
├── QUICKSTART.md                              # Quick start guide
├── SETUP.md                                   # Detailed setup
├── API.md                                     # API documentation
├── ARCHITECTURE.md                            # Architecture guide
└── README.md                                  # This file
```

---

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: 7-day validity for token refresh
- **Access Tokens**: 30-minute validity
- **Password Hashing**: BCrypt with 10 salt rounds

### Authorization
- **Role-Based Access Control** (RBAC)
  - `ADMIN`: Full system access
  - `RECRUITER`: Can post and manage jobs
  - `CANDIDATE`: Can search and apply for jobs
- **Method-Level Security**: @PreAuthorize annotations

### Protection
- **CORS**: Configured for frontend origin
- **SQL Injection**: Parameterized queries with JPA
- **CSRF**: Stateless architecture eliminates CSRF
- **XSS**: Input validation and output encoding

---

## 📊 Database Schema

### Key Entities
- **User**: Email, password, roles, timestamps
- **Role**: ADMIN, RECRUITER, CANDIDATE
- **Job**: Title, description, salary, skills, location, company
- **Company**: Name, location, industry
- **Skill**: Name (Java, JavaScript, React, etc.)
- **CandidateProfile**: Experience, skills, bio
- **RecruiterProfile**: Company, title
- **JobApplication**: Job applications tracking
- **SavedJob**: Bookmarked jobs
- **Interview**: Interview scheduling
- **Notification**: User notifications
- **AuditLog**: System activity audit

### Relationships
```
User (1) --- (N) Job (posts/recruiter_id)
User (M) --- (N) Role (roles)
User (1) --- (1) CandidateProfile
User (1) --- (1) RecruiterProfile
Job (1) --- (N) JobApplication
Job (M) --- (N) Skill
Job (N) --- (1) Company
```

---

## 🔌 API Endpoints

### Authentication (Public)
```
POST   /api/v1/auth/register           Create new account
POST   /api/v1/auth/login              Login and get tokens
POST   /api/v1/auth/refresh            Refresh access token
```

### Jobs (Authenticated)
```
GET    /api/v1/jobs                    Get all jobs (paginated)
GET    /api/v1/jobs/search             Search jobs with filters
GET    /api/v1/jobs/{id}               Get job details (future)
POST   /api/v1/jobs                    Create new job (future)
PUT    /api/v1/jobs/{id}               Update job (future)
DELETE /api/v1/jobs/{id}               Delete job (future)
```

### Request/Response Example
```bash
# Login Request
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aditya@gmail.com",
    "password": "aditya@2005"
  }'

# Response
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer"
}

# Use token for authenticated requests
curl -X GET http://localhost:8080/api/v1/jobs \
  -H "Authorization: Bearer <accessToken>"
```

---

## 🎯 Features

### For Candidates ✨
- **Search Jobs**: By keyword, location, job type
- **Advanced Filters**: Salary range, experience level, skills
- **Save Jobs**: Bookmark jobs for later
- **Job Applications**: Apply for positions (in progress)
- **Profile Management**: Update skills and experience
- **Notifications**: Get updates on applications

### For Recruiters 💼
- **Post Jobs**: Create job listings with detailed descriptions
- **Manage Jobs**: Edit, update, or close job postings
- **View Applications**: See candidate applications
- **Schedule Interviews**: Coordinate interview dates/times
- **Candidate Search**: Find candidates by skills (in progress)

### For Admins 🔧
- **User Management**: Manage all users and roles
- **Content Moderation**: Approve job postings
- **Analytics**: View system statistics
- **System Health**: Monitor performance and logs

---

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
cd backend
docker build -t hirespherex:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e DB_HOST=mysql \
  -e DB_USER=root \
  -e DB_PASS=password \
  -e JWT_SECRET=your-secret-key \
  --name hirespherex \
  hirespherex:latest
```

### Cloud Deployment (AWS Example)
```bash
# 1. Push to ECR
docker tag hirespherex:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/hirespherex:latest
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hirespherex:latest

# 2. Deploy to ECS/Fargate
# Configure ECS task definition and launch service

# 3. Setup RDS for MySQL
# Create RDS instance and update connection strings
```

---

## 🧪 Testing

### Manual Testing
1. **Register**: Create new account with unique email
2. **Login**: Use registered or demo credentials
3. **Search**: Try different search queries
4. **Filter**: Apply location and job type filters
5. **Save**: Bookmark jobs and verify persistence
6. **Profile**: Update user profile information

### API Testing (Postman/Insomnia)
```
Import Swagger JSON: http://localhost:8080/api/v1/v3/api-docs
OR
Use Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
```

### Automated Testing (Planned)
- Unit tests with JUnit 5
- Integration tests with TestContainers
- End-to-end tests with Selenium

---

## 📈 Performance Optimization

- **Database**: Indexed columns for faster queries
- **Pagination**: 10 items per page default
- **Caching**: JWT token parsing cached
- **Compression**: Gzip response compression
- **CDN**: Tailwind CSS via CDN
- **Lazy Loading**: Jobs loaded on-demand

---

## 🐛 Known Issues & Limitations

| Issue | Status | Notes |
|-------|--------|-------|
| Job applications backend | 🔴 Pending | UI ready, API integration needed |
| Resume upload | 🔴 Pending | File storage configuration needed |
| Email notifications | 🔴 Pending | SMTP configuration needed |
| Real-time updates | 🔴 Pending | WebSocket integration planned |
| Mobile app | 🔴 Pending | React Native planned |

---

## 🔄 Roadmap

### Version 1.1 (Next)
- [ ] Job application tracking
- [ ] Resume upload & parsing
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Job recommendations

### Version 1.2
- [ ] Interview scheduling system
- [ ] Real-time notifications (WebSocket)
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Skill endorsements

### Version 2.0
- [ ] Mobile app (React Native)
- [ ] Machine learning recommendations
- [ ] Video interviews integration
- [ ] Multi-language support
- [ ] Premium features

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Write unit tests for new features
- Update documentation
- Ensure backward compatibility

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

**HireSphere X** was created by a dedicated team of developers passionate about building great software.

---

## 💬 Support & Feedback

- 📧 **Email**: support@hirespherex.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/hirespherex/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/hirespherex/discussions)
- 📖 **Documentation**: Check [SETUP.md](./SETUP.md) and [QUICKSTART.md](./QUICKSTART.md)

---

## 🎉 Acknowledgments

- Spring Boot Team
- Tailwind CSS Community
- JJWT Contributors
- MySQL Community
- Open Source Community

---

<div align="center">

**Made with ❤️ by HireSphere X Team**

⭐ Star us on GitHub | 🐛 Report bugs | 💡 Suggest features

**[↑ Back to Top](#)**

</div>

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
