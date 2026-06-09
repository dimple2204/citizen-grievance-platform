package org.example.backend.dto;

import java.util.List;

public class AdminAnalyticsResponseDto {
    private KpiSummaryDto kpis;
    private List<DepartmentAnalyticsDto> departments;
    private List<TrendPointDto> submittedTrend;
    private List<TrendPointDto> resolvedTrend;
    private List<OfficerPerformanceDto> officerPerformance;
    private CommunityAnalyticsDto community;
    private List<CategoryDistributionDto> categoryDistribution;

    public AdminAnalyticsResponseDto() {
    }

    public AdminAnalyticsResponseDto(KpiSummaryDto kpis, List<DepartmentAnalyticsDto> departments, List<TrendPointDto> submittedTrend, List<TrendPointDto> resolvedTrend, List<OfficerPerformanceDto> officerPerformance, CommunityAnalyticsDto community) {
        this.kpis = kpis;
        this.departments = departments;
        this.submittedTrend = submittedTrend;
        this.resolvedTrend = resolvedTrend;
        this.officerPerformance = officerPerformance;
        this.community = community;
    }

    public AdminAnalyticsResponseDto(KpiSummaryDto kpis, List<DepartmentAnalyticsDto> departments, List<TrendPointDto> submittedTrend, List<TrendPointDto> resolvedTrend, List<OfficerPerformanceDto> officerPerformance, CommunityAnalyticsDto community, List<CategoryDistributionDto> categoryDistribution) {
        this(kpis, departments, submittedTrend, resolvedTrend, officerPerformance, community);
        this.categoryDistribution = categoryDistribution;
    }

    public KpiSummaryDto getKpis() {
        return kpis;
    }

    public void setKpis(KpiSummaryDto kpis) {
        this.kpis = kpis;
    }

    public List<DepartmentAnalyticsDto> getDepartments() {
        return departments;
    }

    public void setDepartments(List<DepartmentAnalyticsDto> departments) {
        this.departments = departments;
    }

    public List<TrendPointDto> getSubmittedTrend() {
        return submittedTrend;
    }

    public void setSubmittedTrend(List<TrendPointDto> submittedTrend) {
        this.submittedTrend = submittedTrend;
    }

    public List<TrendPointDto> getResolvedTrend() {
        return resolvedTrend;
    }

    public void setResolvedTrend(List<TrendPointDto> resolvedTrend) {
        this.resolvedTrend = resolvedTrend;
    }

    public List<OfficerPerformanceDto> getOfficerPerformance() {
        return officerPerformance;
    }

    public void setOfficerPerformance(List<OfficerPerformanceDto> officerPerformance) {
        this.officerPerformance = officerPerformance;
    }

    public CommunityAnalyticsDto getCommunity() {
        return community;
    }

    public void setCommunity(CommunityAnalyticsDto community) {
        this.community = community;
    }

    public List<CategoryDistributionDto> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<CategoryDistributionDto> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }
}
