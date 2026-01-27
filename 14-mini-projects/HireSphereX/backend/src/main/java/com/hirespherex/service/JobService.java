package com.hirespherex.service;

import com.hirespherex.dto.JobDtos;
import org.springframework.data.domain.Page;

public interface JobService {
    Page<JobDtos.JobResponse> searchJobs(String keyword, String location, String skills, int page, int size);
    Page<JobDtos.JobResponse> getAllJobs(int page, int size);
}
