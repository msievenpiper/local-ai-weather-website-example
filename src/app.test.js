/**
 * Unit tests for Weather App - integration tests
 */

// Load app.js after setup (setupFiles runs before this)
const WeatherApp = require('./app.js');

describe('Weather App Module', () => {
  test('should be loaded successfully', () => {
    expect(WeatherApp).toBeDefined();
  });

  test('should have init function', () => {
    expect(WeatherApp.init).toBeFunction();
  });

  test('should have fetchWeatherByCity function', () => {
    expect(WeatherApp.fetchWeatherByCity).toBeFunction();
  });

  test('should have toggleTheme function', () => {
    expect(WeatherApp.toggleTheme).toBeFunction();
  });
});

// Custom matcher
expect.extend({
  toBeFunction(received) {
    const pass = typeof received === 'function';
    return {
      pass,
      message: () => `expected ${received} to be a function`,
    };
  },
});
