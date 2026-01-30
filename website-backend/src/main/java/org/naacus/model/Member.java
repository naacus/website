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
public class Member {
    private String id;
    private String memberId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String membershipType; // individual, family, student, senior, clergy
    private Double amountPaid;
    private String paymentMethod;
    private String status; // active, pending, inactive
    private Integer membershipYear;
    private LocalDateTime joinDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
