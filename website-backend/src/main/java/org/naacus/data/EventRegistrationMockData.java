package org.naacus.data;

import org.naacus.model.EventRegistration;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class EventRegistrationMockData {

    private final Map<String, EventRegistration> registrations = new ConcurrentHashMap<>();

    public EventRegistrationMockData() {
        // Initialize with sample data for NAACUS 2025 conference
        addRegistration(EventRegistration.builder()
                .id(UUID.randomUUID().toString())
                .registrationId("REG-2025-001")
                .eventId("naacus-2025")
                .firstName("John")
                .lastName("Okonkwo")
                .email("john.okonkwo@example.com")
                .phone("(713) 555-0101")
                .attendees(2)
                .dietaryRequirements("None")
                .status("confirmed")
                .registrationDate(LocalDateTime.now().minusDays(30))
                .build());

        addRegistration(EventRegistration.builder()
                .id(UUID.randomUUID().toString())
                .registrationId("REG-2025-002")
                .eventId("naacus-2025")
                .firstName("Grace")
                .lastName("Amadi")
                .email("grace.amadi@example.com")
                .phone("(312) 555-0202")
                .attendees(4)
                .dietaryRequirements("Vegetarian")
                .specialNeeds("Wheelchair accessible seating")
                .status("confirmed")
                .registrationDate(LocalDateTime.now().minusDays(25))
                .build());

        addRegistration(EventRegistration.builder()
                .id(UUID.randomUUID().toString())
                .registrationId("REG-2025-003")
                .eventId("youth-retreat-2025")
                .firstName("Samuel")
                .lastName("Mensah")
                .email("samuel.mensah@example.com")
                .phone("(404) 555-0303")
                .attendees(1)
                .status("pending")
                .registrationDate(LocalDateTime.now().minusDays(10))
                .build());
    }

    private void addRegistration(EventRegistration registration) {
        registrations.put(registration.getId(), registration);
    }

    public List<EventRegistration> getRegistrationsByEvent(String eventId, int limit, int offset, String status, String sortBy) {
        return registrations.values().stream()
                .filter(r -> r.getEventId().equals(eventId))
                .filter(r -> status == null || r.getStatus().equalsIgnoreCase(status))
                .sorted((r1, r2) -> {
                    if ("registrationDate".equals(sortBy)) {
                        return r2.getRegistrationDate().compareTo(r1.getRegistrationDate());
                    }
                    return 0;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public int getRegistrationCount(String eventId, String status) {
        return (int) registrations.values().stream()
                .filter(r -> r.getEventId().equals(eventId))
                .filter(r -> status == null || r.getStatus().equalsIgnoreCase(status))
                .count();
    }

    public EventRegistration getRegistrationById(String id) {
        return registrations.get(id);
    }

    public EventRegistration createRegistration(String eventId, EventRegistration registration) {
        registration.setId(UUID.randomUUID().toString());
        registration.setRegistrationId("REG-" + LocalDateTime.now().getYear() + "-" + String.format("%03d", registrations.size() + 1));
        registration.setEventId(eventId);
        registration.setStatus("confirmed");
        registration.setRegistrationDate(LocalDateTime.now());
        registrations.put(registration.getId(), registration);
        return registration;
    }
}
