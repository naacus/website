package org.naacus.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    
    @NotBlank(message = "Membership type is required")
    private String membershipType; // individual, family, student, senior, clergy
    
    @NotNull(message = "Amount paid is required")
    private Double amountPaid;
    
    private String paymentMethod;
    private Integer membershipYear;
}
