package org.example.backend.dto;

public class DepartmentAnalyticsDto {
    private Long departmentId;
    private String departmentName;
    private long totalComplaints;
    private long resolvedComplaints;
    private long pendingComplaints;
    private long rejectedComplaints;

    public DepartmentAnalyticsDto() {
    }

    public DepartmentAnalyticsDto(Long departmentId, String departmentName, long totalComplaints, long resolvedComplaints, long pendingComplaints, long rejectedComplaints) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.totalComplaints = totalComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.pendingComplaints = pendingComplaints;
        this.rejectedComplaints = rejectedComplaints;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getPendingComplaints() {
        return pendingComplaints;
    }

    public void setPendingComplaints(long pendingComplaints) {
        this.pendingComplaints = pendingComplaints;
    }

    public long getRejectedComplaints() {
        return rejectedComplaints;
    }

    public void setRejectedComplaints(long rejectedComplaints) {
        this.rejectedComplaints = rejectedComplaints;
    }
}
