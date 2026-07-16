// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// react-router v7 uses TextEncoder/TextDecoder which are not available in
// jest's jsdom environment (used by react-scripts 5). Polyfill them from Node.
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// @fluentui/react-components (via tabster) uses crypto.getRandomValues which
// is not available in jest's jsdom environment. Polyfill only the missing
// method rather than replacing the entire global.crypto object.
if (typeof global.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  Object.defineProperty(global, 'crypto', { value: webcrypto, writable: true });
} else if (typeof global.crypto.getRandomValues === 'undefined') {
  const { webcrypto } = require('crypto');
  global.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
}

// Increase default timeout to accommodate axe accessibility scans on
// larger Fluent UI component trees.
jest.setTimeout(15000);

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
