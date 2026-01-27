package com.hirespherex.controller;

import com.hirespherex.dto.JobDtos;
import com.hirespherex.service.JobService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/search")
    public ResponseEntity<Page<JobDtos.JobResponse>> search(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "") String skills,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "12") @Min(1) int size
    ) {
        Page<JobDtos.JobResponse> jobs = jobService.searchJobs(keyword, location, skills, page, size);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping
    public ResponseEntity<Page<JobDtos.JobResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "12") @Min(1) int size
    ) {
        Page<JobDtos.JobResponse> jobs = jobService.getAllJobs(page, size);
        return ResponseEntity.ok(jobs);
    }
}
