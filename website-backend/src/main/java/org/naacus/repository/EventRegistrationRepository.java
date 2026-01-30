package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.EventRegistration;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Event Registration entities in Dataverse.
 */
@Repository
public class EventRegistrationRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.event-registrations:naacus_eventregistrations}")
    private String tableName;

    @Autowired
    public EventRegistrationRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public EventRegistration create(String eventId, EventRegistration registration) throws Exception {
        Map<String, Object> data = toDataverseMap(registration);
        data.put("naacus_eventid", eventId);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public List<EventRegistration> findByEventId(String eventId, int limit, int offset, String status, String sortBy) throws Exception {
        StringBuilder filter = new StringBuilder("naacus_eventid eq '").append(eventId).append("'");
        
        if (status != null && !status.isEmpty()) {
            filter.append(" and naacus_status eq '").append(status).append("'");
        }

        String orderBy = mapSortField(sortBy) + " desc";

        JsonNode result = dataverseService.query(tableName, filter.toString(), null, orderBy, limit, offset);
        
        List<EventRegistration> registrations = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                registrations.add(fromDataverse(node));
            }
        }
        return registrations;
    }

    public int countByEventId(String eventId, String status) throws Exception {
        StringBuilder filter = new StringBuilder("naacus_eventid eq '").append(eventId).append("'");
        if (status != null) {
            filter.append(" and naacus_status eq '").append(status).append("'");
        }
        return dataverseService.getCount(tableName, filter.toString());
    }

    private Map<String, Object> toDataverseMap(EventRegistration registration) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_firstname", registration.getFirstName());
        map.put("naacus_lastname", registration.getLastName());
        map.put("naacus_email", registration.getEmail());
        map.put("naacus_phone", registration.getPhone());
        map.put("naacus_attendees", registration.getAttendees());
        map.put("naacus_dietaryrequirements", registration.getDietaryRequirements());
        map.put("naacus_specialneeds", registration.getSpecialNeeds());
        map.put("naacus_status", registration.getStatus() != null ? registration.getStatus() : "confirmed");
        return map;
    }

    private EventRegistration fromDataverse(JsonNode node) {
        return EventRegistration.builder()
                .id(getTextValue(node, "naacus_eventregistrationsid"))
                .registrationId(getTextValue(node, "naacus_registrationid"))
                .eventId(getTextValue(node, "naacus_eventid"))
                .firstName(getTextValue(node, "naacus_firstname"))
                .lastName(getTextValue(node, "naacus_lastname"))
                .email(getTextValue(node, "naacus_email"))
                .phone(getTextValue(node, "naacus_phone"))
                .attendees(node.has("naacus_attendees") ? node.get("naacus_attendees").asInt() : 1)
                .dietaryRequirements(getTextValue(node, "naacus_dietaryrequirements"))
                .specialNeeds(getTextValue(node, "naacus_specialneeds"))
                .status(getTextValue(node, "naacus_status"))
                .registrationDate(parseDateTime(getTextValue(node, "createdon")))
                .build();
    }

    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null) return null;
        try {
            return LocalDateTime.parse(dateStr.replace("Z", ""));
        } catch (Exception e) {
            return null;
        }
    }

    private String getTextValue(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : null;
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null) return "createdon";
        return switch (sortBy) {
            case "registrationDate", "createdAt" -> "createdon";
            case "lastName" -> "naacus_lastname";
            default -> "createdon";
        };
    }
}
