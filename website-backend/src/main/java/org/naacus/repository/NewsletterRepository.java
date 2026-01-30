package org.naacus.repository;

import com.fasterxml.jackson.databind.JsonNode;
import org.naacus.model.NewsletterSubscriber;
import org.naacus.service.DataverseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Repository for Newsletter Subscriber entities in Dataverse.
 */
@Repository
public class NewsletterRepository {

    private final DataverseService dataverseService;

    @Value("${dataverse.tables.newsletter:naacus_newslettersubscribers}")
    private String tableName;

    @Autowired
    public NewsletterRepository(DataverseService dataverseService) {
        this.dataverseService = dataverseService;
    }

    public NewsletterSubscriber create(NewsletterSubscriber subscriber) throws Exception {
        Map<String, Object> data = toDataverseMap(subscriber);
        JsonNode result = dataverseService.create(tableName, data);
        return fromDataverse(result);
    }

    public Optional<NewsletterSubscriber> findByEmail(String email) throws Exception {
        String filter = "naacus_email eq '" + email + "'";
        JsonNode result = dataverseService.query(tableName, filter, null, null, 1, 0);
        
        if (result.has("value") && result.get("value").size() > 0) {
            return Optional.of(fromDataverse(result.get("value").get(0)));
        }
        return Optional.empty();
    }

    public List<NewsletterSubscriber> findAll(int limit, int offset, String status) throws Exception {
        String filter = status != null ? "naacus_status eq '" + status + "'" : null;
        
        JsonNode result = dataverseService.query(tableName, filter, null, "createdon desc", limit, offset);
        
        List<NewsletterSubscriber> subscribers = new ArrayList<>();
        if (result.has("value")) {
            for (JsonNode node : result.get("value")) {
                subscribers.add(fromDataverse(node));
            }
        }
        return subscribers;
    }

    public int count(String status) throws Exception {
        String filter = status != null ? "naacus_status eq '" + status + "'" : null;
        return dataverseService.getCount(tableName, filter);
    }

    public NewsletterSubscriber update(String id, NewsletterSubscriber subscriber) throws Exception {
        Map<String, Object> data = toDataverseMap(subscriber);
        JsonNode result = dataverseService.update(tableName, id, data);
        return fromDataverse(result);
    }

    private Map<String, Object> toDataverseMap(NewsletterSubscriber subscriber) {
        Map<String, Object> map = new HashMap<>();
        map.put("naacus_email", subscriber.getEmail());
        map.put("naacus_name", subscriber.getName());
        map.put("naacus_languagepreference", subscriber.getLanguagePreference());
        map.put("naacus_status", subscriber.getStatus());
        return map;
    }

    private NewsletterSubscriber fromDataverse(JsonNode node) {
        return NewsletterSubscriber.builder()
                .id(getTextValue(node, "naacus_newslettersubscribersid"))
                .email(getTextValue(node, "naacus_email"))
                .name(getTextValue(node, "naacus_name"))
                .languagePreference(getTextValue(node, "naacus_languagepreference"))
                .status(getTextValue(node, "naacus_status"))
                .subscribedOn(parseDateTime(getTextValue(node, "createdon")))
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
}
