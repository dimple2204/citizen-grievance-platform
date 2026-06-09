package org.example.backend.controller;

import org.example.backend.dto.CreatePostDto;
import org.example.backend.entity.CommunityPost;
import org.example.backend.entity.PollOption;
import org.example.backend.entity.Role;
import org.example.backend.entity.User;
import org.example.backend.repository.CommunityPostRepository;
import org.example.backend.repository.PollOptionRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Get the feed of community posts
    @GetMapping("/feed")
    public ResponseEntity<List<CommunityPost>> getCommunityFeed(@RequestParam(defaultValue = "Ward 15 - Patia") String ward) {
        List<CommunityPost> feed = postRepository.findByWardOrderByCreatedAtDesc(ward);
        return ResponseEntity.ok(feed);
    }

    // 2. Handle voting on a poll option
    @PostMapping("/poll/vote/{optionId}")
    public ResponseEntity<?> voteOnPoll(@PathVariable Long optionId) {
        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));
        option.incrementVotes(); // Add a vote
        pollOptionRepository.save(option); // Save to DB

        return ResponseEntity.ok("Vote successfully recorded!");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody CreatePostDto request, @AuthenticationPrincipal UserDetails userDetails) {
        User publisher = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Publisher not found"));

        if (!publisher.getRole().equals(Role.OFFICER) && !publisher.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only officers and admins can publish community posts.");
        }

        Set<String> allowedTypes = Set.of("BROADCAST", "EVENT", "POLL");
        String postType = request.getType() == null ? "" : request.getType().trim().toUpperCase();
        List<String> pollOptions = request.getPollOptions() == null ? List.of() : request.getPollOptions().stream()
                .map(String::trim)
                .filter(option -> !option.isEmpty())
                .toList();

        if (!allowedTypes.contains(postType)) {
            return ResponseEntity.badRequest().body("Invalid post type. Use BROADCAST, EVENT, or POLL.");
        }

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()
                || request.getContent() == null || request.getContent().trim().isEmpty()
                || request.getWard() == null || request.getWard().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title, content, and ward are required.");
        }

        if ("POLL".equals(postType) && pollOptions.size() < 2) {
            return ResponseEntity.badRequest().body("Polls require at least two options.");
        }

        CommunityPost post = new CommunityPost();
        post.setType(postType);
        post.setAuthor(request.getAuthor() == null || request.getAuthor().trim().isEmpty()
                ? publisher.getFullName()
                : request.getAuthor().trim());
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setCategory(request.getCategory());
        post.setWard(request.getWard().trim());
        post.setEventDate(request.getEventDate());

        // If the post is a POLL, we must generate and attach the PollOption entities
        if ("POLL".equals(postType)) {
            List<PollOption> options = pollOptions.stream().map(optText -> {
                PollOption option = new PollOption();
                option.setText(optText);
                option.setPost(post);
                return option;
            }).collect(Collectors.toList());

            post.setPollOptions(options);
        }

        // Because we set CascadeType.ALL in the CommunityPost entity,
        // saving the post will automatically save all the poll options too!
        postRepository.save(post);

        return ResponseEntity.ok("Community post published successfully!");
    }
}
