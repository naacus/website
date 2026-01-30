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
public class ContactInquiry {
    private String id;
    private String inquiryId;
    private String name;
    private String email;
    private String phone;
    private String topic; // membership, volunteer, events, donation, partnership, feedback, other
    private String subject;
    private String message;
    private String status; // new, in_progress, responded, closed
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime respondedOn;
}
