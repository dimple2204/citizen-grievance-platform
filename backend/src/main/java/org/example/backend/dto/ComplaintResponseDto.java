package org.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ComplaintResponseDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String citizenName;
    private Long departmentId;
    private String departmentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime slaDueAt;
    private LocalDateTime resolvedAt;
    private boolean slaBreached;
    private String category;
    private String priority;
    private Double latitude;
    private Double longitude;
    private List<ComplaintHistoryDto> history;
    private List<ComplaintAttachmentDto> attachments;
    private CitizenRatingDto rating;

    public ComplaintResponseDto() {}

    public ComplaintResponseDto(Long id, String title, String description, String status, String citizenName, String departmentName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.citizenName = citizenName;
        this.departmentName = departmentName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCitizenName() {
        return citizenName;
    }

    public void setCitizenName(String citizenName) {
        this.citizenName = citizenName;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<ComplaintHistoryDto> getHistory() {
        return history;
    }

    public void setHistory(List<ComplaintHistoryDto> history) {
        this.history = history;
    }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    public boolean isSlaBreached() { return slaBreached; }
    public void setSlaBreached(boolean slaBreached) { this.slaBreached = slaBreached; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public List<ComplaintAttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<ComplaintAttachmentDto> attachments) { this.attachments = attachments; }
    public CitizenRatingDto getRating() { return rating; }
    public void setRating(CitizenRatingDto rating) { this.rating = rating; }
}
