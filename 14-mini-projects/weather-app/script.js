const apiKey = "331ca92302e15a439c9d10c2f72bc394";

// Popular countries list
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "USA", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

// Popular cities worldwide
const cities = [
  "Tokyo", "Delhi", "Shanghai", "Mumbai", "Beijing", "Cairo", "Dhaka", "Mexico City", "São Paulo", "Osaka",
  "New York", "Karachi", "Buenos Aires", "Istanbul", "Kolkata", "Manila", "Lagos", "Rio de Janeiro", "Guangzhou",
  "Los Angeles", "Moscow", "Shenzhen", "Lahore", "Bangalore", "Paris", "Bogotá", "Jakarta", "Chennai", "Lima",
  "Bangkok", "Seoul", "Nagoya", "Hyderabad", "London", "Tehran", "Chicago", "Chengdu", "Nanjing", "Wuhan",
  "Ho Chi Minh City", "Luanda", "Ahmedabad", "Kuala Lumpur", "Xi'an", "Hong Kong", "Dongguan", "Hangzhou",
  "Foshan", "Shenyang", "Riyadh", "Baghdad", "Santiago", "Surat", "Madrid", "Suzhou", "Pune", "Harbin",
  "Houston", "Dallas", "Toronto", "Dar es Salaam", "Miami", "Belo Horizonte", "Singapore", "Philadelphia",
  "Atlanta", "Fukuoka", "Khartoum", "Barcelona", "Johannesburg", "Saint Petersburg", "Qingdao", "Dalian",
  "Washington", "Yangon", "Alexandria", "Jinan", "Guadalajara", "Sydney", "Melbourne", "Brisbane", "Perth",
  "Adelaide", "Montreal", "Vancouver", "Ottawa", "Berlin", "Hamburg", "Munich", "Rome", "Milan", "Naples",
  "Vienna", "Dublin", "Brussels", "Amsterdam", "Stockholm", "Copenhagen", "Oslo", "Helsinki", "Warsaw",
  "Budapest", "Prague", "Athens", "Lisbon", "Bucharest", "Zurich", "Geneva", "Manchester", "Birmingham",
  "Liverpool", "Edinburgh", "Glasgow", "Boston", "San Francisco", "Seattle", "Phoenix", "San Diego",
  "Denver", "Las Vegas", "Portland", "Austin", "Detroit", "Minneapolis", "Cleveland", "Tampa", "Orlando"
];

let countryInput, cityInput, countrySuggestions, citySuggestions;

