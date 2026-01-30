package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.Donation;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Donation entities in Dataverse.
 */
@Repository
public class DonationRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.donations:naacus_donations}")
    private String tableName;

    @Autowired
    public DonationRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public Donation create(Donation donation) throws Exception {
        Map<String, Object> data = toDataverseMap(donation);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public Optional<Donation> findById(String id) throws Exception {
        return dataverseService.getById(tableName, id).map(this::fromDataverse);
    }

    public List<Donation> findAll(int limit, int offset, String type, String sortBy, String sortOrder) throws Exception {
        String filter = type != null ? "naacus_donationtype eq '" + type + "'" : null;
        String orderBy = mapSortField(sortBy) + " " + (sortOrder != null ? sortOrder : "desc");

        JsonNode result = dataverseService.query(tableName, filter, null, orderBy, limit, offset);
        
        List<Donation> donations = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                donations.add(fromDataverse(node));
            }
        }
        return donations;
    }

    public int count(String type) throws Exception {
        String filter = type != null ? "naacus_donationtype eq '" + type + "'" : null;
        return dataverseService.getCount(tableName, filter);
    }

    private Map<String, Object> toDataverseMap(Donation donation) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_donorname", donation.getDonorName());
        map.put("naacus_donoremail", donation.getDonorEmail());
        map.put("naacus_amount", donation.getAmount());
        map.put("naacus_currency", donation.getCurrency());
        map.put("naacus_donationtype", donation.getDonationType());
        map.put("naacus_paymentmethod", donation.getPaymentMethod());
        map.put("naacus_paymentprovider", donation.getPaymentProvider());
        map.put("naacus_paymentprovidertransactionid", donation.getPaymentProviderTransactionId());
        map.put("naacus_transactionid", donation.getTransactionId());
        map.put("naacus_isanonymous", donation.getIsAnonymous());
        map.put("naacus_message", donation.getMessage());
        map.put("naacus_status", donation.getStatus());
        return map;
    }

    private Donation fromDataverse(JsonNode node) {
        return Donation.builder()
                .id(getTextValue(node, "naacus_donationsid"))
                .transactionId(getTextValue(node, "naacus_transactionid"))
                .donorName(getTextValue(node, "naacus_donorname"))
                .donorEmail(getTextValue(node, "naacus_donoremail"))
                .amount(node.has("naacus_amount") ? node.get("naacus_amount").asDouble() : null)
                .currency(getTextValue(node, "naacus_currency"))
                .donationType(getTextValue(node, "naacus_donationtype"))
                .paymentMethod(getTextValue(node, "naacus_paymentmethod"))
                .paymentProvider(getTextValue(node, "naacus_paymentprovider"))
                .paymentProviderTransactionId(getTextValue(node, "naacus_paymentprovidertransactionid"))
                .isAnonymous(node.has("naacus_isanonymous") ? node.get("naacus_isanonymous").asBoolean() : false)
                .message(getTextValue(node, "naacus_message"))
                .status(getTextValue(node, "naacus_status"))
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
            case "amount" -> "naacus_amount";
            case "donorName" -> "naacus_donorname";
            default -> "createdon";
        };
    }
}
