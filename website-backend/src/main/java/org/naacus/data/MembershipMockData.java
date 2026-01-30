package org.naacus.data;

import org.naacus.model.Member;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class MembershipMockData {

    private final Map<String, Member> members = new ConcurrentHashMap<>();

    public MembershipMockData() {
        // Initialize with sample data
        addMember(Member.builder()
                .id(UUID.randomUUID().toString())
                .memberId("MEM-2024-001")
                .firstName("John")
                .lastName("Okonkwo")
                .email("john.okonkwo@example.com")
                .phone("(713) 555-0101")
                .address("123 Main St")
                .city("Houston")
                .state("TX")
                .zipCode("77001")
                .country("USA")
                .membershipType("individual")
                .amountPaid(50.00)
                .paymentMethod("card")
                .status("active")
                .membershipYear(2024)
                .joinDate(LocalDateTime.of(2024, 1, 15, 10, 0))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        addMember(Member.builder()
                .id(UUID.randomUUID().toString())
                .memberId("MEM-2024-002")
                .firstName("Grace")
                .lastName("Amadi")
                .email("grace.amadi@example.com")
                .phone("(312) 555-0202")
                .address("456 Oak Ave")
                .city("Chicago")
                .state("IL")
                .zipCode("60601")
                .country("USA")
                .membershipType("family")
                .amountPaid(100.00)
                .paymentMethod("paypal")
                .status("active")
                .membershipYear(2024)
                .joinDate(LocalDateTime.of(2024, 2, 20, 14, 30))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        addMember(Member.builder()
                .id(UUID.randomUUID().toString())
                .memberId("MEM-2024-003")
                .firstName("Samuel")
                .lastName("Mensah")
                .email("samuel.mensah@example.com")
                .phone("(404) 555-0303")
                .address("789 Pine Rd")
                .city("Atlanta")
                .state("GA")
                .zipCode("30301")
                .country("USA")
                .membershipType("student")
                .amountPaid(25.00)
                .paymentMethod("card")
                .status("active")
                .membershipYear(2024)
                .joinDate(LocalDateTime.of(2024, 3, 10, 9, 15))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());
    }

    private void addMember(Member member) {
        members.put(member.getId(), member);
    }

    public List<Member> getAllMembers() {
        return new ArrayList<>(members.values());
    }

    public List<Member> getMembers(int limit, int offset, String status, Integer year, String sortBy, String sortOrder) {
        List<Member> result = members.values().stream()
                .filter(m -> status == null || m.getStatus().equalsIgnoreCase(status))
                .filter(m -> year == null || m.getMembershipYear().equals(year))
                .sorted((m1, m2) -> {
                    int compare = 0;
                    if ("createdAt".equals(sortBy)) {
                        compare = m1.getCreatedAt().compareTo(m2.getCreatedAt());
                    } else if ("lastName".equals(sortBy)) {
                        compare = m1.getLastName().compareTo(m2.getLastName());
                    }
                    return "desc".equalsIgnoreCase(sortOrder) ? -compare : compare;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
        return result;
    }

    public int getTotalCount(String status, Integer year) {
        return (int) members.values().stream()
                .filter(m -> status == null || m.getStatus().equalsIgnoreCase(status))
                .filter(m -> year == null || m.getMembershipYear().equals(year))
                .count();
    }

    public Member getMemberById(String id) {
        return members.get(id);
    }

    public Member createMember(Member member) {
        member.setId(UUID.randomUUID().toString());
        member.setMemberId("MEM-" + LocalDateTime.now().getYear() + "-" + String.format("%03d", members.size() + 1));
        member.setStatus("pending");
        member.setJoinDate(LocalDateTime.now());
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());
        members.put(member.getId(), member);
        return member;
    }

    public Member updateMember(String id, Member updates) {
        Member existing = members.get(id);
        if (existing == null) return null;

        if (updates.getFirstName() != null) existing.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) existing.setLastName(updates.getLastName());
        if (updates.getEmail() != null) existing.setEmail(updates.getEmail());
        if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
        if (updates.getAddress() != null) existing.setAddress(updates.getAddress());
        if (updates.getCity() != null) existing.setCity(updates.getCity());
        if (updates.getState() != null) existing.setState(updates.getState());
        if (updates.getZipCode() != null) existing.setZipCode(updates.getZipCode());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getMembershipType() != null) existing.setMembershipType(updates.getMembershipType());
        existing.setUpdatedAt(LocalDateTime.now());

        return existing;
    }

    public boolean deleteMember(String id) {
        return members.remove(id) != null;
    }
}
