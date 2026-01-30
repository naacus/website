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
public class EventRegistration {
    private String id;
    private String registrationId;
    private String eventId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Integer attendees;
    private String dietaryRequirements;
    private String specialNeeds;
    private String status; // confirmed, pending, cancelled
    private LocalDateTime registrationDate;
}
