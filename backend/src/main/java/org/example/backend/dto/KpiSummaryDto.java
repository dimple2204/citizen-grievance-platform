package org.example.backend.dto;

public class KpiSummaryDto {
    private long totalComplaints;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long rejectedComplaints;
    private double resolutionRate;
    private long dueTodayComplaints;
    private long overdueComplaints;
    private long slaBreachedComplaints;
    private double slaComplianceRate;
    private double averageResolutionHours;
    private double averageSatisfactionScore;
    private long totalRatings;

    public KpiSummaryDto() {
    }

    public KpiSummaryDto(long totalComplaints, long openComplaints, long inProgressComplaints, long resolvedComplaints, long rejectedComplaints, double resolutionRate) {
        this.totalComplaints = totalComplaints;
        this.openComplaints = openComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.rejectedComplaints = rejectedComplaints;
        this.resolutionRate = resolutionRate;
    }

    public KpiSummaryDto(long totalComplaints, long openComplaints, long inProgressComplaints, long resolvedComplaints, long rejectedComplaints, double resolutionRate, long dueTodayComplaints, long overdueComplaints, long slaBreachedComplaints, double slaComplianceRate, double averageResolutionHours, double averageSatisfactionScore, long totalRatings) {
        this(totalComplaints, openComplaints, inProgressComplaints, resolvedComplaints, rejectedComplaints, resolutionRate);
        this.dueTodayComplaints = dueTodayComplaints;
        this.overdueComplaints = overdueComplaints;
        this.slaBreachedComplaints = slaBreachedComplaints;
        this.slaComplianceRate = slaComplianceRate;
        this.averageResolutionHours = averageResolutionHours;
        this.averageSatisfactionScore = averageSatisfactionScore;
        this.totalRatings = totalRatings;
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getOpenComplaints() {
        return openComplaints;
    }

    public void setOpenComplaints(long openComplaints) {
        this.openComplaints = openComplaints;
    }

    public long getInProgressComplaints() {
        return inProgressComplaints;
    }

    public void setInProgressComplaints(long inProgressComplaints) {
        this.inProgressComplaints = inProgressComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getRejectedComplaints() {
        return rejectedComplaints;
    }

    public void setRejectedComplaints(long rejectedComplaints) {
        this.rejectedComplaints = rejectedComplaints;
    }

    public double getResolutionRate() {
        return resolutionRate;
    }

    public void setResolutionRate(double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }

    public long getDueTodayComplaints() { return dueTodayComplaints; }
    public void setDueTodayComplaints(long dueTodayComplaints) { this.dueTodayComplaints = dueTodayComplaints; }
    public long getOverdueComplaints() { return overdueComplaints; }
    public void setOverdueComplaints(long overdueComplaints) { this.overdueComplaints = overdueComplaints; }
    public long getSlaBreachedComplaints() { return slaBreachedComplaints; }
    public void setSlaBreachedComplaints(long slaBreachedComplaints) { this.slaBreachedComplaints = slaBreachedComplaints; }
    public double getSlaComplianceRate() { return slaComplianceRate; }
    public void setSlaComplianceRate(double slaComplianceRate) { this.slaComplianceRate = slaComplianceRate; }
    public double getAverageResolutionHours() { return averageResolutionHours; }
    public void setAverageResolutionHours(double averageResolutionHours) { this.averageResolutionHours = averageResolutionHours; }
    public double getAverageSatisfactionScore() { return averageSatisfactionScore; }
    public void setAverageSatisfactionScore(double averageSatisfactionScore) { this.averageSatisfactionScore = averageSatisfactionScore; }
    public long getTotalRatings() { return totalRatings; }
    public void setTotalRatings(long totalRatings) { this.totalRatings = totalRatings; }
}
