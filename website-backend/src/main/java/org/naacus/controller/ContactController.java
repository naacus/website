package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.ContactMockData;
import org.naacus.model.ContactInquiry;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.ContactRequest;
import org.naacus.model.dto.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    @Autowired
    private ContactMockData contactMockData;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactInquiry>> submitContact(@Valid @RequestBody ContactRequest request) {
        ContactInquiry inquiry = ContactInquiry.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .topic(request.getTopic())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();

        ContactInquiry created = contactMockData.createInquiry(inquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactInquiry>>> getContacts(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String topic,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        List<ContactInquiry> inquiries = contactMockData.getInquiries(limit, offset, status, topic, sortBy, sortOrder);
        int total = contactMockData.getTotalCount(status, topic);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + inquiries.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(inquiries, pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactInquiry>> getContactById(@PathVariable String id) {
        ContactInquiry inquiry = contactMockData.getInquiryById(id);
        if (inquiry == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Contact inquiry not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(inquiry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactInquiry>> updateContact(
            @PathVariable String id,
            @RequestBody Map<String, String> updates) {

        ContactInquiry updated = contactMockData.updateInquiry(
                id,
                updates.get("status"),
                updates.get("notes")
        );

        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Contact inquiry not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(updated));
    }
}
