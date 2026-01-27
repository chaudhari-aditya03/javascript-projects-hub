package com.hirespherex.config;

import com.hirespherex.entity.*;
import com.hirespherex.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(UserRepository userRepo, RoleRepository roleRepo, 
                                       CompanyRepository companyRepo, SkillRepository skillRepo,
                                       JobRepository jobRepo, CandidateProfileRepository candidateRepo,
                                       RecruiterProfileRepository recruiterRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            // Load roles
            if (roleRepo.findByName("ADMIN").isEmpty()) {
                roleRepo.save(Role.builder().name("ADMIN").build());
            }
            if (roleRepo.findByName("RECRUITER").isEmpty()) {
                roleRepo.save(Role.builder().name("RECRUITER").build());
            }
            if (roleRepo.findByName("CANDIDATE").isEmpty()) {
                roleRepo.save(Role.builder().name("CANDIDATE").build());
            }

            // Load skills
            String[] skillNames = {"Java", "JavaScript", "React", "Spring Boot", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "SQL"};
            for (String name : skillNames) {
                if (skillRepo.findByName(name).isEmpty()) {
                    skillRepo.save(Skill.builder().name(name).build());
                }
            }

            // Load companies
            if (companyRepo.findAll().isEmpty()) {
                companyRepo.save(Company.builder().name("Tech Corp").location("San Francisco").industry("Technology").build());
                companyRepo.save(Company.builder().name("Finance Hub").location("New York").industry("Finance").build());
                companyRepo.save(Company.builder().name("E-commerce Plus").location("Mumbai").industry("E-commerce").build());
            }

            // Load test users and jobs
            if (jobRepo.findAll().isEmpty()) {
                Company tech = companyRepo.findAll().get(0);
                Role recruiterRole = roleRepo.findByName("RECRUITER").orElseThrow();
                Role candidateRole = roleRepo.findByName("CANDIDATE").orElseThrow();

                // Create recruiter
                User recruiter = User.builder()
                        .email("recruiter@tech.com")
                        .passwordHash(passwordEncoder.encode("password123"))
                        .fullName("John Recruiter")
                        .roles(new HashSet<>(Set.of(recruiterRole)))
                        .build();
                User savedRecruiter = userRepo.save(recruiter);

                RecruiterProfile rp = RecruiterProfile.builder()
                        .user(savedRecruiter)
                        .company(tech)
                        .title("Talent Acquisition Manager")
                        .build();
                RecruiterProfile savedRP = recruiterRepo.save(rp);

                // Create test jobs
                Set<Skill> javaSkills = new HashSet<>(skillRepo.findByNameIn(Set.of("Java", "Spring Boot")));
                Set<Skill> jsSkills = new HashSet<>(skillRepo.findByNameIn(Set.of("JavaScript", "React", "Node.js")));

                Job job1 = Job.builder()
                        .title("Senior Java Developer")
                        .description("We are looking for an experienced Java developer to join our team. Experience with Spring Boot is required.")
                        .location("San Francisco, USA")
                        .employmentType("FULL_TIME")
                        .minSalary(120000)
                        .maxSalary(150000)
                        .currency("$")
                        .company(tech)
                        .recruiter(savedRP)
                        .status("ACTIVE")
                        .skills(javaSkills)
                        .build();

                Job job2 = Job.builder()
                        .title("Full Stack JavaScript Developer")
                        .description("Join our innovative team to build modern web applications using React and Node.js.")
                        .location("Remote")
                        .employmentType("FULL_TIME")
                        .minSalary(100000)
                        .maxSalary(130000)
                        .currency("$")
                        .company(tech)
                        .recruiter(savedRP)
                        .status("ACTIVE")
                        .skills(jsSkills)
                        .build();

                jobRepo.save(job1);
                jobRepo.save(job2);

                // Create candidate
                User candidate = User.builder()
                        .email("aditya@gmail.com")
                        .passwordHash(passwordEncoder.encode("aditya@2005"))
                        .fullName("Aditya Demo")
                        .roles(new HashSet<>(Set.of(candidateRole)))
                        .build();
                User savedCandidate = userRepo.save(candidate);

                CandidateProfile cp = CandidateProfile.builder()
                        .user(savedCandidate)
                        .yearsOfExperience(3)
                        .skills(javaSkills)
                        .build();
                candidateRepo.save(cp);
            }
        };
    }
}
