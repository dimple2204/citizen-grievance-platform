package org.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatService {

    @Value("${nvidia.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getLokMitraResponse(String userMessage) {
        // Since the configured key (AIzaSy...) is a Google/Gemini API key, we call the Gemini API directly
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        // Construct Gemini request body structure
        Map<String, Object> requestBody = new HashMap<>();
        
        // System instruction to guide behavior
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", 
            "You are LokMitra, an official AI civic assistant for the LokShikayat GovTech platform in India. " +
            "Keep answers brief, polite, and focused only on civic issues and grievance filing. " +
            "Do not use markdown formatting."
        )));
        requestBody.put("systemInstruction", systemInstruction);

        // Contents (User message)
        Map<String, Object> part = new HashMap<>();
        part.put("text", userMessage);
        
        Map<String, Object> content = new HashMap<>();
        content.put("role", "user");
        content.put("parts", List.of(part));
        
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            request,
                            new ParameterizedTypeReference<>() {}
                    );

            Map<String, Object> body = response.getBody();

            if (body == null || !body.containsKey("candidates")) {
                return "No response received from AI service.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates.isEmpty()) {
                return "AI returned an empty response.";
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentObj.get("parts");

            if (parts == null || parts.isEmpty()) {
                return "AI returned empty text.";
            }

            return parts.get(0).get("text").toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Service temporarily unavailable. Please try again.";
        }
    }
}