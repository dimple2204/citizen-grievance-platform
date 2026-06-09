package org.example.backend.dto;

import java.time.LocalDateTime;

public class ComplaintHistoryDto {
    private Long id;
    private String officerName;
    private String action;
    private String remark;
    private LocalDateTime createdAt;

    public ComplaintHistoryDto() {
    }

    public ComplaintHistoryDto(Long id, String officerName, String action, String remark, LocalDateTime createdAt) {
        this.id = id;
        this.officerName = officerName;
        this.action = action;
        this.remark = remark;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
