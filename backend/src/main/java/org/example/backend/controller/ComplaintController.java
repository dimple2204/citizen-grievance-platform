package org.example.backend.controller;

import org.example.backend.dto.ComplaintRequestDto;
import org.example.backend.dto.ComplaintResponseDto;
import org.example.backend.dto.RatingRequestDto;
import org.example.backend.dto.RemarkRequestDto;
import org.example.backend.dto.UpdateStatusDto;
import org.example.backend.entity.ComplaintAttachment;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.AttachmentService;
import org.example.backend.service.ComplaintService;
import org.example.backend.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;
    private final UserRepository userRepository; // Added to fetch the user's assigned departments
    private final AttachmentService attachmentService;
    private final RatingService ratingService;

    @Autowired
    public ComplaintController(ComplaintService complaintService, UserRepository userRepository, AttachmentService attachmentService, RatingService ratingService) {
        this.complaintService = complaintService;
        this.userRepository = userRepository;
        this.attachmentService = attachmentService;
        this.ratingService = ratingService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitComplaint(@RequestBody ComplaintRequestDto dto, @AuthenticationPrincipal UserDetails userDetails) {
        try{
            if (dto.getCitizenId() == null && userDetails != null) {
                User citizen = getCurrentUser(userDetails);
                dto.setCitizenId(citizen.getId());
            }
            return ResponseEntity.ok(complaintService.mapToDto(complaintService.createComplaint(dto)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // For the Admin Dashboard
    @GetMapping("/all")
    public ResponseEntity<List<ComplaintResponseDto>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // For the Citizen Dashboard
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<List<ComplaintResponseDto>> getCitizenComplaints(@PathVariable Long citizenId) {
        return ResponseEntity.ok(complaintService.getComplaintsByCitizen(citizenId));
    }

    // For the Officer Dashboard
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getDepartmentComplaints(@PathVariable Long departmentId, @AuthenticationPrincipal UserDetails userDetails) {
        // 1. Fetch the logged-in officer from the DB using their email (username)
        User officer = userRepository.findByEmail(userDetails.getUsername()).orElseThrow(
                () -> new RuntimeException("Officer not found!")
        );
        // 2. SECURITY CHECK: Ensure the officer is assigned to the requested department
        boolean isAuthorized = officer.getAssignedDepartments().stream()
                .anyMatch(dept -> dept.getId().equals(departmentId));
        // 3. Admins bypass the check, but Officers are strictly blocked if unauthorized
        if (!isAuthorized && !officer.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Error: You are not authorized to view this department's queue.");
        }

        // 4. If authorized, proceed to fetch the complaints for this department
        return ResponseEntity.ok(complaintService.getComplaintsByDepartment(departmentId));
    }

    // For updating the status of a complaint
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id, @RequestBody UpdateStatusDto dto, @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User officer = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Officer not found!"));
            ComplaintResponseDto updatedComplaint = complaintService.updateComplaintStaus(id, dto.getStatus(), officer);
            return ResponseEntity.ok(updatedComplaint);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/remarks")
    public ResponseEntity<?> addRemark(
            @PathVariable Long id, @RequestBody RemarkRequestDto dto, @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User officer = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Officer not found!"));
            ComplaintResponseDto updatedComplaint = complaintService.addRemark(id, dto.getRemark(), officer);
            return ResponseEntity.ok(updatedComplaint);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAttachments(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User user = getCurrentUser(userDetails);
            return ResponseEntity.ok(attachmentService.upload(id, files, user));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException | IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<?> downloadAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User user = getCurrentUser(userDetails);
            ComplaintAttachment attachment = attachmentService.getAttachment(attachmentId, user);
            Resource resource = attachmentService.loadAttachment(attachmentId, user);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity<?> submitRating(
            @PathVariable Long id,
            @RequestBody RatingRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User citizen = getCurrentUser(userDetails);
            return ResponseEntity.ok(ratingService.submitRating(id, request, citizen));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
