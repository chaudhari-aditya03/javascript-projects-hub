package com.hirespherex.dto;

import lombok.Data;
import java.util.List;

public class JobDtos {

    @Data
    public static class JobResponse {
        private Long id;
        private String title;
        private String company;
        private String location;
        private String employmentType;
        private String salary;
        private String description;
        private String status;
        private List<String> skills;
        private String postedDate;
    }

    @Data
    public static class JobSearchRequest {
        private String keyword;
        private String location;
        private String skills;
        private Integer minSalary;
        private Integer maxSalary;
        private String employmentType;
        private int page = 0;
        private int size = 12;
    }
}
