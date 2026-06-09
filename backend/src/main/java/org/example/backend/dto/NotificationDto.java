package org.example.backend.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private Long complaintId;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationDto(Long id, Long complaintId, String title, String message, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.complaintId = complaintId;
        this.title = title;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
