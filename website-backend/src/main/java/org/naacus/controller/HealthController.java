package org.naacus.controller;

import org.naacus.model.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", "NAACUS Backend API");
        health.put("version", "1.0.0");
        health.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(ApiResponse.success(health));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "NAACUS Backend API");
        info.put("description", "REST API for NAACUS Website - Business Logic APIs");
        info.put("version", "1.0.0");
        info.put("baseUrl", "https://api.naacus.org/v1");
        info.put("documentation", "https://test.naacus.org/backend-api-contract.html");
        
        // V1 API Endpoints (Business Logic Only)
        info.put("endpoints", new String[]{
                // Membership Management
                "POST   /api/v1/memberships",
                "GET    /api/v1/memberships",
                "GET    /api/v1/memberships/{id}",
                "PUT    /api/v1/memberships/{id}",
                "DELETE /api/v1/memberships/{id}",
                // Volunteer Management
                "POST   /api/v1/volunteers",
                "GET    /api/v1/volunteers",
                "GET    /api/v1/volunteers/{id}",
                "PUT    /api/v1/volunteers/{id}",
                // Newsletter Management
                "POST   /api/v1/newsletter/subscribe",
                "GET    /api/v1/newsletter/subscribers",
                "POST   /api/v1/newsletter/unsubscribe",
                // Contact Management
                "POST   /api/v1/contact",
                "GET    /api/v1/contact",
                "GET    /api/v1/contact/{id}",
                "PUT    /api/v1/contact/{id}",
                // Event Registration
                "GET    /api/v1/events",
                "GET    /api/v1/events/{id}",
                "POST   /api/v1/events/{id}/register",
                "GET    /api/v1/events/{eventId}/registrations",
                // Donations
                "POST   /api/v1/donations",
                "GET    /api/v1/donations",
                "GET    /api/v1/donations/{id}"
        });
        
        return ResponseEntity.ok(info);
    }
    
    @GetMapping("/v1")
    public ResponseEntity<ApiResponse<Map<String, Object>>> v1ApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "NAACUS Backend API v1");
        info.put("version", "1.0.0");
        info.put("status", "Ready for Implementation");
        info.put("architecture", "Microsoft Dataverse/SharePoint");
        info.put("documentation", "https://test.naacus.org/backend-api-contract.html");
        info.put("endpoints", Map.of(
                "memberships", "/api/v1/memberships",
                "volunteers", "/api/v1/volunteers",
                "newsletter", "/api/v1/newsletter",
                "contact", "/api/v1/contact",
                "events", "/api/v1/events",
                "donations", "/api/v1/donations"
        ));
        return ResponseEntity.ok(ApiResponse.success(info));
    }
}
