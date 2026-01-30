package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.MembershipMockData;
import org.naacus.model.Member;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.MembershipRequest;
import org.naacus.model.dto.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/memberships")
public class MembershipController {

    @Autowired
    private MembershipMockData membershipMockData;

    @PostMapping
    public ResponseEntity<ApiResponse<Member>> createMembership(@Valid @RequestBody MembershipRequest request) {
        Member member = Member.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .country(request.getCountry())
                .membershipType(request.getMembershipType())
                .amountPaid(request.getAmountPaid())
                .paymentMethod(request.getPaymentMethod())
                .membershipYear(request.getMembershipYear() != null ? request.getMembershipYear() : java.time.LocalDateTime.now().getYear())
                .build();

        Member created = membershipMockData.createMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Member>>> getMemberships(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        List<Member> members = membershipMockData.getMembers(limit, offset, status, year, sortBy, sortOrder);
        int total = membershipMockData.getTotalCount(status, year);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + members.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(members, pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Member>> getMembershipById(@PathVariable String id) {
        Member member = membershipMockData.getMemberById(id);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Membership not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(member));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Member>> updateMembership(
            @PathVariable String id,
            @RequestBody MembershipRequest request) {

        Member updates = Member.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .membershipType(request.getMembershipType())
                .build();

        Member updated = membershipMockData.updateMember(id, updates);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Membership not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteMembership(@PathVariable String id) {
        boolean deleted = membershipMockData.deleteMember(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Membership not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(java.util.Map.of("message", "Membership deleted successfully")));
    }
}
