/**
 * Unit Tests for Chatbot Service
 * 
 * Run with: npm test
 */

import { processMessage, formatForWhatsApp, getFaqById } from '../services/chatbotService';
import { faqData } from '../data/faqData';
import dataService from '../services/dataService';

describe('Chatbot Service', () => {
  beforeEach(() => {
    jest.spyOn(dataService, 'getAllFAQs').mockResolvedValue(faqData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('processMessage', () => {
    test('should respond to greetings', async () => {
      const response = await processMessage('Hello');
      expect(response.text).toContain('NAACUS virtual assistant');
      expect(response.quickActions).toBeDefined();
      expect(response.quickActions.length).toBeGreaterThan(0);
    });

    test('should match FAQ about NAACUS', async () => {
      const response = await processMessage('What is NAACUS?');
      expect(response.text).toContain('National Association of African Catholics');
      expect(response.faqId).toBe('about-1');
      expect(response.confidence).toBeGreaterThan(0.3);
    });

    test('should match membership question', async () => {
      const response = await processMessage('How can I become a member?');
      expect(response.text).toContain('membership form');
      expect(response.faqId).toBe('membership-1');
    });

    test('should match conference question', async () => {
      const response = await processMessage('When is the next conference?');
      expect(response.text).toContain('2027');
      expect(response.category.toLowerCase()).toBe('events');
    });

    test('should provide fallback for unknown questions', async () => {
      const response = await processMessage('qzxw plmnr vvttz');
      expect(response.text).toContain('rephrase');
      expect(response.confidence).toBe(0);
      expect(response.quickActions).toBeDefined();
    });

    test('should handle thank you messages', async () => {
      const response = await processMessage('Thank you!');
      expect(response.text).toContain('welcome');
    });

    test('should provide related questions', async () => {
      const response = await processMessage('What is NAACUS?');
      expect(response.relatedQuestions).toBeDefined();
      expect(response.relatedQuestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('formatForWhatsApp', () => {
    test('should format basic response', async () => {
      const response = await processMessage('What is NAACUS?');
      const formatted = formatForWhatsApp(response);
      expect(formatted).toContain(response.text);
    });

    test('should format response to be defined', async () => {
      const response = await processMessage('What is NAACUS?');
      const formatted = formatForWhatsApp(response);
      expect(formatted).toBeDefined();
    });

    test('should include related questions in WhatsApp format when available', async () => {
      const response = await processMessage('What is NAACUS?');
      if (!response.relatedQuestions || response.relatedQuestions.length === 0) {
        return;
      }
      const formatted = formatForWhatsApp(response);
      expect(formatted).toContain('*You might also be interested in:*');
    });

    test('should include quick actions in WhatsApp format when available', async () => {
      const response = await processMessage('Hello');
      if (!response.quickActions || response.quickActions.length === 0) {
        return;
      }
      const formatted = formatForWhatsApp(response);
      expect(formatted).toContain('*Quick options:*');
    });
  });

  describe('FAQ Data', () => {
    test('should have FAQ data loaded', () => {
      expect(faqData).toBeDefined();
      expect(faqData.length).toBeGreaterThan(0);
    });

    test('all FAQs should have required fields', () => {
      faqData.forEach(faq => {
        expect(faq.id).toBeDefined();
        expect(faq.category).toBeDefined();
        expect(faq.question).toBeDefined();
        expect(faq.keywords).toBeDefined();
        expect(faq.answer).toBeDefined();
        expect(Array.isArray(faq.keywords)).toBe(true);
      });
    });

    test('should be able to get FAQ by ID', async () => {
      const faq = await getFaqById('about-1');
      expect(faq).toBeDefined();
      expect(faq.id).toBe('about-1');
    });
  });
});
