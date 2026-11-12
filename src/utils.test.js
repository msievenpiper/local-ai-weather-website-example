/**
 * Unit tests for Weather App utility functions
 */

beforeEach(() => {
  jest.useFakeTimers();
});

describe('Unit Conversion Functions', () => {
  describe('celsiusToFahrenheit', () => {
    test('should convert 0°C to 32°F', () => {
      expect(WeatherApp.celsiusToFahrenheit(0)).toBe(32);
    });

    test('should convert 100°C to 212°F', () => {
      expect(WeatherApp.celsiusToFahrenheit(100)).toBe(212);
    });

    test('should convert -40°C to -40°F', () => {
      expect(WeatherApp.celsiusToFahrenheit(-40)).toBe(-40);
    });
  });
});

describe('Date Formatting Functions', () => {
  describe('formatTime', () => {
    test('should format time correctly', () => {
      const date = new Date(2024, 0, 15, 14, 30);
      const formatted = WeatherApp.formatTime(date);
      
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date(2024, 0, 15);
      const formatted = WeatherApp.formatDate(date);
      
      expect(formatted).toContain('January');
    });
  });
});

describe('Search History Functions', () => {
  let localStorage;
  
  beforeEach(() => {
    localStorage = {
      data: {},
      getItem: jest.fn((key) => localStorage.data[key] || null),
      setItem: jest.fn((key, value) => {
        localStorage.data[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete localStorage.data[key];
      }),
      clear: jest.fn(() => {
        localStorage.data = {};
      }),
    };
  });

  test('should add to search history', () => {
    WeatherApp.addToSearchHistory('San Francisco', localStorage);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'weatherApp:searchHistory',
      JSON.stringify(['San Francisco'])
    );
  });

  test('should not add duplicate city', () => {
    WeatherApp.addToSearchHistory('San Francisco', localStorage);
    WeatherApp.addToSearchHistory('SAN FRANCISCO', localStorage);
    
    const saved = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(saved.length).toBe(1);
  });

  test('should limit search history to last 5', () => {
    for (let i = 0; i < 7; i++) {
      WeatherApp.addToSearchHistory(`City-${i}`, localStorage);
    }
    
    const saved = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(saved.length).toBe(5);
  });

  test('should load search history from localStorage', () => {
    const savedHistory = JSON.stringify(['New York', 'Los Angeles']);
    localStorage.getItem.mockReturnValue(savedHistory);
    
    const history = WeatherApp.loadSearchHistory(localStorage);
    
    expect(history).toEqual(['New York', 'Los Angeles']);
  });
});

describe('Temperature Functions', () => {
  let localStorage;
  
  beforeEach(() => {
    localStorage = {
      data: {},
      getItem: jest.fn((key) => localStorage.data[key] || null),
      setItem: jest.fn((key, value) => {
        localStorage.data[key] = String(value);
      }),
    };
    
    // Mock elements
    document.body.innerHTML = '<div id="unitBtnText"></div>';
    
    if (WeatherApp.CONFIG) {
      WeatherApp.CONFIG.units.temp = 'c';
    }
  });

  test('should toggle temperature unit', () => {
    WeatherApp.toggleTemperatureUnit();
    
    expect(WeatherApp.CONFIG.units.temp).toBe('f');
  });

  test('should save unit preference to localStorage', () => {
    WeatherApp.toggleTemperatureUnit();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('weatherApp:tempUnit', 'f');
  });
});

describe('Dark Mode Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<body></body>';
    localStorage.clear();
  });

  test('should enable dark mode', () => {
    WeatherApp.enableDarkMode();
    
    expect(document.body.classList.contains('dark')).toBe(true);
  });

  test('should disable dark mode', () => {
    document.body.classList.add('dark');
    
    WeatherApp.disableDarkMode();
    
    expect(document.body.classList.contains('dark')).toBe(false);
  });
});

