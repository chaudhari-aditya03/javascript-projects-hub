const apiKey = "3fe7fb1ade69f0ac8477eaaf10d87a98";

async function getWeather() {
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;
  const resultDiv = document.getElementById("result");

  if (country === "" || city === "") {
    alert("Please enter both Country and City");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=331ca92302e15a439c9d10c2f72bc394&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      resultDiv.innerHTML = "❌ City not found!";
      return;
    }

    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;
    const wind = data.wind.speed;

    resultDiv.innerHTML = `
      <h2>${city}, ${country}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
      <p>🌡️ Temperature: ${temp}°C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌥️ Condition: ${weather}</p>
      <p>🌬️ Wind Speed: ${wind} m/s</p>
    `;

  } catch (error) {
    resultDiv.innerHTML = "⚠️ Error fetching weather data!";
  }
}
