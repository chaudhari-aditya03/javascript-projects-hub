package com.hirespherex.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String type; // SYSTEM, APPLICATION_UPDATE, INTERVIEW

    private String message;

    @Column(name = "is_read")
    private boolean read=false;


    @CreationTimestamp
    private Instant createdAt;
}