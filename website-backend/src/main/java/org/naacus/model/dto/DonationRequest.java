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
public class DonationRequest {
    @NotBlank(message = "Transaction ID is required")
    private String transactionId;
    
    @NotNull(message = "Amount is required")
    private Double amount;
    
    private String currency;
    
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // card, paypal, crypto, cashapp
    
    @NotBlank(message = "Payment provider is required")
    private String paymentProvider; // stripe, paypal, coinbase, square
    
    private String donorName;
    
    @NotBlank(message = "Donor email is required")
    @Email(message = "Invalid email format")
    private String donorEmail;
    
    private Boolean isAnonymous;
    private String message;
}
