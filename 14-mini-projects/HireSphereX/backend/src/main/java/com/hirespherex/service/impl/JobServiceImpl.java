package com.hirespherex.service.impl;

import com.hirespherex.dto.JobDtos;
import com.hirespherex.entity.Job;
import com.hirespherex.repository.JobRepository;
import com.hirespherex.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    @Override
    public Page<JobDtos.JobResponse> searchJobs(String keyword, String location, String skills, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobs;

        if (keyword != null && !keyword.isEmpty() && location != null && !location.isEmpty()) {
            jobs = jobRepository.searchJobs(keyword, location, pageable);
        } else if (keyword != null && !keyword.isEmpty()) {
            jobs = jobRepository.searchByKeyword(keyword, pageable);
        } else if (location != null && !location.isEmpty()) {
            jobs = jobRepository.searchByLocation(location, pageable);
        } else {
            jobs = jobRepository.findByStatusAndSoftDeletedFalse("ACTIVE", pageable);
        }

        return jobs.map(this::mapToResponse);
    }

    @Override
    public Page<JobDtos.JobResponse> getAllJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return jobRepository.findByStatusAndSoftDeletedFalse("ACTIVE", pageable).map(this::mapToResponse);
    }

    private JobDtos.JobResponse mapToResponse(Job job) {
        JobDtos.JobResponse response = new JobDtos.JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompany(job.getCompany() != null ? job.getCompany().getName() : "Unknown");
        response.setLocation(job.getLocation() != null ? job.getLocation() : "Remote");
        response.setEmploymentType(job.getEmploymentType() != null ? job.getEmploymentType() : "Full-time");
        response.setDescription(job.getDescription() != null ? (job.getDescription().length() > 150 ? job.getDescription().substring(0, 150) + "..." : job.getDescription()) : "");
        response.setStatus(job.getStatus());
        response.setSkills(job.getSkills().stream().map(s -> s.getName()).toList());
        response.setPostedDate(formatDate(job.getCreatedAt()));

        // Format salary
        if (job.getMinSalary() != null && job.getMaxSalary() != null) {
            String currency = job.getCurrency() != null ? job.getCurrency() : "$";
            response.setSalary(currency + job.getMinSalary().toString() + " - " + currency + job.getMaxSalary().toString());
        } else {
            response.setSalary("Competitive");
        }

        return response;
    }

    private String formatDate(Instant instant) {
        if (instant == null) return "Recently";
        Instant now = Instant.now();
        long days = ChronoUnit.DAYS.between(instant, now);
        if (days == 0) return "Today";
        if (days == 1) return "Yesterday";
        if (days < 7) return days + " days ago";
        if (days < 30) return (days / 7) + " weeks ago";
        return (days / 30) + " months ago";
    }
}
