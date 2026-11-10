import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Storage Mock for jsdom test runner
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

const localMock = createStorageMock();
const sessionMock = createStorageMock();

Object.defineProperty(window, "localStorage", {
  value: localMock,
  writable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  value: localMock,
  writable: true,
});

Object.defineProperty(window, "sessionStorage", {
  value: sessionMock,
  writable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: sessionMock,
  writable: true,
});
