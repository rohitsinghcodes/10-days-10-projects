// main.js
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
// console.log(apiKey)

const searchInput = document.getElementById("submit");
const searchButton = document.querySelector(".search-container button");
const locationEl = document.querySelector(".location");
const dayEl = document.querySelector(".day");
const tempEl = document.querySelector(".temperature");
const minEl = document.querySelector(".min");
const maxEl = document.querySelector(".max");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind-speed");
const forecastDays = document.querySelectorAll(".forecast-days div");

let weatherData = null;

function OnClickFatch() {
    var city = document.getElementById("submit").value;
    fatchData(city)
}


async function fetchWeather(city = "Aurangabad") {
  try {
    const res = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(city)}&apikey=SJcW0CYv7c4mlNpCA7jxXAeiEWme7mMJ&timesteps=1h,1d&units=metric`);
    if (!res.ok) throw new Error("City not found or API error");
    const data = await res.json();

    weatherData = data;
    updateUI(data);
  } catch (err) {
    alert(err.message);
  }
}

function updateUI(data) {
  const current = data.timelines.hourly[0].values;
  const daily = data.timelines.daily;

  locationEl.textContent = data.location.name;
  dayEl.textContent = "Now";
  tempEl.textContent = `${current.temperature.toFixed(1)}°C`;
  minEl.textContent = `${daily[0].values.temperatureMin.toFixed(1)}°C`;
  maxEl.textContent = `${daily[0].values.temperatureMax.toFixed(1)}°C`;
  humidityEl.textContent = `${current.humidity.toFixed(0)}%`;
  windEl.textContent = `${current.windSpeed.toFixed(1)} km/h`;

  forecastDays.forEach((dayDiv, i) => {
    const dateObj = new Date(daily[i].time);
    dayDiv.querySelector("b").textContent = i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${dateObj.getUTCDate()}/${months[dateObj.getUTCMonth()]}`;
    dayDiv.querySelector("sub").textContent = `${daily[i].values.temperatureMin.toFixed(1)}°C - ${daily[i].values.temperatureMax.toFixed(1)}°C`;
    dayDiv.classList.toggle("active", i === 0);
  });
}

// Handle forecast day click
function ondays(dayId) {
  const index = [...forecastDays].findIndex(d => d.id === dayId);
  if (index === -1 || !weatherData) return;

  const daily = weatherData.timelines.daily[index];

  minEl.textContent = `${daily.values.temperatureMin.toFixed(1)}°C`;
  maxEl.textContent = `${daily.values.temperatureMax.toFixed(1)}°C`;

  if (index === 0) {
    const current = weatherData.timelines.hourly[0].values;
    dayEl.textContent = "Now";
    tempEl.textContent = `${current.temperature.toFixed(1)}°C`;
    humidityEl.textContent = `${current.humidity.toFixed(0)}%`;
    windEl.textContent = `${current.windSpeed.toFixed(1)} km/h`;
  } else {
    dayEl.textContent = document.getElementById(dayId).querySelector("b").textContent;
    tempEl.textContent = ""; // No hourly temp for future days
    humidityEl.textContent = `${daily.values.humidityMin.toFixed(0)}% - ${daily.values.humidityMax.toFixed(0)}%`;
    windEl.textContent = `${daily.values.windSpeedMin.toFixed(1)} - ${daily.values.windSpeedMax.toFixed(1)} km/h`;
  }

  // Update active class on forecast days
  forecastDays.forEach(div => div.classList.remove("active"));
  document.getElementById(dayId).classList.add("active");
}

// Event listeners
searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) fetchWeather(city);
});
searchInput.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
  }
});

// Initial load
fetchWeather();
