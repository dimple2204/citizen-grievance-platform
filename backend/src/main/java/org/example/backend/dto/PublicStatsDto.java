package org.example.backend.dto;

public class PublicStatsDto {
    private long resolvedComplaints;
    private double avgResponseTimeHours;
    private double citizenSatisfactionRate;
    private long departmentsConnected;

    public PublicStatsDto(long resolvedComplaints, double avgResponseTimeHours, double citizenSatisfactionRate, long departmentsConnected) {
        this.resolvedComplaints = resolvedComplaints;
        this.avgResponseTimeHours = avgResponseTimeHours;
        this.citizenSatisfactionRate = citizenSatisfactionRate;
        this.departmentsConnected = departmentsConnected;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public double getAvgResponseTimeHours() {
        return avgResponseTimeHours;
    }

    public void setAvgResponseTimeHours(double avgResponseTimeHours) {
        this.avgResponseTimeHours = avgResponseTimeHours;
    }

    public double getCitizenSatisfactionRate() {
        return citizenSatisfactionRate;
    }

    public void setCitizenSatisfactionRate(double citizenSatisfactionRate) {
        this.citizenSatisfactionRate = citizenSatisfactionRate;
    }

    public long getDepartmentsConnected() {
        return departmentsConnected;
    }

    public void setDepartmentsConnected(long departmentsConnected) {
        this.departmentsConnected = departmentsConnected;
    }
}
