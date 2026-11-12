/**
 * Weather App - Main Application Logic
 * Built for Apple devices with location services, Tailwind CSS and motion.js
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    weatherApi: {
      key: '', // Add your WeatherAPI.com API key here
      baseUrl: 'https://api.weatherapi.com/v1',
    },
    defaultLocation: 'San Francisco',
    units: {
      temp: 'c', // 'c' for Celsius, 'f' for Fahrenheit
      wind: 'km/h'
    }
  };

  // State Management
  const state = {
    currentLocation: null,
    weatherData: null,
    forecastData: null,
    searchHistory: [],
    darkMode: false,
    currentGradient: null,
    
    // Cache management
    cache: {
      weatherData: new Map(),
      searchResults: new Map()
    },
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 20
  };

  // Unit conversion functions
  function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  // DOM Elements
  const elements = {
    app: document.getElementById('app'),
    loadingScreen: document.getElementById('loadingScreen'),
    contentContainer: document.getElementById('contentContainer'),
    locationBtn: document.getElementById('locationBtn'),
    searchBtn: document.getElementById('searchBtn'),
    closeSearch: document.getElementById('closeSearch'),
    searchBackdrop: document.getElementById('searchBackdrop'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    themeToggle: document.getElementById('themeToggle'),
    
    // Weather display elements
    currentTemp: document.getElementById('currentTemp'),
    weatherCondition: document.getElementById('weatherCondition'),
    locationName: document.getElementById('locationName'),
    currentLocationText: document.getElementById('currentLocation'),
    weatherConditionIcon: document.getElementById('weatherConditionIcon'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    uvIndex: document.getElementById('uvIndex'),
    
    // Additional details
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    airQuality: document.getElementById('airQuality'),
    airQualityLabel: document.getElementById('airQualityLabel'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    chanceOfRain: document.getElementById('chanceOfRain'),
    
    // Forecast elements
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    
    // View full buttons
    viewHourlyFull: document.getElementById('viewHourlyFull'),
    viewDailyFull: document.getElementById('viewDailyFull')
  };

  // Error handling utility
  function showError(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce-in flex items-center space-x-2 min-w-[300px] justify-center';
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span class="font-medium">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-4');
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  function showSuccess(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce-in flex items-center space-x-2 min-w-[300px] justify-center';
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span class="font-medium">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('opacity-0', 'translate-y-4');
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // Initialize the application
  function init() {
    setupEventListeners();
    
    // Load search history from localStorage
    loadSearchHistory();

    // Try to get location from localStorage or use default
    const savedLocation = localStorage.getItem('weatherApp:lastLocation');
    
    if (savedLocation) {
      state.currentLocation = savedLocation;
      fetchWeatherByCity(savedLocation);
    } else {
      // Request location permission
      requestGeoLocation();
    }

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('weatherApp:theme');
    if (savedTheme === 'dark') {
      enableDarkMode();
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode();
      }
    }

    // Initialize temperature unit from localStorage
    const savedUnit = localStorage.getItem('weatherApp:tempUnit');
    if (savedUnit) {
      CONFIG.units.temp = savedUnit;
      elements.unitBtnText.textContent = savedUnit === 'c' ? '°C' : '°F';
    }

    // Hide loading screen after a minimum time
    setTimeout(() => {
      if (!elements.contentContainer.classList.contains('hidden')) {
        elements.loadingScreen.style.display = 'none';
      }
    }, 500);
  }

  // Setup event listeners
  function setupEventListeners() {
    // Location button
    elements.locationBtn.addEventListener('click', requestGeoLocation);

    // Search functionality
    elements.searchBtn.addEventListener('click', openSearch);
    elements.closeSearch.addEventListener('click', closeSearch);
    elements.searchBackdrop.addEventListener('click', closeSearch);

    // Search input
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = elements.searchInput.value.trim();
        if (searchTerm) {
          fetchWeatherByCity(searchTerm);
          closeSearch();
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });

    // Temperature unit toggle
    elements.unitToggle.addEventListener('click', toggleTemperatureUnit);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // View full buttons (placeholders for future functionality)
    elements.viewHourlyFull.addEventListener('click', () => {
      showSuccess('View full hourly forecast feature coming soon!');
    });

    elements.viewDailyFull.addEventListener('click', () => {
      showSuccess('View full daily forecast feature coming soon!');
    });
  }

  // Update UI for loading state
  function showLoading() {
    elements.loadingScreen.classList.remove('hidden');
    elements.contentContainer.classList.add('hidden');
  }

  // Update UI for loaded state
  function showContent() {
    elements.loadingScreen.classList.add('hidden');
    elements.contentContainer.classList.remove('hidden');
  }

  // Request geolocation
  function requestGeoLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser');
      fetchWeatherByCity(CONFIG.defaultLocation);
      return;
    }

    elements.locationBtn.innerHTML = '<div class="loader w-6 h-6"></div>';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        showError('Unable to retrieve your location. Using default location.');
        elements.locationBtn.innerHTML = elements.locationBtn.innerHTML.replace('<div class="loader w-6 h-6"></div>', '');
        fetchWeatherByCity(CONFIG.defaultLocation);
      }
    );
  }

  // Fetch weather by coordinates (reverse geocoding)
  async function fetchWeatherByCoordinates(latitude, longitude) {
    const cacheKey = `coords:${latitude},${longitude}`;
    
    // Check cache first
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      state.currentLocation = cachedData.location;
      state.weatherData = cachedData.weatherData;
      
      // Show loading briefly for smooth UX
      showLoading();
      setTimeout(() => {
        renderWeather();
        showContent();
      }, 100);
      return;
    }
    
    showLoading();
    
    try {
      const response = await fetch(
        `${CONFIG.weatherApi.baseUrl}/forecast.json?key=${CONFIG.weatherApi.key}&q=${latitude},${longitude}&days=7&aqi=yes&alerts=no`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      // Store location name
      state.currentLocation = {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      };

      localStorage.setItem('weatherApp:lastLocation', state.currentLocation.name);

      // Store weather data
      state.weatherData = {
        current: data.current,
        forecast: data.forecast.forecastday
      };

      // Cache the response
      setInCache(cacheKey, {
        location: state.currentLocation,
        weatherData: state.weatherData
      });

      renderWeather();
      
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      showError('Unable to fetch weather data. Please try again.');
    }
  }

  // Fetch weather by city name
  async function fetchWeatherByCity(city) {
    const cacheKey = `city:${city.toLowerCase()}`;
    
    // Check cache first
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      state.currentLocation = cachedData.location;
      state.weatherData = cachedData.weatherData;
      
      // Show loading briefly for smooth UX
      showLoading();
      setTimeout(() => {
        renderWeather();
        showContent();
      }, 100);
      return;
    }
    
    showLoading();
    
    try {
      const response = await fetch(
        `${CONFIG.weatherApi.baseUrl}/forecast.json?key=${CONFIG.weatherApi.key}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=no`
      );

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      
      // Store location name
      state.currentLocation = {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      };

      localStorage.setItem('weatherApp:lastLocation', state.currentLocation.name);

      // Store weather data
      state.weatherData = {
        current: data.current,
        forecast: data.forecast.forecastday
      };

      // Cache the response
      setInCache(cacheKey, {
        location: state.currentLocation,
        weatherData: state.weatherData
      });

      showSuccess(`Weather updated for ${state.currentLocation.name}`);
      renderWeather();
      
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      showError('City not found. Please check the spelling.');
    }
  }

  // Search functionality
  function openSearch() {
    elements.searchModal.classList.remove('hidden');
    setTimeout(() => {
      elements.searchInput.focus();
    }, 100);
  }

  function closeSearch() {
    elements.searchModal.classList.add('hidden');
    elements.searchInput.value = '';
    elements.searchResults.innerHTML = '';
  }

  // Debounce function for search input
  let searchTimeout = null;
  
  async function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      elements.searchResults.innerHTML = '';
      return;
    }

    // Debounce search requests
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `${CONFIG.weatherApi.baseUrl}/search.json?key=${CONFIG.weatherApi.key}&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const results = await response.json();
        
        if (results.length > 0) {
          renderSearchResults(results);
        } else {
          elements.searchResults.innerHTML = '<p class="text-gray-500 p-2">No locations found</p>';
        }
      } catch (error) {
        console.error('Search error:', error);
        elements.searchResults.innerHTML = '<p class="text-gray-500 p-2">Error searching locations</p>';
      }
    }, 300); // Wait 300ms after typing stops before making request
  }

  // Render search results
  function renderSearchResults(locations) {
    elements.searchResults.innerHTML = '';
    
    locations.forEach(location => {
      const resultItem = document.createElement('div');
      resultItem.className = 'p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors';
      resultItem.innerHTML = `
        <div class="font-medium text-gray-900 dark:text-white">${location.name}</div>
        <div class="text-sm text-gray-500">${location.region}, ${location.country}</div>
      `;
      
      resultItem.addEventListener('click', () => {
        addToSearchHistory(location.name);
        fetchWeatherByCity(location.name);
        closeSearch();
      });
      
      elements.searchResults.appendChild(resultItem);
    });
    
    renderRecentSearches();
  }

  // Add to search history
  function addToSearchHistory(city) {
    if (!city) return;
    
    // Remove if already exists
    state.searchHistory = state.searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    state.searchHistory.unshift(city);
    
    // Keep only last 5 searches
    if (state.searchHistory.length > 5) {
      state.searchHistory = state.searchHistory.slice(0, 5);
    }
    
    // Save to localStorage
    localStorage.setItem('weatherApp:searchHistory', JSON.stringify(state.searchHistory));
    
    renderRecentSearches();
  }

  // Load search history from localStorage
  function loadSearchHistory() {
    const savedHistory = localStorage.getItem('weatherApp:searchHistory');
    if (savedHistory) {
      try {
        state.searchHistory = JSON.parse(savedHistory);
      } catch (error) {
        console.error('Error loading search history:', error);
        state.searchHistory = [];
      }
    }
  }

  // Render recent searches
  function renderRecentSearches() {
    const container = document.getElementById('recentSearchList');
    const recentSection = document.getElementById('recentSearches');
    
    if (!container || !recentSection) return;
    
    if (state.searchHistory.length === 0) {
      recentSection.classList.add('hidden');
      return;
    }
    
    container.innerHTML = '';
    recentSection.classList.remove('hidden');
    
    state.searchHistory.forEach(city => {
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group cursor-pointer';
      item.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-[#007AFF] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-gray-700 dark:text-gray-200">${city}</span>
        </div>
      `;
      
      item.addEventListener('click', () => {
        fetchWeatherByCity(city);
        closeSearch();
      });
      
      container.appendChild(item);
    });
  }

  // Toggle temperature unit
  function toggleTemperatureUnit() {
    const currentUnit = CONFIG.units.temp;
    const newUnit = currentUnit === 'c' ? 'f' : 'c';
    
    CONFIG.units.temp = newUnit;
    
    // Update button text
    elements.unitBtnText.textContent = newUnit === 'c' ? '°C' : '°F';
    
    // Save preference
    localStorage.setItem('weatherApp:tempUnit', newUnit);
    
    // Refresh weather display with new units
    if (state.weatherData) {
      renderWeather();
    }
    
    showSuccess(`Temperature unit switched to ${newUnit === 'c' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}`);
  }

  // Render weather data
  function renderWeather() {
    if (!state.weatherData) return;

    const { current, forecast } = state.weatherData;
    const today = forecast[0];
    
    // Update main weather display
    const tempDisplay = CONFIG.units.temp === 'f' 
      ? Math.round(current.temp_f) + '°F'
      : Math.round(current.temp_c) + '°C';
    elements.currentTemp.textContent = tempDisplay;
    elements.weatherCondition.textContent = current.condition.text;
    
    // Update location
    if (state.currentLocation) {
      elements.locationName.textContent = `${state.currentLocation.name}, ${state.currentLocation.country}`;
      elements.currentLocationText.textContent = state.currentLocation.name;
    }

    // Update weather condition icon
    updateWeatherIcon(current.condition.code);
    
    // Set background based on weather conditions
    setDynamicBackground(current.condition.text, current.is_day);

    // Update additional details
    const feelsLikeDisplay = CONFIG.units.temp === 'f'
      ? Math.round(current.feelslike_f) + '°F'
      : Math.round(current.feelslike_c) + '°C';
    elements.feelsLike.textContent = feelsLikeDisplay;
    elements.humidity.textContent = current.humidity + '%';
    elements.windSpeed.textContent = Math.round(current.wind_kph) + ' km/h';
    elements.uvIndex.textContent = current.uv;

    // Update sunrise/sunset
    const sunriseTime = today.astros.sunrise;
    const sunsetTime = today.astros.sunset;
    
    // Format times
    elements.sunrise.textContent = sunriseTime.split(' ')[0];
    elements.sunset.textContent = sunsetTime.split(' ')[0];

    // Update air quality
    if (current.air_quality) {
      const usEpaIndex = current.air_quality['us-epa-index'];
      const labels = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
      const colors = ['#34C759', '#FFD60A', '#FF9500', '#FF3B30', '#AF52DE', '#8E8E93'];
      
      elements.airQuality.textContent = usEpaIndex;
      elements.airQualityLabel.textContent = labels[usEpaIndex - 1] || 'Unknown';
      elements.airQualityLabel.style.color = colors[usEpaIndex - 1] || 'inherit';
    } else {
      elements.airQuality.textContent = '--';
      elements.airQualityLabel.textContent = 'N/A';
    }

    // Update other details
    elements.visibility.textContent = (current.vis_km || 0).toFixed(1);
    elements.pressure.textContent = Math.round(current.pressure_mb || 0);
    elements.chanceOfRain.textContent = today.day.daily_chance_of_rain + '%';

    // Update hourly forecast
    renderHourlyForecast(current, today);

    // Update daily forecast
    renderDailyForecast(forecast);

    // Apply animations using motion.js
    animateContent();

    // Update loading state
    showContent();
  }

  // Set dynamic background based on weather conditions
  function setDynamicBackground(conditionText, isDay) {
    const condition = conditionText.toLowerCase();
    
    let gradient;
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      gradient = isDay 
        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      gradient = 'linear-gradient(135deg, #9fa8da 0%, #c5cae9 100%)';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      gradient = 'linear-gradient(135deg, #37474f 0%, #607d8b 100%)';
    } else if (condition.includes('thunderstorm') || condition.includes('storm')) {
      gradient = 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)';
    } else if (condition.includes('snow')) {
      gradient = 'linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      gradient = 'linear-gradient(135deg, #7f8c8d 0%, #bdc3c7 100%)';
    } else {
      gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    document.documentElement.style.setProperty('--weather-gradient', gradient);
    
    // Store current gradient for theme toggling
    state.currentGradient = gradient;
  }

  // Toggle dark mode
  function toggleTheme() {
    state.darkMode = !state.darkMode;
    
    if (state.darkMode) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }

  function enableDarkMode() {
    document.body.classList.add('dark');
    
    // Preserve weather gradient in dark mode
    const baseGradient = state.currentGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.documentElement.style.setProperty('--weather-gradient', baseGradient);
    
    // Adjust gradient for dark mode
    document.documentElement.style.setProperty('--weather-gradient', 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)');
    
    localStorage.setItem('weatherApp:theme', 'dark');
  }

  function disableDarkMode() {
    document.body.classList.remove('dark');
    
    // Restore weather gradient
    const baseGradient = state.currentGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.documentElement.style.setProperty('--weather-gradient', baseGradient);
    
    localStorage.setItem('weatherApp:theme', 'light');
  }

  // Update weather icon
  function updateWeatherIcon(conditionCode) {
    const conditionMap = {
      1000: 'sunny', 1003: 'partly-cloudy', 1006: 'cloudy',
      1009: 'overcast', 1030: 'mist', 1069: 'patchy-rain',
      1072: 'light-drizzle', 1087: 'patchy-light',
      1114: 'moderate', 1135: 'heavy', 1147: 'sleet',
      1168: 'light-rain', 1171: 'heavy-rain', 1189: 'light',
      1192: 'moderate', 1195: 'heavy', 1204: 'light',
      1207: 'moderate', 1210: 'heavy', 1213: 'light',
      1216: 'moderate', 1219: 'heavy', 1222: 'light',
      1225: 'moderate', 1237: 'hail',
      1261: 'light-showers', 1264: 'moderate',
      1277: 'heavy-showers', 1282: 'moderate',
      1285: 'heavy', 1294: 'light-sleet',
      1298: 'moderate', 1305: 'heavy-sleet',
      1308: 'light-showers', 1311: 'moderate',
      1314: 'heavy', 1317: 'light',
      1320: 'moderate', 1323: 'heavy',
      1326: 'light-showers', 1329: 'moderate',
      1332: 'heavy', 1335: 'light',
      1338: 'moderate', 1341: 'heavy',
      1344: 'patchy-snow', 1347: 'moderate',
      1350: 'heavy-snow', 1353: 'light',
      1356: 'moderate', 1359: 'heavy',
      1362: 'light-showers', 1365: 'moderate',
      1368: 'heavy-showers', 1371: 'light',
      1374: 'moderate', 1377: 'heavy',
      1382: 'light-showers', 1385: 'moderate',
      1388: 'heavy-showers', 1400: 'fog',
      1403: 'freezing-fog'
    };

    const weatherType = conditionMap[conditionCode] || 'cloudy';
    
    // Create icon based on weather type
    let iconHtml = '';
    
    switch(weatherType) {
      case 'sunny':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="5"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>`;
        break;
      case 'partly-cloudy':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>`;
        break;
      case 'cloudy':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>`;
        break;
      case 'overcast':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.433"></path>
          </svg>`;
        break;
      case 'rainy':
      case 'patchy-rain':
      case 'light-drizzle':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-bounce-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
          </svg>`;
        break;
      case 'snowy':
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="8" y1="20" x2="8" y2="20"></line>
            <line x1="12" y1="18" x2="12" y2="18"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
            <line x1="16" y1="20" x2="16" y2="20"></line>
          </svg>`;
        break;
      default:
        iconHtml = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-white animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 15.25"></path>
          </svg>`;
    }

    elements.weatherConditionIcon.innerHTML = iconHtml;
  }

  // Render hourly forecast
  function renderHourlyForecast(current, today) {
    elements.hourlyForecast.innerHTML = '';
    
    // Start from current hour and show next 24 hours
    const startTime = new Date(current.last_updated);
    
    for (let i = 0; i < 24; i++) {
      const hourTime = new Date(startTime.getTime() + (i + 1) * 60 * 60 * 1000);
      const hourForecast = today.hour[i];
      
      if (!hourForecast) continue;

      // Highlight current or upcoming hours
      const isCurrentHour = i === 0;
      const hourItem = document.createElement('div');
      hourItem.className = `flex flex-col items-center min-w-[70px] p-3 rounded-xl transition-all duration-300 ${isCurrentHour ? 'bg-white/20 scale-105 shadow-lg' : 'hover:bg-white/10'}`;
      hourItem.innerHTML = `
        <span class="text-sm font-medium text-white mb-1">${hourTime.getHours()}:00</span>
        <div class="my-2 animate-on-scroll" style="animation-delay: ${(i + 1) * 0.05}s">
          ${getHourlyWeatherIcon(hourForecast.condition.code)}
        </div>
        <span class="text-lg font-bold text-white">${CONFIG.units.temp === 'f' ? Math.round(hourForecast.temp_f) : Math.round(hourForecast.temp_c)}°${CONFIG.units.temp.toUpperCase()}</span>
        <div class="flex items-center space-x-1 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span class="text-xs text-white/70">${hourForecast.chance_of_rain}%</span>
        </div>
      `;
      
      elements.hourlyForecast.appendChild(hourItem);
    }
  }

  // Get hourly weather icon
  function getHourlyWeatherIcon(conditionCode) {
    // Simplified icons for hourly forecast
    if (conditionCode >= 1069 && conditionCode <= 1237) {
      // Rain
      return `<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    } else if (conditionCode >= 1344 && conditionCode <= 1388) {
      // Snow
      return `<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="8" y1="20" x2="8" y2="20"></line><line x1="12" y1="18" x2="12" y2="18"></line><line x1="16" y1="16" x2="16" y2="16"></line><line x1="16" y1="20" x2="16" y2="20"></line></svg>`;
    } else if (conditionCode === 1000) {
      // Sunny
      return `<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
    } else {
      // Cloudy
      return `<svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    }
  }

  // Render daily forecast
  function renderDailyForecast(forecast) {
    elements.dailyForecast.innerHTML = '';
    
    forecast.forEach((day, index) => {
      if (index === 0) return; // Skip today, already shown in hourly

      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
      const isToday = index === 1; // Highlight tomorrow

      const dayItem = document.createElement('div');
      dayItem.className = `flex flex-col sm:flex-row justify-between items-center p-4 hover:bg-white/5 rounded-xl transition-all duration-300 ${isToday ? 'bg-gradient-to-r from-white/20 to-white/10 border-l-4 border-blue-300' : ''}`;
      dayItem.innerHTML = `
        <div class="flex items-center space-x-3 mb-2 sm:mb-0">
          <span class="text-gray-800 dark:text-white font-bold w-16">${dayName}</span>
          <div class="hidden sm:block">
            ${getDailyWeatherIcon(day.day.condition.code)}
          </div>
        </div>
        <div class="flex items-center space-x-3 mb-2 sm:mb-0">
          <span class="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">${day.day.condition.text}</span>
        </div>
        <div class="flex items-center space-x-6">
          <div class="text-right">
            <span class="block text-gray-900 dark:text-white font-bold text-xl">${CONFIG.units.temp === 'f' ? Math.round(day.day.maxtemp_f) : Math.round(day.day.maxtemp_c)}°${CONFIG.units.temp.toUpperCase()}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">${CONFIG.units.temp === 'f' ? Math.round(day.day.mintemp_f) : Math.round(day.day.mintemp_c)}°${CONFIG.units.temp.toUpperCase()}</span>
          </div>
        </div>
      `;
      
      elements.dailyForecast.appendChild(dayItem);
    });
  }

  // Get daily weather icon
  function getDailyWeatherIcon(conditionCode) {
    if (conditionCode >= 1069 && conditionCode <= 1237) {
      return `<svg class="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    } else if (conditionCode >= 1344 && conditionCode <= 1388) {
      return `<svg class="h-6 w-6 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path></svg>`;
    } else if (conditionCode === 1000) {
      return `<svg class="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>`;
    } else {
      return `<svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    }
  }

  // Animate content using motion.js
  function animateContent() {
    // Use CSS animations defined in styles for smooth transitions
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    
    // Clear previous visible class
    animatedElements.forEach(element => {
      element.classList.remove('visible');
      void element.offsetWidth;
    });
    
    // Add animation classes with staggered delays
    animatedElements.forEach((element, index) => {
      // Skip if already has visible class
      if (element.classList.contains('visible')) return;
      
      // Add animation class with delay based on position
      const delay = Math.min(index * 100, 800); // Cap at 800ms
      setTimeout(() => {
        element.classList.add('visible');
      }, delay);
    });
  }

  // Expose public methods
  window.WeatherApp = {
    init: init,
    fetchWeatherByCity: fetchWeatherByCity,
    toggleTheme: toggleTheme
  };

  // Cache utility functions
  function getFromCache(key) {
    const cached = state.cache.weatherData.get(key);
    if (cached && Date.now() - cached.timestamp < state.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  function setInCache(key, data) {
    // Clean up old cache entries if limit exceeded
    if (state.cache.weatherData.size >= state.cache.maxCacheSize) {
      const oldestKey = state.cache.weatherData.keys().next().value;
      state.cache.weatherData.delete(oldestKey);
    }
    
    state.cache.weatherData.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
