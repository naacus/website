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
public class Donation {
    private String id;
    private String transactionId;
    private Double amount;
    private String currency;
    private String paymentMethod; // card, paypal, bank, crypto, cashapp
    private String paymentProvider; // stripe, paypal, coinbase, square
    private String paymentProviderTransactionId;
    private String status; // completed, failed, refunded
    private String donorName;
    private String donorEmail;
    private Boolean isAnonymous;
    private String message;
    private String donationType; // one-time, monthly
    private LocalDateTime createdAt;
}
