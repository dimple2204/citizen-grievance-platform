package org.example.backend.dto;

public class OfficerPerformanceDto {
    private String departmentName;
    private long handledComplaints;
    private long resolvedComplaints;
    private double resolutionEfficiency;

    public OfficerPerformanceDto() {
    }

    public OfficerPerformanceDto(String departmentName, long handledComplaints, long resolvedComplaints, double resolutionEfficiency) {
        this.departmentName = departmentName;
        this.handledComplaints = handledComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.resolutionEfficiency = resolutionEfficiency;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public long getHandledComplaints() {
        return handledComplaints;
    }

    public void setHandledComplaints(long handledComplaints) {
        this.handledComplaints = handledComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public double getResolutionEfficiency() {
        return resolutionEfficiency;
    }

    public void setResolutionEfficiency(double resolutionEfficiency) {
        this.resolutionEfficiency = resolutionEfficiency;
    }
}
