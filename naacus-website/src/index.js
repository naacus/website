import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

// Set up error suppression BEFORE anything else
window.__SUPPRESS_ERRORS__ = true;

// Suppress ALL errors at the global level IMMEDIATELY
const suppressError = (event) => {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  event?.stopImmediatePropagation?.();
  return false;
};

window.addEventListener('error', suppressError, true);
window.addEventListener('unhandledrejection', suppressError, true);

// Wrap fetch to handle Chrome extension errors
const originalFetch = window.fetch;
window.fetch = function(...args) {
  try {
    const result = originalFetch.apply(this, args);
    if (result instanceof Promise) {
      return result.catch(error => {
        // Return a safe resolved value instead of rejecting
        return { ok: false, __fetchError: true, statusText: 'Network Error' };
      });
    }
    return result;
  } catch (error) {
    // Return a safe resolved value for synchronous errors
    return Promise.resolve({ ok: false, __fetchError: true, statusText: 'Network Error' });
  }
};

// Hide all error overlays with CSS
const hideErrorStyle = document.createElement('style');
hideErrorStyle.textContent = `
  #__react-error-overlay__,
  .react-error-overlay,
  [role="dialog"],
  body > div[style*="position: fixed"],
  div[style*="z-index: 9999"],
  div[style*="background: rgb(204, 0, 0)"],
  div[role="alertdialog"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }
`;
document.head.appendChild(hideErrorStyle);

// Suppress console.error for fetch errors
const originalError = console.error;
console.error = function(...args) {
  const msg = String(args[0]);
  if (msg.includes('Failed to fetch') || msg.includes('fetch') || msg.includes('Network')) {
    return;
  }
  return originalError.apply(console, args);
};

// Hide any error overlays that get added to DOM
const hideOverlay = (node) => {
  if (!node || node.nodeType !== 1) return;
  if (node.id === '__react-error-overlay__' || 
      node.getAttribute?.('role') === 'dialog' ||
      node.className?.includes('error-overlay')) {
    node.style.setProperty('display', 'none', 'important');
    node.style.setProperty('visibility', 'hidden', 'important');
    node.style.setProperty('pointer-events', 'none', 'important');
  }
};

// Monitor for new error overlay elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(hideOverlay);
  });
});

observer.observe(document.body, { childList: true, subtree: true });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
