package org.example.backend.repository;

import org.example.backend.entity.CitizenRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CitizenRatingRepository extends JpaRepository<CitizenRating, Long> {
    Optional<CitizenRating> findByComplaintId(Long complaintId);
    boolean existsByComplaintIdAndCitizenId(Long complaintId, Long citizenId);

    @Query("SELECT AVG(r.rating) FROM CitizenRating r")
    Double getAverageRating();
}
