package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.Volunteer;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Volunteer entities in Dataverse.
 */
@Repository
public class VolunteerRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.volunteers:naacus_volunteers}")
    private String tableName;

    @Autowired
    public VolunteerRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public Volunteer create(Volunteer volunteer) throws Exception {
        Map<String, Object> data = toDataverseMap(volunteer);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public Optional<Volunteer> findById(String id) throws Exception {
        return dataverseService.getById(tableName, id).map(this::fromDataverse);
    }

    public List<Volunteer> findAll(int limit, int offset, String status, String sortBy) throws Exception {
        String filter = status != null ? "naacus_status eq '" + status + "'" : null;
        String orderBy = mapSortField(sortBy) + " desc";

        JsonNode result = dataverseService.query(tableName, filter, null, orderBy, limit, offset);
        
        List<Volunteer> volunteers = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                volunteers.add(fromDataverse(node));
            }
        }
        return volunteers;
    }

    public int count(String status) throws Exception {
        String filter = status != null ? "naacus_status eq '" + status + "'" : null;
        return dataverseService.getCount(tableName, filter);
    }

    public Volunteer update(String id, Volunteer volunteer) throws Exception {
        Map<String, Object> data = toDataverseMap(volunteer);
        JsonNode result = dataverseService.update(tableName, id, data);
        return fromDataverse(result);
    }

    private Map<String, Object> toDataverseMap(Volunteer volunteer) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_firstname", volunteer.getFirstName());
        map.put("naacus_lastname", volunteer.getLastName());
        map.put("naacus_email", volunteer.getEmail());
        map.put("naacus_phone", volunteer.getPhone());
        map.put("naacus_city", volunteer.getCity());
        map.put("naacus_state", volunteer.getState());
        map.put("naacus_skills", volunteer.getSkills() != null ? String.join(",", volunteer.getSkills()) : null);
        map.put("naacus_interests", volunteer.getInterests() != null ? String.join(",", volunteer.getInterests()) : null);
        map.put("naacus_availability", volunteer.getAvailability() != null ? String.join(",", volunteer.getAvailability()) : null);
        map.put("naacus_status", volunteer.getStatus());
        map.put("naacus_backgroundcheckstatus", volunteer.getBackgroundCheckStatus());
        return map;
    }

    private Volunteer fromDataverse(JsonNode node) {
        String interestsStr = getTextValue(node, "naacus_interests");
        String skillsStr = getTextValue(node, "naacus_skills");
        String availabilityStr = getTextValue(node, "naacus_availability");

        return Volunteer.builder()
                .id(getTextValue(node, "naacus_volunteersid"))
                .applicationId(getTextValue(node, "naacus_applicationid"))
                .firstName(getTextValue(node, "naacus_firstname"))
                .lastName(getTextValue(node, "naacus_lastname"))
                .email(getTextValue(node, "naacus_email"))
                .phone(getTextValue(node, "naacus_phone"))
                .city(getTextValue(node, "naacus_city"))
                .state(getTextValue(node, "naacus_state"))
                .skills(skillsStr != null ? Arrays.asList(skillsStr.split(",")) : null)
                .interests(interestsStr != null ? Arrays.asList(interestsStr.split(",")) : null)
                .availability(availabilityStr != null ? Arrays.asList(availabilityStr.split(",")) : null)
                .status(getTextValue(node, "naacus_status"))
                .backgroundCheckStatus(getTextValue(node, "naacus_backgroundcheckstatus"))
                .createdAt(parseDateTime(getTextValue(node, "createdon")))
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
            case "createdAt", "submittedAt" -> "createdon";
            case "lastName" -> "naacus_lastname";
            default -> "createdon";
        };
    }
}
