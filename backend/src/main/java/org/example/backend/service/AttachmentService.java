package org.example.backend.service;

import org.example.backend.dto.ComplaintAttachmentDto;
import org.example.backend.entity.Complaint;
import org.example.backend.entity.ComplaintAttachment;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.ComplaintAttachmentRepository;
import org.example.backend.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AttachmentService {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "application/pdf");
    private final ComplaintAttachmentRepository attachmentRepository;
    private final ComplaintRepository complaintRepository;
    private final Path uploadRoot;

    public AttachmentService(
            ComplaintAttachmentRepository attachmentRepository,
            ComplaintRepository complaintRepository,
            @Value("${lokshikayat.upload-dir:uploads/complaints}") String uploadDir
    ) {
        this.attachmentRepository = attachmentRepository;
        this.complaintRepository = complaintRepository;
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public List<ComplaintAttachmentDto> upload(Long complaintId, List<MultipartFile> files, User user) throws IOException {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        validateAccess(complaint, user);

        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one file is required.");
        }

        Files.createDirectories(uploadRoot);

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            validateFile(file);
            String originalName = Paths.get(file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename()).getFileName().toString();
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) extension = originalName.substring(dotIndex);
            String storedName = complaintId + "-" + UUID.randomUUID() + extension;
            Path target = uploadRoot.resolve(storedName).normalize();
            file.transferTo(target);

            ComplaintAttachment attachment = new ComplaintAttachment();
            attachment.setComplaint(complaint);
            attachment.setOriginalFileName(originalName);
            attachment.setStoredFileName(storedName);
            attachment.setContentType(file.getContentType());
            attachment.setSizeBytes(file.getSize());
            attachment.setStoragePath(target.toString());
            attachmentRepository.save(attachment);
        }

        return getForComplaint(complaintId);
    }

    public List<ComplaintAttachmentDto> getForComplaint(Long complaintId) {
        return attachmentRepository.findByComplaintIdOrderByUploadedAtAsc(complaintId).stream()
                .map(this::mapToDto)
                .toList();
    }

    public Resource loadAttachment(Long attachmentId, User user) throws MalformedURLException {
        ComplaintAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
        validateAccess(attachment.getComplaint(), user);
        Resource resource = new UrlResource(Paths.get(attachment.getStoragePath()).toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new IllegalArgumentException("Attachment file is not available.");
        }
        return resource;
    }

    public ComplaintAttachment getAttachment(Long attachmentId, User user) {
        ComplaintAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
        validateAccess(attachment.getComplaint(), user);
        return attachment;
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only images and PDF files are allowed.");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Each attachment must be 5MB or smaller.");
        }
    }

    private void validateAccess(Complaint complaint, User user) {
        if (user.getRole().equals(Role.ADMIN)) return;
        if (user.getRole().equals(Role.CITIZEN) && complaint.getCitizen().getId().equals(user.getId())) return;
        if (user.getRole().equals(Role.OFFICER) && user.getAssignedDepartments().stream()
                .anyMatch(department -> department.getId().equals(complaint.getDepartment().getId()))) return;
        throw new SecurityException("You are not authorized to access these attachments.");
    }

    private ComplaintAttachmentDto mapToDto(ComplaintAttachment attachment) {
        return new ComplaintAttachmentDto(
                attachment.getId(),
                attachment.getOriginalFileName(),
                attachment.getContentType(),
                attachment.getSizeBytes(),
                attachment.getUploadedAt(),
                "/complaints/attachments/" + attachment.getId()
        );
    }
}
