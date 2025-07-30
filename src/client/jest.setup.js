import '@testing-library/jest-dom';
const { TextEncoder, TextDecoder } = require('util');

jest.mock('./src/config/api', () => 'http://localhost:3001');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for structuredClone
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => {
    if (obj === undefined) {
      return undefined;
    }
    return JSON.parse(JSON.stringify(obj));
  };
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
