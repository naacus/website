package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.EventRegistrationMockData;
import org.naacus.model.EventRegistration;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.EventRegistrationRequest;
import org.naacus.model.dto.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Event Registration Controller
 * Handles event registrations only (event content is managed in SharePoint/Dataverse)
 */
@RestController
@RequestMapping("/api/v1/events")
public class EventManagementController {

    @Autowired
    private EventRegistrationMockData registrationMockData;

    @PostMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse<EventRegistration>> registerForEvent(
            @PathVariable String eventId,
            @Valid @RequestBody EventRegistrationRequest request) {

        EventRegistration registration = EventRegistration.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .attendees(request.getAttendees() != null ? request.getAttendees() : 1)
                .dietaryRequirements(request.getDietaryRequirements())
                .specialNeeds(request.getSpecialNeeds())
                .build();

        EventRegistration created = registrationMockData.createRegistration(eventId, registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<ApiResponse<List<EventRegistration>>> getEventRegistrations(
            @PathVariable String eventId,
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "registrationDate") String sortBy) {

        List<EventRegistration> registrations = registrationMockData.getRegistrationsByEvent(
                eventId, limit, offset, status, sortBy);
        int total = registrationMockData.getRegistrationCount(eventId, status);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + registrations.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(registrations, pagination));
    }
}
