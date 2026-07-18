// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

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

	if (typeof window.matchMedia !== 'function') {
		window.matchMedia = (query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		});
	}
}
