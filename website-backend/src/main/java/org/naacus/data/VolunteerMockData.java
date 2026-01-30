package org.naacus.data;

import org.naacus.model.Volunteer;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class VolunteerMockData {

    private final Map<String, Volunteer> volunteers = new ConcurrentHashMap<>();

    public VolunteerMockData() {
        // Initialize with sample data
        addVolunteer(Volunteer.builder()
                .id(UUID.randomUUID().toString())
                .applicationId("VOL-2024-001")
                .firstName("Maria")
                .lastName("Diallo")
                .email("maria.diallo@example.com")
                .phone("(202) 555-0101")
                .city("Washington")
                .state("DC")
                .skills(Arrays.asList("Teaching", "Event Planning", "Translation"))
                .interests(Arrays.asList("Youth Ministry", "Cultural Events"))
                .availability(Arrays.asList("Weekends", "Evenings"))
                .status("approved")
                .backgroundCheckStatus("approved")
                .createdAt(LocalDateTime.now().minusDays(30))
                .submittedOn(LocalDateTime.now().minusDays(30))
                .build());

        addVolunteer(Volunteer.builder()
                .id(UUID.randomUUID().toString())
                .applicationId("VOL-2024-002")
                .firstName("David")
                .lastName("Kimani")
                .email("david.kimani@example.com")
                .phone("(214) 555-0202")
                .city("Dallas")
                .state("TX")
                .skills(Arrays.asList("Music", "Sound Engineering"))
                .interests(Arrays.asList("Liturgy", "Music Ministry"))
                .availability(Arrays.asList("Sundays", "Special Events"))
                .status("pending_review")
                .backgroundCheckStatus("pending")
                .createdAt(LocalDateTime.now().minusDays(5))
                .submittedOn(LocalDateTime.now().minusDays(5))
                .build());
    }

    private void addVolunteer(Volunteer volunteer) {
        volunteers.put(volunteer.getId(), volunteer);
    }

    public List<Volunteer> getAllVolunteers() {
        return new ArrayList<>(volunteers.values());
    }

    public List<Volunteer> getVolunteers(int limit, int offset, String status, String sortBy) {
        return volunteers.values().stream()
                .filter(v -> status == null || v.getStatus().equalsIgnoreCase(status))
                .sorted((v1, v2) -> {
                    if ("createdAt".equals(sortBy)) {
                        return v2.getCreatedAt().compareTo(v1.getCreatedAt());
                    }
                    return 0;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public int getTotalCount(String status) {
        return (int) volunteers.values().stream()
                .filter(v -> status == null || v.getStatus().equalsIgnoreCase(status))
                .count();
    }

    public Volunteer getVolunteerById(String id) {
        return volunteers.get(id);
    }

    public Volunteer createVolunteer(Volunteer volunteer) {
        volunteer.setId(UUID.randomUUID().toString());
        volunteer.setApplicationId("VOL-" + LocalDateTime.now().getYear() + "-" + String.format("%03d", volunteers.size() + 1));
        volunteer.setStatus("pending_review");
        volunteer.setBackgroundCheckStatus("pending");
        volunteer.setCreatedAt(LocalDateTime.now());
        volunteer.setSubmittedOn(LocalDateTime.now());
        volunteers.put(volunteer.getId(), volunteer);
        return volunteer;
    }

    public Volunteer updateVolunteer(String id, Volunteer updates) {
        Volunteer existing = volunteers.get(id);
        if (existing == null) return null;

        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getBackgroundCheckStatus() != null) existing.setBackgroundCheckStatus(updates.getBackgroundCheckStatus());
        if (updates.getSkills() != null) existing.setSkills(updates.getSkills());
        if (updates.getInterests() != null) existing.setInterests(updates.getInterests());
        if (updates.getAvailability() != null) existing.setAvailability(updates.getAvailability());

        return existing;
    }
}
