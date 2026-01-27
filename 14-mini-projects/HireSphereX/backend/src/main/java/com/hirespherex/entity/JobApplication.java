package com.hirespherex.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "job_applications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private String status; // APPLIED, REVIEW, INTERVIEW, OFFER, REJECTED

    @CreationTimestamp
    private Instant appliedAt;

    private String resumeUrl;
}