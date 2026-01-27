-- HireSphere X - ER Diagram DDL (MySQL)

CREATE TABLE roles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE companies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL UNIQUE,
  location VARCHAR(100),
  website VARCHAR(500),
  industry VARCHAR(200)
);

CREATE TABLE skills (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE candidate_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  years_of_experience INT,
  resume_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_candidate_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE candidate_skills (
  candidate_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (candidate_id, skill_id),
  CONSTRAINT fk_candidate_skills_c FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id),
  CONSTRAINT fk_candidate_skills_s FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE recruiter_profiles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  company_id BIGINT,
  title VARCHAR(200),
  CONSTRAINT fk_recruiter_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_recruiter_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT,
  recruiter_id BIGINT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(150),
  employment_type VARCHAR(50),
  min_salary INT,
  max_salary INT,
  currency VARCHAR(10),
  status VARCHAR(50),
  soft_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_job_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiter_profiles(id)
);

CREATE TABLE job_skills (
  job_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  PRIMARY KEY (job_id, skill_id),
  CONSTRAINT fk_job_skills_j FOREIGN KEY (job_id) REFERENCES jobs(id),
  CONSTRAINT fk_job_skills_s FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE job_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resume_url VARCHAR(500),
  CONSTRAINT fk_application_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id),
  CONSTRAINT fk_application_job FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE saved_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id BIGINT NOT NULL,
  job_id BIGINT NOT NULL,
  CONSTRAINT fk_saved_candidate FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id),
  CONSTRAINT fk_saved_job FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE interviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  scheduled_at TIMESTAMP,
  mode VARCHAR(50),
  notes VARCHAR(1000),
  CONSTRAINT fk_interview_app FOREIGN KEY (application_id) REFERENCES job_applications(id)
);

CREATE TABLE notifications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  type VARCHAR(50),
  message VARCHAR(1000),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(120) NOT NULL,
  actor_email VARCHAR(120),
  details VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
