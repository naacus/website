package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.DonationMockData;
import org.naacus.model.Donation;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.DonationRequest;
import org.naacus.model.dto.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/donations")
public class DonationController {

    @Autowired
    private DonationMockData donationMockData;

    @PostMapping
    public ResponseEntity<ApiResponse<Donation>> recordDonation(@Valid @RequestBody DonationRequest request) {
        Donation donation = Donation.builder()
                .transactionId(request.getTransactionId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .paymentProvider(request.getPaymentProvider())
                .paymentProviderTransactionId(request.getTransactionId())
                .donorName(request.getDonorName())
                .donorEmail(request.getDonorEmail())
                .isAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false)
                .message(request.getMessage())
                .build();

        Donation created = donationMockData.createDonation(donation);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Donation>>> getDonations(
            @RequestParam(defaultValue = "25") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        List<Donation> donations = donationMockData.getDonations(limit, offset, status, sortBy, sortOrder);
        int total = donationMockData.getTotalCount(status);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + donations.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(donations, pagination));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Donation>> getDonationById(@PathVariable String id) {
        Donation donation = donationMockData.getDonationById(id);
        if (donation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Donation not found"));
        }
        return ResponseEntity.ok(ApiResponse.success(donation));
    }
}
