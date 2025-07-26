
const API_KEY = "dd974d661770405e8e058bf1b0199982";

// Helper function to convert Kelvin to Celsius and round it.
const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

// Select all DOM elements at the start for better organization and performance.
// I'm assuming these are the IDs in your HTML.
const ui = {
    cityname: document.getElementById("cityname"),
    cloud_pct: document.getElementById("cloud_pct"),
    temp: document.getElementById("temp"),
    temp2: document.getElementById("temp2"),
    feels_like: document.getElementById("feels_like"),
    humidity: document.getElementById("humidity"),
    humidity2: document.getElementById("humidity2"),
    min_temp: document.getElementById("min_temp"),
    max_temp: document.getElementById("max_temp"),
    wind_speed: document.getElementById("wind_speed"),
    wind_speed2: document.getElementById("wind_speed2"),
    wind_degrees: document.getElementById("wind_degrees"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    submitButton: document.getElementById("submits"),
    cityInput: document.getElementById("city"), // Assuming the input field has id="city"
};

/**
 * Updates the user interface with weather data.
 * Handles missing data by showing a dash ('-').
 * @param {object} data - The weather data object from the API.
 * @param {string} cityName - The name of the city to display.
 */
const updateWeatherUI = (data, cityName) => {
    // OpenWeatherMap returns data in a different structure, so we map it here.
    ui.cityname.innerHTML = data.name || cityName;
    ui.cloud_pct.textContent = data.clouds?.all ?? '-';
    ui.temp.textContent = data.main?.temp ? kelvinToCelsius(data.main.temp) : '-';
    ui.temp2.textContent = data.main?.temp ? kelvinToCelsius(data.main.temp) : '-';
    ui.feels_like.textContent = data.main?.feels_like ? kelvinToCelsius(data.main.feels_like) : '-';
    ui.humidity.textContent = data.main?.humidity ?? '-';
    ui.humidity2.textContent = data.main?.humidity ?? '-';
    ui.min_temp.textContent = data.main?.temp_min ? kelvinToCelsius(data.main.temp_min) : '-';
    ui.max_temp.textContent = data.main?.temp_max ? kelvinToCelsius(data.main.temp_max) : '-';
    ui.wind_speed.textContent = data.wind?.speed ?? '-';
    ui.wind_speed2.textContent = data.wind?.speed ?? '-';
    ui.wind_degrees.textContent = data.wind?.deg ?? '-';
    // Format UNIX timestamps to a readable local time string
    ui.sunrise.textContent = data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : '-';
    ui.sunset.textContent = data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : '-';
};

/**
 * Fetches weather for a city and handles the entire process, including errors.
 * Uses async/await for cleaner, more readable asynchronous code.
 * @param {string} city - The name of the city to search for.
 */
const getWeather = async (city) => {
  // Add a check to ensure a placeholder API key isn't being used.
  if (API_KEY === "YOUR_NEW_OPENWEATHERMAP_API_KEY" || !API_KEY) {
    ui.cityname.innerHTML = `<span style="color: orange;">Please add your OpenWeatherMap API key to weather.js</span>`;
    return;
  }

  // Prevent API call if the city name is empty
  const trimmedCity = city.trim();
  if (!trimmedCity) {
    ui.cityname.innerHTML = "Please enter a city name to search.";
    return; // Exit the function early
  }

  updateWeatherUI({}, `Loading weather for ${trimmedCity}...`);
  try {
    // URL-encode the city name to handle spaces and special characters
    // Note the new URL structure for OpenWeatherMap
    const encodedCity = encodeURIComponent(trimmedCity);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    updateWeatherUI(data, trimmedCity);
  } catch (err) {
    console.error(err);
    // Provide a more specific message for the common API key error.
    if (err.message.toLowerCase().includes('invalid api key')) {
        updateWeatherUI({}, `<span style="color: orange;">The API key is invalid or not yet active. Please check your key and wait if it's new.</span>`);
    } else {
        updateWeatherUI({}, `<span style="color: red;">Could not get weather for "${trimmedCity}".<br><small>${err.message}</small></span>`);
    }
  }
};

ui.submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  getWeather(ui.cityInput.value);
});

getWeather("Delhi");
