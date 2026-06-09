package org.example.backend.repository;

import org.example.backend.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    // Fetch feed items specific to a user's ward, ordered by newest first
    List<CommunityPost> findByWardOrderByCreatedAtDesc(String ward);

    long countByType(String type);
}
