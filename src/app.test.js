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

  test('should have celsiusToFahrenheit function', () => {
    expect(WeatherApp.celsiusToFahrenheit).toBeFunction();
  });

  test('should have formatTime function', () => {
    expect(WeatherApp.formatTime).toBeFunction();
  });

  test('should have formatDate function', () => {
    expect(WeatherApp.formatDate).toBeFunction();
  });

  test('should have addToSearchHistory function', () => {
    expect(WeatherApp.addToSearchHistory).toBeFunction();
  });

  test('should have loadSearchHistory function', () => {
    expect(WeatherApp.loadSearchHistory).toBeFunction();
  });

  test('should have enableDarkMode function', () => {
    expect(WeatherApp.enableDarkMode).toBeFunction();
  });

  test('should have disableDarkMode function', () => {
    expect(WeatherApp.disableDarkMode).toBeFunction();
  });

  test('should have setDynamicBackground function', () => {
    expect(WeatherApp.setDynamicBackground).toBeFunction();
  });

  test('should have updateWeatherAlerts function', () => {
    expect(WeatherApp.updateWeatherAlerts).toBeFunction();
  });

  test('should have showError function', () => {
    expect(WeatherApp.showError).toBeFunction();
  });

  test('should have showSuccess function', () => {
    expect(WeatherApp.showSuccess).toBeFunction();
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
