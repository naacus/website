/**
 * Chatbot Service
 * 
 * This service provides AI-powered conversation capabilities using:
 * 1. Microsoft Copilot Studio (primary, when configured)
 * 2. Local FAQ matching (fallback)
 * 
 * Supports both web and WhatsApp platforms with M365 integration
 */

import { defaultResponses, quickActions } from '../data/faqData';
import copilotStudioService from './copilotStudioService';
import { validateConfig } from '../config/copilotStudioConfig';
import dataService from './dataService';

// Track if Copilot Studio is available
let copilotStudioAvailable = false;
let copilotStudioInitialized = false;

// Cache for FAQ data loaded from Decap CMS
let cachedFaqData = null;
let faqDataLoaded = false;

function warnIfNotTest(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(...args);
  }
}

function normalizeLanguage(language) {
  return (language || 'en').split('-')[0] === 'fr' ? 'fr' : 'en';
}

function buildContextualQuickActions(context = {}) {
  const language = normalizeLanguage(context.language);
  const intent = context.pageIntent;
  const fallbackQuickActions = quickActions.slice(0, 3);

  if (!intent || !intent.nextStepLabel || !intent.nextStepPath) {
    return fallbackQuickActions;
  }

  const nextAction = {
    id: 'qa-next-step',
    label: intent.nextStepLabel,
    question: language === 'fr' ? 'Montrez-moi la prochaine etape' : 'Show me the next step',
    path: intent.nextStepPath,
  };

  const contactAction = {
    id: 'qa-contact',
    label: language === 'fr' ? 'Contacter NAACUS' : 'Contact NAACUS',
    question: language === 'fr' ? 'Comment contacter NAACUS ?' : 'How can I contact NAACUS?',
  };

  return [nextAction, ...fallbackQuickActions.slice(0, 2), contactAction];
}

function buildGreetingMessage(context = {}) {
  const language = normalizeLanguage(context.language);
  const intent = context.pageIntent;

  if (!intent) {
    return defaultResponses.greeting;
  }

  if (language === 'fr') {
    return `Bonjour, je suis l assistant NAACUS. Je peux vous guider rapidement selon cette page et vous orienter vers la meilleure prochaine etape.`;
  }

  return `Hello, I am the NAACUS assistant. I can guide you based on this page and help you take the best next step quickly.`;
}

function buildNoMatchMessage(context = {}) {
  const language = normalizeLanguage(context.language);
  const intent = context.pageIntent;

  if (!intent) {
    return defaultResponses.noMatch;
  }

  if (language === 'fr') {
    return `Je peux vous orienter vers la meilleure prochaine etape pour cette page. Vous pouvez aussi contacter NAACUS directement via la page Contact.`;
  }

  return `I can guide you to the best next step from this page. You can also contact NAACUS directly through the Contact page.`;
}

/**
 * Initialize Copilot Studio integration
 * Call this when the app starts or when a user opens the chat
 */
export async function initializeCopilotStudio() {
  if (copilotStudioInitialized) {
    return copilotStudioAvailable;
  }

  const validation = validateConfig();
  if (validation.isValid) {
    try {
      await copilotStudioService.startConversation();
      copilotStudioAvailable = true;
      copilotStudioInitialized = true;
      console.log('✅ Microsoft Copilot Studio connected successfully');
      return true;
    } catch (error) {
      warnIfNotTest('⚠️ Copilot Studio unavailable, using local FAQ fallback:', error.message);
      copilotStudioAvailable = false;
      copilotStudioInitialized = true;
      return false;
    }
  } else {
    warnIfNotTest('⚠️ Copilot Studio not configured, using local FAQ fallback');
    copilotStudioAvailable = false;
    copilotStudioInitialized = true;
    return false;
  }
}

/**
 * Ensure FAQ data is loaded from Decap CMS (or fallback)
 */
async function ensureFaqDataLoaded() {
  if (faqDataLoaded && cachedFaqData) {
    return cachedFaqData;
  }
  
  try {
    cachedFaqData = await dataService.getAllFAQs();
    faqDataLoaded = true;
    return cachedFaqData;
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    faqDataLoaded = true;
    return cachedFaqData || [];
  }
}

/**
 * Calculate similarity score between two strings using a simple keyword matching algorithm
 * In a production environment, this could be replaced with more sophisticated NLP libraries
 * or API calls to services like OpenAI, Dialogflow, etc.
 */
