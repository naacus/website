package org.naacus.data;

import org.naacus.model.ContactInquiry;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class ContactMockData {

    private final Map<String, ContactInquiry> inquiries = new ConcurrentHashMap<>();

    public ContactMockData() {
        // Initialize with sample data
        addInquiry(ContactInquiry.builder()
                .id(UUID.randomUUID().toString())
                .inquiryId("INQ-2024-001")
                .name("James Mwangi")
                .email("james.mwangi@example.com")
                .phone("(713) 555-1234")
                .topic("membership")
                .subject("Membership Renewal Question")
                .message("I would like to know how to renew my membership for 2025.")
                .status("responded")
                .notes("Sent renewal instructions via email")
                .createdAt(LocalDateTime.now().minusDays(10))
                .respondedOn(LocalDateTime.now().minusDays(8))
                .build());

        addInquiry(ContactInquiry.builder()
                .id(UUID.randomUUID().toString())
                .inquiryId("INQ-2024-002")
                .name("Fatima Diallo")
                .email("fatima.diallo@example.com")
                .phone("(312) 555-5678")
                .topic("events")
                .subject("Conference Registration")
                .message("Is group registration available for the 2025 conference?")
                .status("new")
                .createdAt(LocalDateTime.now().minusDays(2))
                .build());

        addInquiry(ContactInquiry.builder()
                .id(UUID.randomUUID().toString())
                .inquiryId("INQ-2024-003")
                .name("Emmanuel Osei")
                .email("emmanuel.osei@example.com")
                .topic("partnership")
                .subject("Partnership Opportunity")
                .message("Our organization would like to explore partnership opportunities with NAACUS.")
                .status("in_progress")
                .notes("Forwarded to partnership committee")
                .createdAt(LocalDateTime.now().minusDays(5))
                .build());
    }

    private void addInquiry(ContactInquiry inquiry) {
        inquiries.put(inquiry.getId(), inquiry);
    }

    public List<ContactInquiry> getAllInquiries() {
        return new ArrayList<>(inquiries.values());
    }

    public List<ContactInquiry> getInquiries(int limit, int offset, String status, String topic, String sortBy, String sortOrder) {
        return inquiries.values().stream()
                .filter(i -> status == null || i.getStatus().equalsIgnoreCase(status))
                .filter(i -> topic == null || i.getTopic().equalsIgnoreCase(topic))
                .sorted((i1, i2) -> {
                    int compare = 0;
                    if ("createdAt".equals(sortBy)) {
                        compare = i1.getCreatedAt().compareTo(i2.getCreatedAt());
                    }
                    return "desc".equalsIgnoreCase(sortOrder) ? -compare : compare;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public int getTotalCount(String status, String topic) {
        return (int) inquiries.values().stream()
                .filter(i -> status == null || i.getStatus().equalsIgnoreCase(status))
                .filter(i -> topic == null || i.getTopic().equalsIgnoreCase(topic))
                .count();
    }

    public ContactInquiry getInquiryById(String id) {
        return inquiries.get(id);
    }

    public ContactInquiry createInquiry(ContactInquiry inquiry) {
        inquiry.setId(UUID.randomUUID().toString());
        inquiry.setInquiryId("INQ-" + LocalDateTime.now().getYear() + "-" + String.format("%03d", inquiries.size() + 1));
        inquiry.setStatus("new");
        inquiry.setCreatedAt(LocalDateTime.now());
        inquiries.put(inquiry.getId(), inquiry);
        return inquiry;
    }

    public ContactInquiry updateInquiry(String id, String status, String notes) {
        ContactInquiry existing = inquiries.get(id);
        if (existing == null) return null;

        if (status != null) existing.setStatus(status);
        if (notes != null) existing.setNotes(notes);
        if ("responded".equals(status)) {
            existing.setRespondedOn(LocalDateTime.now());
        }

        return existing;
    }
}
