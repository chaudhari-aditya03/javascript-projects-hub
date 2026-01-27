# HireSphere X – Intelligent Recruitment Platform

Enterprise-grade job portal built with Spring Boot (Java 17), JWT security, JPA/Hibernate, and MySQL.

## Tech Stack
- Backend: Spring Boot, Spring MVC, Spring Security (JWT), JPA/Hibernate, MySQL, Maven
- Optional: Redis, Elasticsearch (future-ready)
- Docs: Springdoc OpenAPI (Swagger)

## Architecture
Layered:
- Controller → Service → Repository → Entity → DTO
- Global exception handling, validation, logging (SLF4J), environment profiles, API versioning via context path `/api/v1`.

## Security
- JWT access + refresh tokens
- Roles: `ADMIN`, `RECRUITER`, `CANDIDATE`
- BCrypt password hashing
- Stateless session, CORS enabled for local dev

## Run Locally
```bash
# in backend folder
mvn clean package
java -jar target/hirespherex-backend-0.1.0.jar
```

Swagger UI: http://localhost:8080/api/v1/swagger-ui.html

## Config
- `application.yml` (defaults)
- `application-dev.yml` (dev profile, `ddl-auto: update`)
- `application-prod.yml` (env secrets)

## Database Schema
See `src/main/resources/schema.sql` for full DDL.

## Sample API Requests
- Register:
```http
POST /api/v1/auth/register
Content-Type: application/json
{
  "email": "jane@example.com",
  "password": "Secure@123",
  "fullName": "Jane Doe"
}
```
- Login:
```http
POST /api/v1/auth/login
Content-Type: application/json
{
  "email": "jane@example.com",
  "password": "Secure@123"
}
```
Response:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer"
}
```
- Search Jobs:
```http
GET /api/v1/jobs/search?keyword=developer&location=USA&skills=java&page=0&size=12
Authorization: Bearer <accessToken>
```

## Docker
```bash
docker build -t hirespherex:0.1.0 .
docker run -p 8080:8080 hirespherex:0.1.0
```

## Next Steps
- Implement JobService: search, CRUD, approval workflow, soft deletes
- Candidate features: apply, save jobs, notifications
- Recruiter features: pipeline, interviews, resume ranking
- Admin features: moderation, analytics
- Unit tests: JUnit + Mockito

## License
Internal use. Replace secrets before deployment.
