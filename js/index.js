const API_KEY = 'Your_API_KEY';
const API_CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
const API_WEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&q=';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weatherIcon = document.querySelector('.mainWeatherIcon');
const weather = document.querySelector('.mainWeather');
const dailyContainer = document.querySelector('.allDailyContainer');
const hourlyContainer = document.querySelector('.allHourlyContainer');

function getDateAndTime() {
    const date = new Date();
    const currentDate = date.getDate();
    const currentMonth = months[date.getMonth()];
    const currentDay = days[date.getDay()];
    let currentHrs = date.getHours();
    let format = 'AM';
    if (currentHrs>12) {
        currentHrs = currentHrs - 12;     
        format = 'PM';   
    }
    const currentMin = date.getMinutes();
    const time = `${currentHrs}:${currentMin}`;
    const dateStr = `${currentDate} ${currentMonth}, ${currentDay}`;
    document.querySelector('.dateAndTime').innerText = `${dateStr} | ${time} ${format}`;
}

setInterval(() => {
    getDateAndTime();
}, 30000);


async function checkCurrentWeather() {
    try {
        const response = await fetch(`${API_CURRENT_WEATHER_URL}Delhi&appid=${API_KEY}`);
        const data = await response.json();
        weather.innerHTML=data.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function check3HourlyWeather() {
    const response = await fetch(`${API_WEATHER_FORECAST_URL}Delhi&appid=${API_KEY}`)
    const data = await response.json();
    console.log(data);

    // <div class="flex flex-col  mr-[30.5px]">
    //                         <p class="text-xs leading-[14.52px] font-medium">10:00</p>
    //                         <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="cloudy" class="w-8 h-8">
    //                         <p class="text-lg font-medium leading-[21.78px]">23<span class="text-[8px] font-medium absolute "><sup>&deg;C</sup></span></p>
    //                     </div>

    for (let i = 0; i < 5; i++) {
        let individualHourlyContainer = document.createElement('div');
        individualHourlyContainer.classList.add('flex', 'flex-col', 'mr-[30.5px]');
        let time = document.createElement('p');
        time.classList.add('text-xs', 'leading-[14.52px]', 'font-medium');
        time.innerText = new Date(data.list[i].dt_txt).getHours() + ':00';
        individualHourlyContainer.appendChild(time);
        let icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
        icon.classList.add('w-8', 'h-8');
        individualHourlyContainer.appendChild(icon);
        let temp = document.createElement('p');
        temp.classList.add('text-lg', 'font-medium', 'leading-[21.78px]');
        temp.innerText = `${Math.floor(data.list[i].main.temp)}`;
        let sp = document.createElement('span');
        sp.innerHTML = '<sup>&deg;C</sup>';
        sp.classList.add('text-[10px]', 'font-medium');
        temp.appendChild(sp);
        individualHourlyContainer.appendChild(temp);
        hourlyContainer.appendChild(individualHourlyContainer);
    }
    
}

async function checkWeatherForecast() {
    try {
        const response = await fetch(`${API_WEATHER_FORECAST_URL}Delhi&appid=${API_KEY}`);
        const data = await response.json();
        forecastList = data.list;
        for (let i = 0; i <= 32; i=i+8) {
            let individualDailyContainer = document.createElement('div');
            individualDailyContainer.classList.add('individualDailyContainer', 'w-full', 'flex', 'flex-row', 'justify-between', 'mb-2');
            let day = document.createElement('p');
            day.classList.add('text-lg', 'font-medium', 'leading-[21.78px]', 'w-[120px]');
            if (i==0) {
                day.innerText = 'Today';
            } else {
                day.innerText = days[new Date(forecastList[i].dt_txt).getDay()].substring(0, 3);
            }
            individualDailyContainer.appendChild(day);
            let icon = document.createElement('img');
            icon.src = `https://openweathermap.org/img/wn/${forecastList[i].weather[0].icon}.png`;
            icon.classList.add('w-8', 'h-8');
            individualDailyContainer.appendChild(icon);
            let minTemp = document.createElement('p');
            minTemp.classList.add('text-lg', 'font-medium', 'leading-[21.78px]', 'ml-4');
            minTemp.innerText = `${Math.floor(forecastList[i].main.temp_min)}`;
            let sp = document.createElement('span');
            sp.innerHTML = '<sup>&deg;C</sup>';
            sp.classList.add('text-[10px]', 'font-medium');
            minTemp.appendChild(sp);
            individualDailyContainer.appendChild(minTemp);
            let gradient = document.createElement('div');
            gradient.classList.add('custom-gradient', 'w-[120px]', 'rounded-full', 'h-1', 'm-2');
            colorPercentage = Math.floor(forecastList[i].main.temp_min)/(Math.floor(forecastList[i].main.temp_min) + Math.ceil(forecastList[i].main.temp_max)) * 100;
            gradient.setAttribute('style', `background: linear-gradient(to right, #2563eb 0%, rgba(37, 99, 235, 0.5) ${colorPercentage}%, rgba(249, 115, 22, 1) 100%)`);
            individualDailyContainer.appendChild(gradient);
            let maxTemp = document.createElement('p');
            maxTemp.classList.add('text-lg', 'font-medium', 'leading-[21.78px]');
            maxTemp.innerText = `${Math.ceil(forecastList[i].main.temp_max)}`;
            let spp = document.createElement('span');
            spp.innerHTML = '<sup>&deg;C</sup>';
            spp.classList.add('text-[10px]', 'font-medium');
            maxTemp.appendChild(spp);
            individualDailyContainer.appendChild(maxTemp);
            dailyContainer.appendChild(individualDailyContainer);
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


getDateAndTime();
checkCurrentWeather();
check3HourlyWeather();
checkWeatherForecast();
