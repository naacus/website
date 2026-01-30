package org.naacus.data;

import org.naacus.model.Donation;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class DonationMockData {

    private final Map<String, Donation> donations = new ConcurrentHashMap<>();

    public DonationMockData() {
        // Initialize with sample data
        addDonation(Donation.builder()
                .id(UUID.randomUUID().toString())
                .transactionId("stripe_pi_12345abcde")
                .amount(100.00)
                .currency("USD")
                .paymentMethod("card")
                .paymentProvider("stripe")
                .paymentProviderTransactionId("pi_12345abcde")
                .status("completed")
                .donorName("John Okonkwo")
                .donorEmail("john.okonkwo@example.com")
                .isAnonymous(false)
                .message("Supporting NAACUS mission")
                .donationType("one-time")
                .createdAt(LocalDateTime.now().minusDays(15))
                .build());

        addDonation(Donation.builder()
                .id(UUID.randomUUID().toString())
                .transactionId("paypal_order_67890fghij")
                .amount(50.00)
                .currency("USD")
                .paymentMethod("paypal")
                .paymentProvider("paypal")
                .paymentProviderTransactionId("67890fghij")
                .status("completed")
                .donorName("Grace Amadi")
                .donorEmail("grace.amadi@example.com")
                .isAnonymous(false)
                .donationType("monthly")
                .createdAt(LocalDateTime.now().minusDays(10))
                .build());

        addDonation(Donation.builder()
                .id(UUID.randomUUID().toString())
                .transactionId("coinbase_charge_xyz123")
                .amount(250.00)
                .currency("USD")
                .paymentMethod("crypto")
                .paymentProvider("coinbase")
                .paymentProviderTransactionId("xyz123")
                .status("completed")
                .donorName("Anonymous Donor")
                .donorEmail("anonymous@example.com")
                .isAnonymous(true)
                .message("God bless NAACUS")
                .donationType("one-time")
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());
    }

    private void addDonation(Donation donation) {
        donations.put(donation.getId(), donation);
    }

    public List<Donation> getAllDonations() {
        return new ArrayList<>(donations.values());
    }

    public List<Donation> getDonations(int limit, int offset, String status, String sortBy, String sortOrder) {
        return donations.values().stream()
                .filter(d -> status == null || d.getStatus().equalsIgnoreCase(status))
                .sorted((d1, d2) -> {
                    int compare = 0;
                    if ("createdAt".equals(sortBy)) {
                        compare = d1.getCreatedAt().compareTo(d2.getCreatedAt());
                    } else if ("amount".equals(sortBy)) {
                        compare = d1.getAmount().compareTo(d2.getAmount());
                    }
                    return "desc".equalsIgnoreCase(sortOrder) ? -compare : compare;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public int getTotalCount(String status) {
        return (int) donations.values().stream()
                .filter(d -> status == null || d.getStatus().equalsIgnoreCase(status))
                .count();
    }

    public Donation getDonationById(String id) {
        return donations.get(id);
    }

    public Donation createDonation(Donation donation) {
        donation.setId(UUID.randomUUID().toString());
        donation.setStatus("completed");
        donation.setCurrency(donation.getCurrency() != null ? donation.getCurrency() : "USD");
        donation.setDonationType("one-time");
        donation.setCreatedAt(LocalDateTime.now());
        donations.put(donation.getId(), donation);
        return donation;
    }
}
