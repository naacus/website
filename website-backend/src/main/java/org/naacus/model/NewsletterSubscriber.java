package org.naacus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterSubscriber {
    private String id;
    private String email;
    private String name;
    private String languagePreference; // en, fr
    private String status; // active, unsubscribed
    private LocalDateTime subscribedOn;
}