async function getWeather() {
  const country = document.getElementById("country").value.trim();
  const city = document.getElementById("city").value.trim();
  const resultDiv = document.getElementById("result");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (country === "" || city === "") {
    alert("Please enter both Country and City");
    return;
  }

  // Open sidebar and show loading
  openSidebar();
  resultDiv.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner"></i>
      <p>Fetching weather data...</p>
    </div>
  `;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      resultDiv.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
          <h3>City Not Found!</h3>
          <p>Please check the city and country name and try again.</p>
        </div>
      `;
      return;
    }

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const weather = data.weather[0].main;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const wind = data.wind.speed;
    const clouds = data.clouds.all;
    const visibility = (data.visibility / 1000).toFixed(1);

    // Change background based on temperature
    changeBackgroundByTemp(temp);

    // Display weather data in sidebar
    resultDiv.innerHTML = `
      <div class="city-name">
        <i class="fas fa-map-marker-alt"></i>
        ${data.name}, ${data.sys.country}
      </div>
      
      <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${weather}">
      
      <div class="temperature">${temp}°C</div>
      <div class="condition">${description.charAt(0).toUpperCase() + description.slice(1)}</div>
      
      <div class="weather-details-grid">
        <div class="weather-detail">
          <i class="fas fa-temperature-high"></i>
          <div class="label">Feels Like</div>
          <div class="value">${feelsLike}°C</div>
        </div>
        
        <div class="weather-detail">
          <i class="fas fa-tint"></i>
          <div class="label">Humidity</div>
          <div class="value">${humidity}%</div>
        </div>
        
        <div class="weather-detail">
          <i class="fas fa-wind"></i>
          <div class="label">Wind Speed</div>
          <div class="value">${wind} m/s</div>
        </div>
        
        <div class="weather-detail">
          <i class="fas fa-compress-arrows-alt"></i>
          <div class="label">Pressure</div>
          <div class="value">${pressure} hPa</div>
        </div>
        
        <div class="weather-detail">
          <i class="fas fa-cloud"></i>
          <div class="label">Cloudiness</div>
          <div class="value">${clouds}%</div>
        </div>
        
        <div class="weather-detail">
          <i class="fas fa-eye"></i>
          <div class="label">Visibility</div>
          <div class="value">${visibility} km</div>
        </div>
      </div>
    `;

  } catch (error) {
    resultDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
        <h3>Error Fetching Data</h3>
        <p>Unable to retrieve weather information. Please try again later.</p>
      </div>
    `;
    console.error("Error:", error);
  }
}

// Change background based on temperature
function changeBackgroundByTemp(temp) {
  let gradient, headerGradient;
  
  if (temp >= 35) {
    // Very Hot - Red/Orange
    gradient = 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)';
    headerGradient = 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)';
  } else if (temp >= 25) {
    // Hot - Orange/Yellow
    gradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    headerGradient = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  } else if (temp >= 15) {
    // Warm - Yellow/Green
    gradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    headerGradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  } else if (temp >= 5) {
    // Cool - Blue
    gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    headerGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  } else if (temp >= -5) {
    // Cold - Dark Blue
    gradient = 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)';
    headerGradient = 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)';
  } else {
    // Freezing - Ice Blue/White
    gradient = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    headerGradient = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  }
  
  // Apply background with smooth transition
  document.body.style.background = gradient;
  document.querySelector('.sidebar-header').style.background = headerGradient;
  document.querySelector('.search-btn').style.background = headerGradient;
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Autocomplete functionality
function filterSuggestions(input, dataArray) {
  const value = input.toLowerCase().trim();
  if (value.length < 1) return [];
  
  return dataArray.filter(item => 
    item.toLowerCase().includes(value)
  ).slice(0, 8); // Limit to 8 suggestions
}

function showSuggestions(input, suggestionsDiv, dataArray, icon) {
  const filtered = filterSuggestions(input.value, dataArray);
  
  if (filtered.length === 0) {
    suggestionsDiv.classList.remove('show');
    return;
  }
  
  suggestionsDiv.innerHTML = filtered.map(item => 
    `<div class="suggestion-item" onclick="selectSuggestion('${input.id}', '${item}')">
      <span>${item}</span>
    </div>`
  ).join('');
  
  suggestionsDiv.classList.add('show');
}

function selectSuggestion(inputId, value) {
  document.getElementById(inputId).value = value;
  document.getElementById(`${inputId}-suggestions`).classList.remove('show');
}

function hideSuggestions() {
  document.querySelectorAll('.suggestions').forEach(s => s.classList.remove('show'));
}

// Initialize autocomplete
document.addEventListener('DOMContentLoaded', function() {
  countryInput = document.getElementById('country');
  cityInput = document.getElementById('city');
  countrySuggestions = document.getElementById('country-suggestions');
  citySuggestions = document.getElementById('city-suggestions');
  
  // Country input autocomplete
  countryInput.addEventListener('input', function() {
    showSuggestions(this, countrySuggestions, countries, 'globe-americas');
  });
  
  // City input autocomplete
  cityInput.addEventListener('input', function() {
    showSuggestions(this, citySuggestions, cities, 'city');
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.input-group')) {
      hideSuggestions();
    }
  });
  
  // Allow pressing Enter to search
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        hideSuggestions();
        getWeather();
      }
    });
  });
});
