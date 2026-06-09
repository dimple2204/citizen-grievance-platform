package org.example.backend.service;

import org.example.backend.dto.ComplaintRequestDto;
import org.example.backend.dto.ComplaintResponseDto;
import org.example.backend.dto.CitizenRatingDto;
import org.example.backend.entity.Complaint;
import org.example.backend.entity.ComplaintHistory;
import org.example.backend.entity.Department;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.CitizenRatingRepository;
import org.example.backend.repository.ComplaintAttachmentRepository;
import org.example.backend.repository.ComplaintHistoryRepository;
import org.example.backend.repository.ComplaintRepository;
import org.example.backend.repository.DepartmentRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final ComplaintHistoryRepository complaintHistoryRepository;
    private final ComplaintAttachmentRepository complaintAttachmentRepository;
    private final CitizenRatingRepository citizenRatingRepository;
    private final RatingService ratingService;
    private final NotificationService notificationService;

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository, DepartmentRepository departmentRepository, UserRepository userRepository, ComplaintHistoryRepository complaintHistoryRepository, ComplaintAttachmentRepository complaintAttachmentRepository, CitizenRatingRepository citizenRatingRepository, RatingService ratingService, NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.complaintHistoryRepository = complaintHistoryRepository;
        this.complaintAttachmentRepository = complaintAttachmentRepository;
        this.citizenRatingRepository = citizenRatingRepository;
        this.ratingService = ratingService;
        this.notificationService = notificationService;
    }

    public Complaint createComplaint(ComplaintRequestDto dto) {
        User citizen = userRepository.findById(dto.getCitizenId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Citizen with ID " + dto.getCitizenId() + " not found!")
                );
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Department with ID " + dto.getDepartmentId() + " not found!"
                        )
                );
        Complaint complaint = new Complaint();
        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setLatitude(dto.getLatitude());
        complaint.setLongitude(dto.getLongitude());
        complaint.setCategory(parseCategory(dto.getCategory()));
        complaint.setPriority(parsePriority(dto.getPriority()));
        complaint.setSlaDueAt(calculateSlaDueAt(complaint.getPriority()));
        complaint.setCitizen(citizen);
        complaint.setDepartment(department);

        Complaint savedComplaint = complaintRepository.save(complaint);
        saveHistory(savedComplaint, "Citizen", "Complaint Created", "Complaint submitted by " + citizen.getFullName());
        notificationService.notifyCitizen(savedComplaint, "Complaint created", "Your complaint #" + savedComplaint.getId() + " has been registered.");
        return savedComplaint;
    }

    // Helper method to map Entity to DTO
    public ComplaintResponseDto mapToDto(Complaint complaint) {
        ComplaintResponseDto dto = new ComplaintResponseDto();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus() != null ? complaint.getStatus().name() : "OPEN");
        dto.setCitizenName(complaint.getCitizen().getFullName());
        dto.setDepartmentId(complaint.getDepartment().getId());
        dto.setDepartmentName(complaint.getDepartment().getName());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        dto.setSlaDueAt(complaint.getSlaDueAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        dto.setSlaBreached(isBreached(complaint));
        dto.setCategory(complaint.getCategory() != null ? complaint.getCategory().name() : "OTHER");
        dto.setPriority(complaint.getPriority() != null ? complaint.getPriority().name() : "MEDIUM");
        dto.setLatitude(complaint.getLatitude());
        dto.setLongitude(complaint.getLongitude());
        dto.setHistory(complaintHistoryRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId()).stream()
                .map(history -> new org.example.backend.dto.ComplaintHistoryDto(
                        history.getId(),
                        history.getOfficerName(),
                        history.getAction(),
                        history.getRemark(),
                        history.getCreatedAt()
                ))
                .toList());
        dto.setAttachments(complaintAttachmentRepository.findByComplaintIdOrderByUploadedAtAsc(complaint.getId()).stream()
                .map(attachment -> new org.example.backend.dto.ComplaintAttachmentDto(
                        attachment.getId(),
                        attachment.getOriginalFileName(),
                        attachment.getContentType(),
                        attachment.getSizeBytes(),
                        attachment.getUploadedAt(),
                        "/complaints/attachments/" + attachment.getId()
                ))
                .toList());
        CitizenRatingDto rating = citizenRatingRepository.findByComplaintId(complaint.getId())
                .map(ratingService::mapToDto)
                .orElse(null);
        dto.setRating(rating);
        return dto;
    }

    public ComplaintResponseDto updateComplaintStaus(Long complaintId, String newStatus, User officer) {
        // 1. Find the existing complaint
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint with ID " + complaintId + " not found!"));
        validateOfficerAccess(complaint, officer);

        Complaint.Status previousStatus = complaint.getStatus();
        // 2. Safely convert the string to the Status enum
        try{
            Complaint.Status statusEnum = Complaint.Status.valueOf(newStatus.toUpperCase());
            complaint.setStatus(statusEnum);
            if (statusEnum == Complaint.Status.RESOLVED) {
                complaint.setResolvedAt(LocalDateTime.now());
                complaint.setSlaBreached(complaint.getSlaDueAt() != null && LocalDateTime.now().isAfter(complaint.getSlaDueAt()));
            }
            if (statusEnum == Complaint.Status.REJECTED) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status provided: " + newStatus);
        }

        // 3. Save to database (the @PreUpdate will automatically update the updatedAt timestamp)
        complaint.setAssignedOfficer(officer);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        saveHistory(
                updatedComplaint,
                officer.getFullName(),
                getStatusAction(updatedComplaint.getStatus()),
                "Status changed from " + previousStatus.name() + " to " + updatedComplaint.getStatus().name()
        );
        notificationService.notifyCitizen(
                updatedComplaint,
                getNotificationTitle(updatedComplaint.getStatus()),
                "Complaint #" + updatedComplaint.getId() + " is now " + updatedComplaint.getStatus().name().replace("_", " ") + "."
        );

        // 4. Return the safe DTO so the frontend can immediately update the UI
        return mapToDto(updatedComplaint);
    }

    public ComplaintResponseDto addRemark(Long complaintId, String remark, User officer) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint with ID " + complaintId + " not found!"));
        validateOfficerAccess(complaint, officer);

        String cleanRemark = remark == null ? "" : remark.trim();
        if (cleanRemark.isEmpty()) {
            throw new IllegalArgumentException("Remark cannot be empty.");
        }

        complaint.setAssignedOfficer(officer);
        Complaint updatedComplaint = complaintRepository.save(complaint);
        saveHistory(updatedComplaint, officer.getFullName(), "Remark Added", cleanRemark);
        notificationService.notifyCitizen(updatedComplaint, "Officer remark added", "An officer added an update to complaint #" + updatedComplaint.getId() + ".");
        return mapToDto(updatedComplaint);
    }

    public List<ComplaintResponseDto> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<ComplaintResponseDto> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<ComplaintResponseDto> getComplaintsByDepartment(Long departmentId) {
        return complaintRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToDto)
                .toList();
    }

    private void saveHistory(Complaint complaint, String officerName, String action, String remark) {
        ComplaintHistory history = new ComplaintHistory();
        history.setComplaint(complaint);
        history.setOfficerName(officerName);
        history.setAction(action);
        history.setRemark(remark);
        complaintHistoryRepository.save(history);
    }

    private String getStatusAction(Complaint.Status status) {
        if (status == Complaint.Status.RESOLVED) {
            return "Complaint Resolved";
        }
        if (status == Complaint.Status.REJECTED) {
            return "Complaint Rejected";
        }
        return "Status Changed";
    }

    private String getNotificationTitle(Complaint.Status status) {
        if (status == Complaint.Status.RESOLVED) return "Complaint resolved";
        if (status == Complaint.Status.REJECTED) return "Complaint rejected";
        return "Complaint status updated";
    }

    private Complaint.Category parseCategory(String category) {
        if (category == null || category.isBlank()) return Complaint.Category.OTHER;
        try {
            return Complaint.Category.valueOf(category.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category provided: " + category);
        }
    }

    private Complaint.Priority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) return Complaint.Priority.MEDIUM;
        try {
            return Complaint.Priority.valueOf(priority.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority provided: " + priority);
        }
    }

    private LocalDateTime calculateSlaDueAt(Complaint.Priority priority) {
        int days = switch (priority) {
            case CRITICAL -> 1;
            case HIGH -> 3;
            case MEDIUM -> 7;
            case LOW -> 15;
        };
        return LocalDateTime.now().plusDays(days);
    }

    private boolean isBreached(Complaint complaint) {
        if (complaint.isSlaBreached()) return true;
        return complaint.getSlaDueAt() != null
                && complaint.getStatus() != Complaint.Status.RESOLVED
                && complaint.getStatus() != Complaint.Status.REJECTED
                && LocalDateTime.now().isAfter(complaint.getSlaDueAt());
    }

    private void validateOfficerAccess(Complaint complaint, User officer) {
        if (officer == null || (!officer.getRole().equals(Role.OFFICER) && !officer.getRole().equals(Role.ADMIN))) {
            throw new SecurityException("Only officers and admins can update complaint history.");
        }

        boolean isAssignedToDepartment = officer.getAssignedDepartments().stream()
                .anyMatch(department -> department.getId().equals(complaint.getDepartment().getId()));

        if (!isAssignedToDepartment && !officer.getRole().equals(Role.ADMIN)) {
            throw new SecurityException("You are not authorized to update this complaint.");
        }
    }
}
