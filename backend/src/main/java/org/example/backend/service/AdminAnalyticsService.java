package org.example.backend.service;

import org.example.backend.dto.AdminAnalyticsResponseDto;
import org.example.backend.dto.CategoryDistributionDto;
import org.example.backend.dto.CommunityAnalyticsDto;
import org.example.backend.dto.DepartmentAnalyticsDto;
import org.example.backend.dto.KpiSummaryDto;
import org.example.backend.dto.OfficerPerformanceDto;
import org.example.backend.dto.TrendPointDto;
import org.example.backend.entity.Complaint;
import org.example.backend.repository.CommunityPostRepository;
import org.example.backend.repository.ComplaintRepository;
import org.example.backend.repository.CitizenRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class AdminAnalyticsService {
    private final ComplaintRepository complaintRepository;
    private final CommunityPostRepository communityPostRepository;
    private final CitizenRatingRepository citizenRatingRepository;

    @Autowired
    public AdminAnalyticsService(ComplaintRepository complaintRepository, CommunityPostRepository communityPostRepository, CitizenRatingRepository citizenRatingRepository) {
        this.complaintRepository = complaintRepository;
        this.communityPostRepository = communityPostRepository;
        this.citizenRatingRepository = citizenRatingRepository;
    }

    public AdminAnalyticsResponseDto getAnalytics() {
        long totalComplaints = complaintRepository.count();
        long openComplaints = complaintRepository.countByStatus(Complaint.Status.OPEN);
        long inProgressComplaints = complaintRepository.countByStatus(Complaint.Status.IN_PROGRESS);
        long resolvedComplaints = complaintRepository.countByStatus(Complaint.Status.RESOLVED);
        long rejectedComplaints = complaintRepository.countByStatus(Complaint.Status.REJECTED);
        double resolutionRate = percentage(resolvedComplaints, totalComplaints);
        long dueTodayComplaints = complaintRepository.countDueToday(List.of(Complaint.Status.OPEN, Complaint.Status.IN_PROGRESS));
        long overdueComplaints = complaintRepository.countOverdue(List.of(Complaint.Status.OPEN, Complaint.Status.IN_PROGRESS));
        long slaBreachedComplaints = complaintRepository.countBySlaBreachedTrue();
        double slaComplianceRate = percentage(resolvedComplaints - slaBreachedComplaints, resolvedComplaints);
        double averageResolutionHours = roundTwo(complaintRepository.getAverageResolutionHours());
        double averageSatisfactionScore = roundTwo(citizenRatingRepository.getAverageRating());
        long totalRatings = citizenRatingRepository.count();

        KpiSummaryDto kpis = new KpiSummaryDto(
                totalComplaints,
                openComplaints,
                inProgressComplaints,
                resolvedComplaints,
                rejectedComplaints,
                resolutionRate,
                dueTodayComplaints,
                overdueComplaints,
                slaBreachedComplaints,
                slaComplianceRate,
                averageResolutionHours,
                averageSatisfactionScore,
                totalRatings
        );

        List<DepartmentAnalyticsDto> departments = complaintRepository.getDepartmentAnalytics(
                        Complaint.Status.RESOLVED,
                        List.of(Complaint.Status.OPEN, Complaint.Status.IN_PROGRESS),
                        Complaint.Status.REJECTED
                )
                .stream()
                .map(this::mapDepartmentAnalytics)
                .toList();

        List<TrendPointDto> submittedTrend = complaintRepository.getSubmittedTrend()
                .stream()
                .map(this::mapTrendPoint)
                .toList();

        List<TrendPointDto> resolvedTrend = complaintRepository.getResolvedTrend(Complaint.Status.RESOLVED)
                .stream()
                .map(this::mapTrendPoint)
                .toList();

        List<OfficerPerformanceDto> officerPerformance = departments.stream()
                .map(department -> new OfficerPerformanceDto(
                        department.getDepartmentName(),
                        department.getTotalComplaints(),
                        department.getResolvedComplaints(),
                        percentage(department.getResolvedComplaints(), department.getTotalComplaints())
                ))
                .toList();

        CommunityAnalyticsDto community = new CommunityAnalyticsDto(
                communityPostRepository.count(),
                communityPostRepository.countByType("BROADCAST"),
                communityPostRepository.countByType("EVENT"),
                communityPostRepository.countByType("POLL")
        );

        List<CategoryDistributionDto> categoryDistribution = complaintRepository.getCategoryDistribution()
                .stream()
                .map(row -> new CategoryDistributionDto(row[0] != null ? row[0].toString() : "OTHER", toLong(row[1])))
                .toList();

        return new AdminAnalyticsResponseDto(
                kpis,
                departments,
                submittedTrend,
                resolvedTrend,
                officerPerformance,
                community,
                categoryDistribution
        );
    }

    private DepartmentAnalyticsDto mapDepartmentAnalytics(Object[] row) {
        return new DepartmentAnalyticsDto(
                (Long) row[0],
                (String) row[1],
                toLong(row[2]),
                toLong(row[3]),
                toLong(row[4]),
                toLong(row[5])
        );
    }

    private TrendPointDto mapTrendPoint(Object[] row) {
        return new TrendPointDto(toLocalDate(row[0]), toLong(row[1]));
    }

    private double percentage(long numerator, long denominator) {
        if (denominator == 0) {
            return 0.0;
        }
        if (numerator < 0) {
            return 0.0;
        }
        return Math.round((numerator * 10000.0) / denominator) / 100.0;
    }

    private double roundTwo(Double value) {
        if (value == null) {
            return 0.0;
        }
        return Math.round(value * 100.0) / 100.0;
    }

    private long toLong(Object value) {
        return value == null ? 0L : ((Number) value).longValue();
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof java.time.LocalDateTime localDateTime) {
            return localDateTime.toLocalDate();
        }
        if (value instanceof Date date) {
            return date.toLocalDate();
        }
        if (value instanceof java.sql.Timestamp timestamp) {
            return timestamp.toLocalDateTime().toLocalDate();
        }
        if (value instanceof java.util.Date date) {
            return date.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
        }
        String str = value.toString();
        if (str.length() >= 10 && str.charAt(4) == '-' && str.charAt(7) == '-') {
            return LocalDate.parse(str.substring(0, 10));
        }
        return LocalDate.parse(str);
    }
}
