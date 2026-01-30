package org.naacus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer {
    private String id;
    private String applicationId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String city;
    private String state;
    private List<String> skills;
    private List<String> interests;
    private List<String> availability;
    private String status; // pending_review, approved, rejected
    private String backgroundCheckStatus; // pending, approved, rejected
    private LocalDateTime createdAt;
    private LocalDateTime submittedOn;
}