function calculateSimilarity(str1, str2) {
  const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '');
  const words1 = normalize(str1).split(/\s+/);
  const words2 = normalize(str2).split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word1 of words1) {
    if (word1.length < 3) continue; // Skip very short words
    for (const word2 of words2) {
      if (word2.includes(word1) || word1.includes(word2)) {
        matches++;
        break;
      }
    }
  }
  
  // Calculate similarity score (0-1)
  const maxLength = Math.max(words1.length, words2.length);
  return maxLength > 0 ? matches / maxLength : 0;
}

/**
 * Find the best matching FAQ entry for a given user question
 * Returns { faq, score } or null if no good match found
 */
async function findBestMatch(userQuestion, faqList) {
  let bestMatch = null;
  let bestScore = 0;
  const minThreshold = 0.25; // Minimum similarity threshold
  
  const faqs = faqList || (await ensureFaqDataLoaded());
  
  for (const faq of faqs) {
    // Check similarity with the main question
    let score = calculateSimilarity(userQuestion, faq.question);
    
    // Also check against keywords (with higher weight)
    for (const keyword of faq.keywords) {
      const keywordScore = calculateSimilarity(userQuestion, keyword);
      score = Math.max(score, keywordScore * 1.2); // Give keywords 20% boost
    }
    
    if (score > bestScore && score >= minThreshold) {
      bestScore = score;
      bestMatch = faq;
    }
  }
  
  return { match: bestMatch, score: bestScore };
}

/**
 * Process a user message and generate a response
 * Attempts to use Copilot Studio first, falls back to local FAQ matching
 * @param {string} userMessage - The user's question or message
 * @param {object} context - Optional context (user history, language, etc.)
 * @returns {Promise<object>|object} Response object with text and optional suggestions
 */
export async function processMessage(userMessage, context = {}) {
  // Try Copilot Studio first if available
  if (copilotStudioAvailable) {
    try {
      await copilotStudioService.sendMessage(userMessage, context);
      
      // Get response with a small delay to allow bot processing
      return new Promise((resolve) => {
        setTimeout(async () => {
          const messages = await copilotStudioService.getMessages();
          
          if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            
            // Convert Copilot Studio response to our format
            const response = {
              text: latestMessage.text || defaultResponses.noMatch,
              source: 'copilot-studio',
              timestamp: latestMessage.timestamp,
            };
            
            // Add suggested actions if available
            if (latestMessage.suggestedActions && latestMessage.suggestedActions.actions) {
              response.quickActions = latestMessage.suggestedActions.actions.map((action, idx) => ({
                id: `action-${idx}`,
                label: action.title,
                question: action.value || action.title,
              }));
            }
            
            // Add adaptive cards or attachments if present
            if (latestMessage.attachments && latestMessage.attachments.length > 0) {
              response.attachments = latestMessage.attachments;
            }
            
            resolve(response);
          } else {
            // No response from Copilot Studio, use fallback
            resolve(processMessageLocal(userMessage, context));
          }
        }, 800); // 800ms delay for bot to process
      });
    } catch (error) {
      console.error('Copilot Studio error, using fallback:', error);
      copilotStudioAvailable = false; // Disable for this session
      return processMessageLocal(userMessage, context);
    }
  }
  
  // Use local FAQ matching as fallback
  return processMessageLocal(userMessage, context);
}

/**
 * Process message using local FAQ matching (original implementation)
 * @param {string} userMessage - The user's question or message
 * @param {object} context - Optional context
 * @returns {Promise<object>} Response object
 */
