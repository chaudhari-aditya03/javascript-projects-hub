package com.hirespherex.repository;

import com.hirespherex.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findByStatusAndSoftDeletedFalse(String status, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.softDeleted = false AND j.status = 'ACTIVE' " +
           "AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.softDeleted = false AND j.status = 'ACTIVE' " +
           "AND LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    Page<Job> searchByLocation(@Param("location") String location, Pageable pageable);

    @Query("SELECT DISTINCT j FROM Job j LEFT JOIN j.skills s WHERE j.softDeleted = false AND j.status = 'ACTIVE' " +
           "AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    Page<Job> searchJobs(@Param("keyword") String keyword, @Param("location") String location, Pageable pageable);
}
