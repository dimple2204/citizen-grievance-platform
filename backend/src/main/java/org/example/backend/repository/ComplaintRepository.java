package org.example.backend.repository;

import org.example.backend.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
    List<Complaint> findByDepartmentId(Long departmentId);
    // Find all complaints submitted by a single citizen
    List<Complaint> findByCitizenId(Long citizenId);

    long countByStatus(Complaint.Status status);
    long countBySlaBreachedTrue();

    @Query("""
            SELECT COUNT(c)
            FROM Complaint c
            WHERE c.status IN :activeStatuses AND c.slaDueAt < CURRENT_TIMESTAMP
            """)
    long countOverdue(@Param("activeStatuses") List<Complaint.Status> activeStatuses);

    @Query("""
            SELECT COUNT(c)
            FROM Complaint c
            WHERE c.status IN :activeStatuses
              AND FUNCTION('date', c.slaDueAt) = CURRENT_DATE
            """)
    long countDueToday(@Param("activeStatuses") List<Complaint.Status> activeStatuses);

    @Query("""
            SELECT c.department.id,
                   c.department.name,
                   COUNT(c),
                   SUM(CASE WHEN c.status = :resolvedStatus THEN 1 ELSE 0 END),
                   SUM(CASE WHEN c.status IN :pendingStatuses THEN 1 ELSE 0 END),
                   SUM(CASE WHEN c.status = :rejectedStatus THEN 1 ELSE 0 END)
            FROM Complaint c
            GROUP BY c.department.id, c.department.name
            ORDER BY c.department.name
            """)
    List<Object[]> getDepartmentAnalytics(
            @Param("resolvedStatus") Complaint.Status resolvedStatus,
            @Param("pendingStatuses") List<Complaint.Status> pendingStatuses,
            @Param("rejectedStatus") Complaint.Status rejectedStatus
    );

    @Query("""
            SELECT FUNCTION('date', c.createdAt), COUNT(c)
            FROM Complaint c
            GROUP BY FUNCTION('date', c.createdAt)
            ORDER BY FUNCTION('date', c.createdAt)
            """)
    List<Object[]> getSubmittedTrend();

    @Query("""
            SELECT FUNCTION('date', c.updatedAt), COUNT(c)
            FROM Complaint c
            WHERE c.status = :resolvedStatus
            GROUP BY FUNCTION('date', c.updatedAt)
            ORDER BY FUNCTION('date', c.updatedAt)
            """)
    List<Object[]> getResolvedTrend(@Param("resolvedStatus") Complaint.Status resolvedStatus);

    @Query("""
            SELECT c.category, COUNT(c)
            FROM Complaint c
            GROUP BY c.category
            ORDER BY c.category
            """)
    List<Object[]> getCategoryDistribution();

    @Query(value = """
            SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)
            FROM complaints
            WHERE resolved_at IS NOT NULL
            """, nativeQuery = true)
    Double getAverageResolutionHours();
}
