/**
 * Bank Transfer Payment Service
 * Handles bank transfer (ACH, Wire Transfer, International Bank Transfer) payments
 */

import paymentConfig from '../config/paymentConfig';

class BankTransferPaymentService {
  constructor() {
    this.initialized = true; // No external SDK needed
  }

  /**
   * Create bank transfer payment
   */
  async createBankTransferPayment(donationData) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: donationData.amount.toFixed(2),
            currency: paymentConfig.general.currency,
            email: donationData.email,
            name: donationData.fullName,
            phone: donationData.phone || null,
            message: donationData.message || null,
            transferType: donationData.transferType || 'ach', // 'ach', 'wire', 'international'
            metadata: {
              donorName: donationData.fullName,
              donorEmail: donationData.email,
              donorPhone: donationData.phone,
              message: donationData.message,
            },
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create bank transfer payment');
      return await response.json();
    } catch (error) {
      console.error('Bank transfer creation error:', error);
      throw error;
    }
  }

  /**
   * Get bank transfer details (account info for donor)
   */
  async getBankTransferDetails(paymentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/${paymentId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch bank transfer details');
      const data = await response.json();
      
      return {
        paymentId: data.paymentId,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        bankDetails: {
          accountName: data.bankDetails.accountName,
          accountNumber: this.maskAccountNumber(data.bankDetails.accountNumber),
          routingNumber: data.bankDetails.routingNumber,
          bankName: data.bankDetails.bankName,
          bankAddress: data.bankDetails.bankAddress,
          swiftCode: data.bankDetails.swiftCode,
          ibanCode: data.bankDetails.ibanCode,
        },
        referenceNumber: data.referenceNumber,
        instructions: data.instructions,
        processingTime: paymentConfig.bankTransfer.processingTime,
      };
    } catch (error) {
      console.error('Get bank transfer details error:', error);
      throw error;
    }
  }

  /**
   * Mask account number for security
   */
  maskAccountNumber(accountNumber) {
    if (!accountNumber) return '';
    const lastFour = accountNumber.slice(-4);
    return `****${lastFour}`;
  }

  /**
   * Verify payment received
   */
  async verifyPaymentReceived(paymentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/verify/${paymentId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to verify payment');
      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Generate bank transfer instructions PDF
   */
  async generateTransferInstructions(paymentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/instructions/${paymentId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to generate instructions');
      return await response.blob();
    } catch (error) {
      console.error('Generate instructions error:', error);
      throw error;
    }
  }

  /**
   * Send transfer instructions via email
   */
  async emailTransferInstructions(paymentId, email) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/send-instructions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId,
            email,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send instructions');
      return await response.json();
    } catch (error) {
      console.error('Email instructions error:', error);
      throw error;
    }
  }

  /**
   * Get supported transfer types and currencies
   */
  getSupportedTransferTypes() {
    return {
      ach: {
        name: 'ACH Transfer (US)',
        processingTime: '1-3 business days',
        countries: ['US'],
        fees: 'Free',
      },
      wire: {
        name: 'Wire Transfer',
        processingTime: 'Same day',
        countries: ['US', 'CA', 'MX'],
        fees: '$10-30',
      },
      international: {
        name: 'International Bank Transfer',
        processingTime: '3-5 business days',
        countries: paymentConfig.bankTransfer.countries,
        fees: 'Variable by country',
      },
    };
  }

  /**
   * Cancel bank transfer payment
   */
  async cancelPayment(paymentId) {
    try {
      const response = await fetch(
        `${paymentConfig.general.apiBaseUrl}/payments/bank-transfer/cancel/${paymentId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) throw new Error('Failed to cancel payment');
      return await response.json();
    } catch (error) {
      console.error('Cancel payment error:', error);
      throw error;
    }
  }
}

export default new BankTransferPaymentService();
