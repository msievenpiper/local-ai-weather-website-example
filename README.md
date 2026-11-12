# Weather App

A beautiful, mobile-first weather application built for Apple devices with location services, Tailwind CSS, and motion.js.

## Features

- 🌍 Real-time weather data from WeatherAPI.com
- 📱 Mobile-first design that scales to desktop
- 🗺️ Location services integration
- 🌙 Dark mode support
- 📊 Comprehensive weather information including:
  - Current temperature and conditions
  - Hourly forecast for the next 24 hours
  - 7-day forecast
  - Air quality index
  - Sunrise/sunset times
  - Humidity, wind speed, and more

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
2. WeatherAPI.com API key ([Get your free key here](https://www.weatherapi.com/))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/michaelsievenpiper/Code/personal/weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure WeatherAPI.com API key:**
   
   Open `src/app.js` and add your WeatherAPI.com API key:
   ```javascript
   const CONFIG = {
     weatherApi: {
       key: 'YOUR_API_KEY_HERE', // Add your API key here
       baseUrl: 'https://api.weatherapi.com/v1',
     },
     // ... rest of config
   };
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   
   Navigate to `http://localhost:8080` to view your weather app.

## Project Structure

```
weather-app/
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
└── src/
    ├── styles.css         # Main CSS file (includes Tailwind directives)
    └── app.js             # Application logic
└── dist/
    └── style.css          # Compiled CSS (generated)
```

## Development

### Running in Dev Mode
```bash
npm run dev
```
This will watch your CSS files and automatically rebuild when changes are made.

### Building for Production
```bash
npm run build
```
This will create a minified version of the CSS for production.

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **JavaScript (ES6+)** - Application logic
- **Motion.js** - Animation library for smooth transitions
- **WeatherAPI.com API** - Real-time weather data

## Responsive Design

The app is designed with a mobile-first approach and scales beautifully to desktop screens:

- **Mobile (0-768px)**: Single column layout optimized for touch
- **Tablet (768px-1024px)**: Two-column layout with improved spacing
- **Desktop (1024px+)**: Three-column layout with enhanced features

## Apple Device Optimization

- Uses system fonts for native appearance
- Implements iOS-specific meta tags
- Optimized for Retina displays
- Supports dark mode (automatic based on system settings)
- Tap targets sized appropriately for touch interaction

## Browser Support

- Safari (primary target)
- Chrome
- Firefox
- Edge

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Multiple location support
- [ ] Weather widgets for home screen
- [ ] Minute-by-minute precipitation forecasts
- [ ] Weather maps integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Icons and UI inspiration from modern weather applications
- Built with Apple device users in mind

## Contact

Michael Sievenpiper - [@yourprofile](https://github.com/yourprofile)

Project Link: [https://github.com/yourprofile/weather-app](https://github.com/yourprofile/weather-app)
