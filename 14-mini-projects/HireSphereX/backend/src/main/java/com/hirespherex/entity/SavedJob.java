package com.hirespherex.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_jobs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class SavedJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
}