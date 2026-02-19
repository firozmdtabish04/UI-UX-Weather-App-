/* AUTO LOCATION ON LOAD */
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getWeatherByCoords(
          pos.coords.latitude,
          pos.coords.longitude,
          "Your Location",
          "",
        );
      },
      (err) => {
        console.log("Location permission denied");
      },
    );
  }
};

function getMyLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      getWeatherByCoords(
        pos.coords.latitude,
        pos.coords.longitude,
        "Your Location",
        "",
      );
    },
    (err) => {
      document.getElementById("error").innerText =
        "Please allow location access";
    },
  );
}

async function searchWeather() {
  const city = document.getElementById("cityInput").value;

  if (!city) return;

  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
  );

  const geoData = await geo.json();

  if (!geoData.results) {
    document.getElementById("error").innerText = "City not found";
    return;
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  getWeatherByCoords(latitude, longitude, name, country);
}

async function getWeatherByCoords(lat, lon, name, country) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
  );

  const data = await res.json();

  const weather = data.current_weather;

  document.getElementById("weatherCard").classList.remove("hidden");

  document.getElementById("city").innerText =
    name + (country ? ", " + country : "");

  document.getElementById("temp").innerText = weather.temperature;

  const condition = getCondition(weather.weathercode);

  document.getElementById("condition").innerText = condition.text;

  document.getElementById("weatherIcon").innerText = condition.icon;

  document.getElementById("wind").innerText = weather.windspeed + " km/h";

  document.getElementById("direction").innerText = weather.winddirection + "°";

  document.getElementById("feels").innerText = weather.temperature + "°C";

 document.getElementById("time").innerText = new Date(
   weather.time,
 ).toLocaleTimeString();

}

function getCondition(code) {
  if (code == 0) return { text: "Clear Sky", icon: "☀️" };
  if (code <= 3) return { text: "Cloudy", icon: "☁️" };
  if (code <= 67) return { text: "Rain", icon: "🌧️" };
  if (code <= 77) return { text: "Snow", icon: "❄️" };
  if (code <= 95) return { text: "Thunderstorm", icon: "⛈️" };
  return { text: "Unknown", icon: "🌍" };
}
