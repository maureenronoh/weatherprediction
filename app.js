const API_KEY = '69e20e39c75055f17f81af73fc5eff14'; // Get free API key from openweathermap.org
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorDiv = document.getElementById('error');
const cityButtons = document.querySelectorAll('.city-btn');
const loadAllBtn = document.getElementById('loadAllBtn');

const allKenyaCities = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi',
    'Thika', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru',
    'Naivasha', 'Kericho', 'Machakos', 'Lamu', 'Kilifi', 'Bungoma',
    'Embu', 'Nanyuki', 'Kisii', 'Ruiru', 'Kikuyu', 'Kiambu',
    'Voi', 'Homa Bay', 'Narok', 'Isiolo', 'Wajir', 'Mandera',
    'Marsabit', 'Lodwar', 'Moyale', 'Busia', 'Siaya', 'Migori',
    'Nyahururu', 'Naro Moru', 'Karatina', 'Murang\'a', 'Kerugoya',
    'Makueni', 'Kitui', 'Mwingi', 'Wote', 'Taveta', 'Kwale',
    'Diani Beach', 'Watamu', 'Maralal', 'Kapenguria', 'Webuye',
    'Mumias', 'Kapsabet', 'Bomet', 'Sotik', 'Namananga', 'Kajiado',
    'Ngong', 'Limuru', 'Githunguri', 'Ol Kalou', 'Gilgil'
];

const majorCities = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi'];

// Load major cities on page load
window.addEventListener('load', () => {
    loadMultipleCities(majorCities);
});

loadAllBtn.addEventListener('click', () => {
    loadAllBtn.textContent = 'Loading...';
    loadAllBtn.disabled = true;
    loadMultipleCities(allKenyaCities);
    setTimeout(() => {
        loadAllBtn.textContent = 'Refresh All Cities';
        loadAllBtn.disabled = false;
    }, 3000);
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const city = btn.getAttribute('data-city');
        getWeather(city);
    });
});

async function loadMultipleCities(cities) {
    weatherContainer.innerHTML = '';
    hideError();
    
    for (const city of cities) {
        try {
            const response = await fetch(
                `${API_URL}?q=${encodeURIComponent(city)},KE&appid=${API_KEY}&units=metric`
            );
            
            if (response.ok) {
                const data = await response.json();
                addWeatherCard(data);
            }
        } catch (error) {
            console.error(`Error loading ${city}:`, error);
        }
    }
}

async function getWeather(city) {
    try {
        hideError();
        weatherContainer.innerHTML = '';
        
        const response = await fetch(
            `${API_URL}?q=${encodeURIComponent(city)},KE&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key or wait 10-15 minutes for activation.');
            } else if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else {
                throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
            }
        }
        
        const data = await response.json();
        console.log('Weather data:', data);
        addWeatherCard(data);
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch weather data.');
    }
}

function addWeatherCard(data) {
    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = `
        <h2>${data.name}</h2>
        <div class="weather-main">
            <div class="temp-display">${Math.round(data.main.temp)}°C</div>
            <div class="weather-icon">${data.weather[0].description}</div>
        </div>
        <div class="weather-details">
            <div class="detail">
                <span class="label">Feels Like</span>
                <span class="value">${Math.round(data.main.feels_like)}°C</span>
            </div>
            <div class="detail">
                <span class="label">Humidity</span>
                <span class="value">${data.main.humidity}%</span>
            </div>
            <div class="detail">
                <span class="label">Wind Speed</span>
                <span class="value">${data.wind.speed.toFixed(1)} m/s</span>
            </div>
        </div>
    `;
    weatherContainer.appendChild(card);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}
