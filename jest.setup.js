// Jest setup file

beforeEach(() => {
  localStorage.clear();
});

// Mock elements that are accessed during tests
const mockElements = {};
beforeEach(() => {
  // Create a mock unitBtnText element
  document.body.innerHTML = '<div id="unitBtnText"></div>';
});
