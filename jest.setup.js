// Jest setup file

beforeEach(() => {
  // Create a fresh mock storage for each test
  const mockStorage = { data: {} };
  
  global.localStorage = {
    getItem: jest.fn((key) => mockStorage.data[key] || null),
    setItem: jest.fn((key, value) => {
      mockStorage.data[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete mockStorage.data[key];
    }),
    clear: jest.fn(() => {
      mockStorage.data = {};
    }),
  };
});

// Mock elements that are accessed during tests
beforeEach(() => {
  // Create a mock unitBtnText element
  document.body.innerHTML = '<div id="unitBtnText"></div>';
});
