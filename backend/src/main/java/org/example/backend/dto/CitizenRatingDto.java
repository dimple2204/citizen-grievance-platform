package org.example.backend.dto;

import java.time.LocalDateTime;

public class CitizenRatingDto {
    private Long id;
    private Long complaintId;
    private int rating;
    private String feedback;
    private LocalDateTime createdAt;

    public CitizenRatingDto() {}

    public CitizenRatingDto(Long id, Long complaintId, int rating, String feedback, LocalDateTime createdAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.rating = rating;
        this.feedback = feedback;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