describe('Background Functions', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html></html>';
    document.body.innerHTML = '<body></body>';
  });

  test('should set sunny gradient', () => {
    WeatherApp.setDynamicBackground('Clear Sky', 1);
    
    const gradient = getComputedStyle(document.documentElement).getPropertyValue('--weather-gradient');
    expect(gradient).toContain('linear-gradient');
  });

  test('should set rain gradient', () => {
    WeatherApp.setDynamicBackground('Light Rain', 1);
    
    const gradient = getComputedStyle(document.documentElement).getPropertyValue('--weather-gradient');
    expect(gradient).toContain('linear-gradient');
  });
});

describe('Weather Alerts', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <body>
        <div id="weatherAlerts" class="hidden">
          <ul id="alertsList"></ul>
        </div>
      </body>
    `;
  });

  test('should show rain alert', () => {
    const today = { day: { daily_chance_of_rain: 70, maxtemp_c: 25, mintemp_c: 15, maxwind_kph: 20 } };
    WeatherApp.updateWeatherAlerts(today);
    
    expect(document.getElementById('alertsList').children.length).toBe(1);
  });

  test('should show heat alert', () => {
    const today = { day: { daily_chance_of_rain: 0, maxtemp_c: 35, mintemp_c: 20, maxwind_kph: 15 } };
    WeatherApp.updateWeatherAlerts(today);
    
    expect(document.getElementById('alertsList').children.length).toBe(1);
  });

  test('should show cold alert', () => {
    const today = { day: { daily_chance_of_rain: 0, maxtemp_c: 10, mintemp_c: -5, maxwind_kph: 10 } };
    WeatherApp.updateWeatherAlerts(today);
    
    expect(document.getElementById('alertsList').children.length).toBe(1);
  });

  test('should show wind alert', () => {
    const today = { day: { daily_chance_of_rain: 0, maxtemp_c: 20, mintemp_c: 15, maxwind_kph: 50 } };
    WeatherApp.updateWeatherAlerts(today);
    
    expect(document.getElementById('alertsList').children.length).toBe(1);
  });

  test('should hide when no alerts', () => {
    const today = { day: { daily_chance_of_rain: 0, maxtemp_c: 25, mintemp_c: 15, maxwind_kph: 20 } };
    WeatherApp.updateWeatherAlerts(today);
    
    expect(document.getElementById('weatherAlerts').classList.contains('hidden')).toBe(true);
  });
});

describe('Notification Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<body></body>';
  });

  test('should create error notification', () => {
    WeatherApp.showError('Test error');
    
    // Advance timers
    jest.advanceTimersByTime(300);
    
    const notification = document.querySelector('.bg-red-500');
    expect(notification).toBeTruthy();
  });

  test('should create success notification', () => {
    WeatherApp.showSuccess('Test success');
    
    // Advance timers
    jest.advanceTimersByTime(300);
    
    const notification = document.querySelector('.bg-green-500');
    expect(notification).toBeTruthy();
  });
});

describe('Cache Functions', () => {
  let cache;
  
  beforeEach(() => {
    if (WeatherApp.state && WeatherApp.state.cache) {
      cache = WeatherApp.state.cache.weatherData;
      cache.clear();
    } else {
      cache = new Map();
    }
  });

  test('should store and retrieve cached data', () => {
    WeatherApp.setInCache('test-key', { data: 'value' });
    
    const cached = WeatherApp.getFromCache('test-key');
    expect(cached).toEqual({ data: 'value' });
  });

  test('should return null for non-existent key', () => {
    const result = WeatherApp.getFromCache('nonexistent-key');
    expect(result).toBeNull();
  });

  test('should enforce cache size limit', () => {
    for (let i = 0; i < 25; i++) {
      WeatherApp.setInCache(`key-${i}`, { data: i });
    }
    
    expect(cache.size).toBe(20);
  });
});

describe('Module Exports', () => {
  test('should have all expected functions', () => {
    expect(WeatherApp.celsiusToFahrenheit).toBeFunction();
    expect(WeatherApp.formatTime).toBeFunction();
    expect(WeatherApp.formatDate).toBeFunction();
    expect(WeatherApp.addToSearchHistory).toBeFunction();
    expect(WeatherApp.enableDarkMode).toBeFunction();
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
