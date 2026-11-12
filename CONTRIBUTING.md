# Contributing to Weather App

Thank you for your interest in contributing to the Weather App! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/weather-app.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. The app will be available at `http://localhost:8080`

## Project Structure

```
weather-app/
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── src/
    ├── styles.css         # Main CSS file (includes Tailwind directives)
    └── app.js             # Application logic
```

## Coding Guidelines

### JavaScript Style Guide

- Use ES6+ features (arrow functions, template literals, destructuring)
- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic

### CSS Style Guide

- Use Tailwind utility classes for styling
- Follow the existing component structure
- Ensure responsive design for mobile, tablet, and desktop

### API Key Configuration

Before running the app locally:

1. Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/)
2. Create a `.env` file in the project root
3. Add your API key: `WEATHER_API_KEY=your_api_key_here`

## Types of Contributions

### Bug Fixes

1. Open an issue describing the bug
2. Create a fix in a new branch
3. Reference the issue in your commit

### New Features

1. Open an issue to discuss the feature
2. Implement the feature in a new branch
3. Update documentation as needed

### Documentation

1. Improve existing documentation
2. Add new examples or use cases
3. Fix typos or unclear explanations

## Testing

Before submitting a Pull Request:

1. Test on multiple devices (mobile, tablet, desktop)
2. Test in different browsers (Safari, Chrome, Firefox)
3. Verify dark mode functionality
4. Test location services
5. Verify API data fetching

## Pull Request Process

1. Provide a detailed description of the changes
2. Include screenshots for visual changes
3. List any breaking changes
4. Update the README if needed

## Code Review

All submissions require review. Please be patient and address any feedback.

## Questions?

Feel free to open an issue for any questions about contributing!
