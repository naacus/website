package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.Member;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Member entities in Dataverse.
 * Table: cr_members (custom table with 'cr_' publisher prefix)
 */
@Repository
public class MemberRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.members:naacus_members}")
    private String tableName;

    @Autowired
    public MemberRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public Member create(Member member) throws Exception {
        Map<String, Object> data = toDataverseMap(member);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public Optional<Member> findById(String id) throws Exception {
        return dataverseService.getById(tableName, id).map(this::fromDataverse);
    }

    public List<Member> findAll(int limit, int offset, String status, Integer year, String sortBy, String sortOrder) throws Exception {
        StringBuilder filter = new StringBuilder();
        
        if (status != null && !status.isEmpty()) {
            filter.append("naacus_status eq '").append(status).append("'");
        }
        if (year != null) {
            if (filter.length() > 0) filter.append(" and ");
            filter.append("year(naacus_createdon) eq ").append(year);
        }

        String orderBy = mapSortField(sortBy) + " " + (sortOrder != null ? sortOrder : "desc");

        JsonNode result = dataverseService.query(tableName, filter.toString(), null, orderBy, limit, offset);
        
        List<Member> members = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                members.add(fromDataverse(node));
            }
        }
        return members;
    }

    public int count(String status) throws Exception {
        String filter = status != null ? "naacus_status eq '" + status + "'" : null;
        return dataverseService.getCount(tableName, filter);
    }

    public Member update(String id, Member member) throws Exception {
        Map<String, Object> data = toDataverseMap(member);
        JsonNode result = dataverseService.update(tableName, id, data);
        return fromDataverse(result);
    }

    public void delete(String id) throws Exception {
        dataverseService.delete(tableName, id);
    }

    private Map<String, Object> toDataverseMap(Member member) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_firstname", member.getFirstName());
        map.put("naacus_lastname", member.getLastName());
        map.put("naacus_email", member.getEmail());
        map.put("naacus_phone", member.getPhone());
        map.put("naacus_address", member.getAddress());
        map.put("naacus_city", member.getCity());
        map.put("naacus_state", member.getState());
        map.put("naacus_zipcode", member.getZipCode());
        map.put("naacus_country", member.getCountry());
        map.put("naacus_membershiptype", member.getMembershipType());
        map.put("naacus_amountpaid", member.getAmountPaid());
        map.put("naacus_paymentmethod", member.getPaymentMethod());
        map.put("naacus_status", member.getStatus());
        map.put("naacus_membershipyear", member.getMembershipYear());
        return map;
    }

    private Member fromDataverse(JsonNode node) {
        return Member.builder()
                .id(getTextValue(node, "naacus_membersid"))
                .memberId(getTextValue(node, "naacus_memberid"))
                .firstName(getTextValue(node, "naacus_firstname"))
                .lastName(getTextValue(node, "naacus_lastname"))
                .email(getTextValue(node, "naacus_email"))
                .phone(getTextValue(node, "naacus_phone"))
                .address(getTextValue(node, "naacus_address"))
                .city(getTextValue(node, "naacus_city"))
                .state(getTextValue(node, "naacus_state"))
                .zipCode(getTextValue(node, "naacus_zipcode"))
                .country(getTextValue(node, "naacus_country"))
                .membershipType(getTextValue(node, "naacus_membershiptype"))
                .amountPaid(node.has("naacus_amountpaid") ? node.get("naacus_amountpaid").asDouble() : null)
                .paymentMethod(getTextValue(node, "naacus_paymentmethod"))
                .status(getTextValue(node, "naacus_status"))
                .membershipYear(node.has("naacus_membershipyear") ? node.get("naacus_membershipyear").asInt() : null)
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
            case "createdAt" -> "createdon";
            case "lastName" -> "naacus_lastname";
            case "firstName" -> "naacus_firstname";
            case "email" -> "naacus_email";
            default -> "createdon";
        };
    }
}
