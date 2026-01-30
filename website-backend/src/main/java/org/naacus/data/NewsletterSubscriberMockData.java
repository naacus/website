package org.naacus.data;

import org.naacus.model.NewsletterSubscriber;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class NewsletterSubscriberMockData {

    private final Map<String, NewsletterSubscriber> subscribers = new ConcurrentHashMap<>();

    public NewsletterSubscriberMockData() {
        // Initialize with sample data
        addSubscriber(NewsletterSubscriber.builder()
                .id(UUID.randomUUID().toString())
                .email("subscriber1@example.com")
                .name("John Doe")
                .languagePreference("en")
                .status("active")
                .subscribedOn(LocalDateTime.now().minusMonths(6))
                .build());

        addSubscriber(NewsletterSubscriber.builder()
                .id(UUID.randomUUID().toString())
                .email("subscriber2@example.com")
                .name("Marie Claire")
                .languagePreference("fr")
                .status("active")
                .subscribedOn(LocalDateTime.now().minusMonths(3))
                .build());

        addSubscriber(NewsletterSubscriber.builder()
                .id(UUID.randomUUID().toString())
                .email("subscriber3@example.com")
                .name("Samuel Osei")
                .languagePreference("en")
                .status("active")
                .subscribedOn(LocalDateTime.now().minusWeeks(2))
                .build());
    }

    private void addSubscriber(NewsletterSubscriber subscriber) {
        subscribers.put(subscriber.getId(), subscriber);
    }

    public List<NewsletterSubscriber> getAllSubscribers() {
        return new ArrayList<>(subscribers.values());
    }

    public List<NewsletterSubscriber> getSubscribers(int limit, int offset, String status, String sortBy) {
        return subscribers.values().stream()
                .filter(s -> status == null || s.getStatus().equalsIgnoreCase(status))
                .sorted((s1, s2) -> {
                    if ("subscribedOn".equals(sortBy)) {
                        return s2.getSubscribedOn().compareTo(s1.getSubscribedOn());
                    }
                    return 0;
                })
                .skip(offset)
                .limit(limit)
                .collect(Collectors.toList());
    }

    public int getTotalCount(String status) {
        return (int) subscribers.values().stream()
                .filter(s -> status == null || s.getStatus().equalsIgnoreCase(status))
                .count();
    }

    public NewsletterSubscriber findByEmail(String email) {
        return subscribers.values().stream()
                .filter(s -> s.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    public NewsletterSubscriber subscribe(String email, String name, String languagePreference) {
        // Check if already subscribed
        NewsletterSubscriber existing = findByEmail(email);
        if (existing != null) {
            existing.setStatus("active");
            return existing;
        }

        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .id(UUID.randomUUID().toString())
                .email(email)
                .name(name)
                .languagePreference(languagePreference != null ? languagePreference : "en")
                .status("active")
                .subscribedOn(LocalDateTime.now())
                .build();
        subscribers.put(subscriber.getId(), subscriber);
        return subscriber;
    }

    public boolean unsubscribe(String email) {
        NewsletterSubscriber subscriber = findByEmail(email);
        if (subscriber != null) {
            subscriber.setStatus("unsubscribed");
            return true;
        }
        return false;
    }
}
