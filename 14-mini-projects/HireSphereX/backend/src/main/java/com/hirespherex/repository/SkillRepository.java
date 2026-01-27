package com.hirespherex.repository;

import com.hirespherex.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name);
    Set<Skill> findByNameIn(Set<String> names);
}
