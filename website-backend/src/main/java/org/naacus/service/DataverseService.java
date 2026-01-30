package org.naacus.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.naacus.config.DataverseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service for interacting with Microsoft Dataverse Web API.
 * Provides CRUD operations for Dataverse tables.
 */
@Service
public class DataverseService {

    private final WebClient dataverseWebClient;
    private final DataverseConfig dataverseConfig;
    private final ObjectMapper objectMapper;

    @Autowired
    public DataverseService(WebClient dataverseWebClient, DataverseConfig dataverseConfig) {
        this.dataverseWebClient = dataverseWebClient;
        this.dataverseConfig = dataverseConfig;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Create a new record in Dataverse table.
     * @param tableName Plural table name (e.g., "cr_members", "contacts")
     * @param data Record data as Map
     * @return Created record with ID
     */
    public JsonNode create(String tableName, Map<String, Object> data) throws Exception {
        String token = dataverseConfig.getAccessToken();

        String response = dataverseWebClient.post()
                .uri("/" + tableName)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(data)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Dataverse error: " + body))))
                .bodyToMono(String.class)
                .block();

        return objectMapper.readTree(response);
    }

    /**
     * Get record by ID.
     * @param tableName Plural table name
     * @param id Record GUID
     * @param select Optional columns to select
     * @return Record data or empty if not found
     */
    public Optional<JsonNode> getById(String tableName, String id, String... select) throws Exception {
        String token = dataverseConfig.getAccessToken();

        String selectParam = select.length > 0 ? "?$select=" + String.join(",", select) : "";

        try {
            String response = dataverseWebClient.get()
                    .uri("/" + tableName + "(" + id + ")" + selectParam)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .onStatus(status -> status.value() == 404, clientResponse -> Mono.empty())
                    .bodyToMono(String.class)
                    .block();

            return response != null ? Optional.of(objectMapper.readTree(response)) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Query records with OData filter.
     * @param tableName Plural table name
     * @param filter OData filter expression (e.g., "statecode eq 0")
     * @param select Columns to select
     * @param orderBy Order by expression
     * @param top Max records to return
     * @param skip Records to skip (for pagination)
     * @return Query result with value array
     */
    public JsonNode query(String tableName, String filter, String select, String orderBy, int top, int skip) throws Exception {
        String token = dataverseConfig.getAccessToken();

        StringBuilder queryBuilder = new StringBuilder("/" + tableName + "?");

        if (filter != null && !filter.isEmpty()) {
            queryBuilder.append("$filter=").append(filter).append("&");
        }
        if (select != null && !select.isEmpty()) {
            queryBuilder.append("$select=").append(select).append("&");
        }
        if (orderBy != null && !orderBy.isEmpty()) {
            queryBuilder.append("$orderby=").append(orderBy).append("&");
        }
        queryBuilder.append("$top=").append(top).append("&");
        queryBuilder.append("$skip=").append(skip).append("&");
        queryBuilder.append("$count=true");

        String response = dataverseWebClient.get()
                .uri(queryBuilder.toString())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Dataverse error: " + body))))
                .bodyToMono(String.class)
                .block();

        return objectMapper.readTree(response);
    }

    /**
     * Update a record by ID.
     * @param tableName Plural table name
     * @param id Record GUID
     * @param data Fields to update
     * @return Updated record
     */
    public JsonNode update(String tableName, String id, Map<String, Object> data) throws Exception {
        String token = dataverseConfig.getAccessToken();

        String response = dataverseWebClient.patch()
                .uri("/" + tableName + "(" + id + ")")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(data)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Dataverse error: " + body))))
                .bodyToMono(String.class)
                .block();

        return objectMapper.readTree(response);
    }

    /**
     * Delete a record by ID (soft delete sets statecode to inactive).
     * @param tableName Plural table name
     * @param id Record GUID
     */
    public void delete(String tableName, String id) throws Exception {
        String token = dataverseConfig.getAccessToken();

        dataverseWebClient.delete()
                .uri("/" + tableName + "(" + id + ")")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new RuntimeException("Dataverse error: " + body))))
                .toBodilessEntity()
                .block();
    }

    /**
     * Get total count for a table with optional filter.
     */
    public int getCount(String tableName, String filter) throws Exception {
        String token = dataverseConfig.getAccessToken();

        StringBuilder queryBuilder = new StringBuilder("/" + tableName + "/$count");
        if (filter != null && !filter.isEmpty()) {
            queryBuilder.append("?$filter=").append(filter);
        }

        String response = dataverseWebClient.get()
                .uri(queryBuilder.toString())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return Integer.parseInt(response.trim());
    }
}
