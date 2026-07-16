// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Polyfills required by react-router v7 when running under jsdom
const { TextDecoder: NodeTextDecoder, TextEncoder: NodeTextEncoder } = require('util');
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = NodeTextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = NodeTextDecoder;
}
if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.getRandomValues === 'undefined') {
  const nodeCrypto = require('crypto');
  globalThis.crypto = {
    getRandomValues: (buffer) => nodeCrypto.randomFillSync(buffer),
  };
}

if (typeof window !== 'undefined') {
	if (!window.performance) {
		Object.defineProperty(window, 'performance', {
			value: {},
			writable: true,
		});
	}

	if (typeof window.performance.getEntriesByType !== 'function') {
		window.performance.getEntriesByType = () => [];
	}
}
