package org.example.backend.service;

import org.example.backend.dto.CitizenRatingDto;
import org.example.backend.dto.RatingRequestDto;
import org.example.backend.entity.CitizenRating;
import org.example.backend.entity.Complaint;
import org.example.backend.entity.User;
import org.example.backend.repository.CitizenRatingRepository;
import org.example.backend.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

@Service
public class RatingService {
    private final CitizenRatingRepository ratingRepository;
    private final ComplaintRepository complaintRepository;

    public RatingService(CitizenRatingRepository ratingRepository, ComplaintRepository complaintRepository) {
        this.ratingRepository = ratingRepository;
        this.complaintRepository = complaintRepository;
    }

    public CitizenRatingDto submitRating(Long complaintId, RatingRequestDto request, User citizen) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        if (!complaint.getCitizen().getId().equals(citizen.getId())) {
            throw new SecurityException("You can only rate your own complaints.");
        }
        if (complaint.getStatus() != Complaint.Status.RESOLVED) {
            throw new IllegalArgumentException("Only resolved complaints can be rated.");
        }
        if (ratingRepository.existsByComplaintIdAndCitizenId(complaintId, citizen.getId())) {
            throw new IllegalArgumentException("This complaint has already been rated.");
        }
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        CitizenRating rating = new CitizenRating();
        rating.setComplaint(complaint);
        rating.setCitizen(citizen);
        rating.setRating(request.getRating());
        rating.setFeedback(request.getFeedback() == null ? "" : request.getFeedback().trim());
        return mapToDto(ratingRepository.save(rating));
    }

    public CitizenRatingDto mapToDto(CitizenRating rating) {
        return new CitizenRatingDto(
                rating.getId(),
                rating.getComplaint().getId(),
                rating.getRating(),
                rating.getFeedback(),
                rating.getCreatedAt()
        );
    }
}
