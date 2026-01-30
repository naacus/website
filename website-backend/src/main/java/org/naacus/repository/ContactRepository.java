package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.ContactInquiry;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Contact Inquiry entities in Dataverse.
 */
@Repository
public class ContactRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.contacts:naacus_contactinquiries}")
    private String tableName;

    @Autowired
    public ContactRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public ContactInquiry create(ContactInquiry inquiry) throws Exception {
        Map<String, Object> data = toDataverseMap(inquiry);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public Optional<ContactInquiry> findById(String id) throws Exception {
        return dataverseService.getById(tableName, id).map(this::fromDataverse);
    }

    public List<ContactInquiry> findAll(int limit, int offset, String status, String topic, String sortBy, String sortOrder) throws Exception {
        StringBuilder filter = new StringBuilder();
        
        if (status != null && !status.isEmpty()) {
            filter.append("naacus_status eq '").append(status).append("'");
        }
        if (topic != null && !topic.isEmpty()) {
            if (filter.length() > 0) filter.append(" and ");
            filter.append("naacus_topic eq '").append(topic).append("'");
        }

        String orderBy = mapSortField(sortBy) + " " + (sortOrder != null ? sortOrder : "desc");

        JsonNode result = dataverseService.query(tableName, filter.toString(), null, orderBy, limit, offset);
        
        List<ContactInquiry> inquiries = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                inquiries.add(fromDataverse(node));
            }
        }
        return inquiries;
    }

    public int count(String status, String topic) throws Exception {
        StringBuilder filter = new StringBuilder();
        if (status != null) {
            filter.append("naacus_status eq '").append(status).append("'");
        }
        if (topic != null) {
            if (filter.length() > 0) filter.append(" and ");
            filter.append("naacus_topic eq '").append(topic).append("'");
        }
        return dataverseService.getCount(tableName, filter.length() > 0 ? filter.toString() : null);
    }

    public ContactInquiry update(String id, ContactInquiry inquiry) throws Exception {
        Map<String, Object> data = toDataverseMap(inquiry);
        JsonNode result = dataverseService.update(tableName, id, data);
        return fromDataverse(result);
    }

    private Map<String, Object> toDataverseMap(ContactInquiry inquiry) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_name", inquiry.getName());
        map.put("naacus_email", inquiry.getEmail());
        map.put("naacus_topic", inquiry.getTopic());
        map.put("naacus_subject", inquiry.getSubject());
        map.put("naacus_message", inquiry.getMessage());
        map.put("naacus_status", inquiry.getStatus());
        return map;
    }

    private ContactInquiry fromDataverse(JsonNode node) {
        return ContactInquiry.builder()
                .id(getTextValue(node, "naacus_contactinquiriesid"))
                .inquiryId(getTextValue(node, "naacus_inquiryid"))
                .name(getTextValue(node, "naacus_name"))
                .email(getTextValue(node, "naacus_email"))
                .phone(getTextValue(node, "naacus_phone"))
                .topic(getTextValue(node, "naacus_topic"))
                .subject(getTextValue(node, "naacus_subject"))
                .message(getTextValue(node, "naacus_message"))
                .status(getTextValue(node, "naacus_status"))
                .notes(getTextValue(node, "naacus_notes"))
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
            case "topic" -> "naacus_topic";
            case "status" -> "naacus_status";
            default -> "createdon";
        };
    }
}
