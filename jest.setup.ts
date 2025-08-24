import '@testing-library/jest-dom';

// React act() 警告を抑制（Firebase Auth非同期操作用）
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to') &&
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Node.js環境でのWeb APIs模擬（Firebase Auth用）
if (typeof global.fetch === 'undefined') {
  // Responseクラスの簡易モック
  global.Response = class Response {
    constructor(public body: any, public init: any = {}) {}
    json() { return Promise.resolve(this.body); }
    text() { return Promise.resolve(String(this.body)); }
    get status() { return this.init.status || 200; }
    get ok() { return this.status >= 200 && this.status < 300; }
  } as any;

  // fetchのモック
  global.fetch = jest.fn(() =>
    Promise.resolve(new global.Response(null, { status: 200 }))
  );
}

// Headers、Request、URLSearchParamsのモック
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor() {}
    append() {}
    delete() {}
    get() { return null; }
    has() { return false; }
    set() {}
  } as any;
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(public url: string, public init: any = {}) {}
  } as any;
}

if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = class URLSearchParams {
    constructor() {}
    append() {}
    delete() {}
    get() { return null; }
    has() { return false; }
    set() {}
  } as any;
}

// LocalStorageのモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMediaのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