async function processMessageLocal(userMessage, context = {}) {
  const normalizedMessage = userMessage.toLowerCase().trim();
  const contextualQuickActions = buildContextualQuickActions(context);
  
  // Handle greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some(g => normalizedMessage === g || normalizedMessage.startsWith(g + ' '))) {
    return {
      text: buildGreetingMessage(context),
      suggestions: contextualQuickActions.map(qa => qa.label),
      quickActions: contextualQuickActions,
      source: 'local-faq',
    };
  }
  
  // Handle thank you messages
  const thankYou = ['thank', 'thanks', 'appreciate'];
  if (thankYou.some(t => normalizedMessage.includes(t))) {
    return {
      text: "You're welcome! Is there anything else I can help you with?",
      suggestions: contextualQuickActions.map(qa => qa.label),
      quickActions: contextualQuickActions,
      source: 'local-faq',
    };
  }
  
  // Load FAQs and find best matching
  const faqs = await ensureFaqDataLoaded();
  const { match, score } = await findBestMatch(userMessage, faqs);
  
  if (match && score > 0.3) {
    // Get related FAQs from the same category
    const relatedFaqs = faqs
      .filter(faq => faq.category === match.category && faq.id !== match.id)
      .slice(0, 2);
    
    return {
      text: match.answer,
      faqId: match.id,
      category: match.category,
      confidence: score,
      relatedQuestions: relatedFaqs.map(faq => faq.question),
      source: 'local-faq',
    };
  }
  
  // No good match found
  return {
    text: buildNoMatchMessage(context),
    suggestions: contextualQuickActions.map(qa => qa.label),
    quickActions: contextualQuickActions,
    confidence: 0,
    source: 'local-faq',
  };
}

/**
 * Get FAQ by ID (useful for direct question selection)
 */
export async function getFaqById(faqId) {
  const faqs = await ensureFaqDataLoaded();
  return faqs.find(faq => faq.id === faqId);
}

/**
 * Get FAQs by category
 */
export async function getFaqsByCategory(category) {
  const faqs = await ensureFaqDataLoaded();
  return faqs.filter(faq => faq.category === category);
}

/**
 * Get all available categories
 */
export async function getCategories() {
  const faqs = await ensureFaqDataLoaded();
  const categories = {};
  faqs.forEach(faq => {
    if (!categories[faq.category]) {
      categories[faq.category] = {
        name: faq.category,
        count: 0
      };
    }
    categories[faq.category].count++;
  });
  return categories;
}

/**
 * Get quick action suggestions
 */
export function getQuickActions() {
  return quickActions;
}

/**
 * Format response for WhatsApp
 * WhatsApp has specific formatting requirements (plain text, no HTML)
 */
export function formatForWhatsApp(response) {
  let message = response.text;
  
  // Add related questions if available
  if (response.relatedQuestions && response.relatedQuestions.length > 0) {
    message += '\n\n*You might also be interested in:*\n';
    response.relatedQuestions.forEach((q, i) => {
      message += `${i + 1}. ${q}\n`;
    });
  }
  
  // Add quick actions if available
  if (response.quickActions && response.quickActions.length > 0) {
    message += '\n\n*Quick options:*\n';
    response.quickActions.forEach((qa, i) => {
      message += `${i + 1}. ${qa.label}\n`;
    });
  }
  
  return message;
}

/**
 * Log conversation for analytics (can be extended to save to database or Microsoft 365)
 * @param {string} userMessage - User's message
 * @param {object} botResponse - Bot's response object
 * @param {string} platform - Platform identifier (web, whatsapp, etc.)
 * @param {object} user - Optional user information from M365
 */
export function logConversation(userMessage, botResponse, platform = 'web', user = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    platform,
    userMessage,
    botResponse: botResponse.text,
    faqId: botResponse.faqId,
    confidence: botResponse.confidence,
    source: botResponse.source,
  };
  
  // Add M365 user info if available
  if (user) {
    logEntry.userId = user.id;
    logEntry.userEmail = user.email;
    logEntry.userName = user.displayName;
  }
  
  // In production, this would:
  // 1. Save to SharePoint list via Microsoft Graph API
  // 2. Log to Azure Application Insights
  // 3. Store in Microsoft Dataverse
  // 4. Send to Power Automate for processing
  console.log('Chatbot Conversation Log:', logEntry);
  
  // TODO: Implement M365 integration
  // Example: await saveToSharePoint(logEntry);
}

/**
 * Clean up Copilot Studio resources
 */
export function cleanupCopilotStudio() {
  if (copilotStudioAvailable) {
    copilotStudioService.endConversation();
  }
}

const chatbotService = {
  initializeCopilotStudio,
  processMessage,
  getFaqById,
  getFaqsByCategory,
  getCategories,
  getQuickActions,
  formatForWhatsApp,
  logConversation,
  cleanupCopilotStudio,
  copilotStudioService, // Export for advanced usage
};

export default chatbotService;
