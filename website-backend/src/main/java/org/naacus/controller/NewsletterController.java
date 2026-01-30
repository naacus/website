package org.naacus.controller;

import jakarta.validation.Valid;
import org.naacus.data.NewsletterSubscriberMockData;
import org.naacus.model.NewsletterSubscriber;
import org.naacus.model.dto.ApiResponse;
import org.naacus.model.dto.NewsletterSubscribeRequest;
import org.naacus.model.dto.Pagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/newsletter")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriberMockData subscriberMockData;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<NewsletterSubscriber>> subscribe(
            @Valid @RequestBody NewsletterSubscribeRequest request) {
        
        NewsletterSubscriber subscriber = subscriberMockData.subscribe(
                request.getEmail(),
                request.getName(),
                request.getLanguagePreference()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(subscriber));
    }

    @GetMapping("/subscribers")
    public ResponseEntity<ApiResponse<List<NewsletterSubscriber>>> getSubscribers(
            @RequestParam(defaultValue = "50") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "subscribedOn") String sortBy) {

        List<NewsletterSubscriber> subscribers = subscriberMockData.getSubscribers(limit, offset, status, sortBy);
        int total = subscriberMockData.getTotalCount(status);

        Pagination pagination = Pagination.builder()
                .total(total)
                .limit(limit)
                .offset(offset)
                .hasMore(offset + subscribers.size() < total)
                .build();

        return ResponseEntity.ok(ApiResponse.success(subscribers, pagination));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResponse<Object>> unsubscribe(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Email is required"));
        }

        boolean unsubscribed = subscriberMockData.unsubscribe(email);
        if (!unsubscribed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Subscriber not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Successfully unsubscribed")));
    }
}
