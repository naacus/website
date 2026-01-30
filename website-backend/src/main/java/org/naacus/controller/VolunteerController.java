package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.VolunteerMockData;
import org.naacus.model.Volunteer;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.Pagination;
import org.naacus.model.dto.VolunteerRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/volunteers")
public class VolunteerController {

    @Autowired
    private VolunteerMockData volunteerMockData;

    @PostMapping
    public ResponseEntity<ApiResponse<Volunteer>> createVolunteer(@Valid @RequestBody VolunteerRequest request) {
        Volunteer volunteer = Volunteer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .city(request.getCity())
                .state(request.getState())
                .skills(request.getSkills())
                .interests(request.getInterests())
                .availability(request.getAvailability())
                .build();

        Volunteer created = volunteerMockData.createVolunteer(volunteer);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Volunteer>>> getVolunteers(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        List<Volunteer> volunteers = volunteerMockData.getVolunteers(limit, offset, status, sortBy);
        int total = volunteerMockData.getTotalCount(status);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + volunteers.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(volunteers, pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Volunteer>> getVolunteerById(@PathVariable String id) {
        Volunteer volunteer = volunteerMockData.getVolunteerById(id);
        if (volunteer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer application not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(volunteer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Volunteer>> updateVolunteer(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {

        Volunteer updateData = Volunteer.builder()
                .status((String) updates.get("status"))
                .backgroundCheckStatus((String) updates.get("backgroundCheckStatus"))
                .build();

        Volunteer updated = volunteerMockData.updateVolunteer(id, updateData);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Volunteer application not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(updated));
    }
}
