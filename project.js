let search = document.getElementById("countrySelect");
let btn = document.querySelector(".explore-btn");
let mode = "dark";
let themeBtn = document.getElementById("modeBtn");

modeBtn.addEventListener("click", () =>
{
    if(mode==="dark"){
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        mode="light";
    }
    else{
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        mode="dark";
    }
});

for(code in country)
    {
        optionValue = document.createElement("option");
        optionValue.innerText=code;
        optionValue.value=country[code];
        
        if(code==="Japan")
            optionValue.selected="selected";

        search.append(optionValue);
    }
    // search.addEventListener("change", (evt) =>
    // {
    //    //heroSection(evt.target);
    //     let countryCode = search.value;
    //     let countryName = Object.keys(country).find(key => country[key] === countryCode);
    //     heroSection({value: countryCode});
    //     factsSection({value: countryCode});
    //     //weatherSection({value: countryCode});
    //     destinationSection({value: countryCode});
    //     footerSection({value: countryCode});

    // });

    btn.addEventListener("click", () =>
    {
       let countryCode = search.value;
        let countryName = Object.keys(country).find(key => country[key] === countryCode);
        heroSection({value: countryCode});
        factsSection({value: countryCode});
        //weatherSection({value: countryCode});
        //destinationSection({value: countryCode});
        footerSection({value: countryCode});

    });

    const heroSection = (event) => {
       // hero.style.backgroundImage =  `url("https://flagsapi.com/${event.value}/shiny/64.png")`;
       // hero.style.backgroundSize = "100% 100%";
       let countryCode=event.value;
       let countryName = Object.keys(country).find(key => country[key] === countryCode);

        let destinationDescription = document.getElementById("destinationDescription");
        destinationDescription.innerText = `Must-visit places in ${countryName}`;
    
       let code = document.querySelector(".country-code");
       code.innerText = countryCode;
       let name = document.getElementById("countryName");
       name.innerText = countryName;

       updateCaption(countryName, countryCode);
       updateDescription(countryName, countryCode, countryDescription);
       updateHero(countryName, countryCode);

       let location = document.querySelector(".location");
       location.innerText = `📍 ${countryName}`;
    };

    const updateCaption = (countryName, countryCode) => {
        let caption = document.getElementById("countryCaption");
        let countryCaption = countryCaptions[countryName];
        //console.log(countryCaption);
        caption.innerText = countryCaption;
    }
    
    const updateDescription = (countryName, countryCode) => {
        let countryDescription = document.getElementById("countryDescription");
        let description = countryDescriptions[countryName];
        countryDescription.innerText = description;
    }

    const updateHero = (countryName, countryCode) => {
        let hero = document.querySelector(".hero");
        hero.style.backgroundImage =  `url("https://picsum.photos/seed/${countryName.toLowerCase()}/1920/700")`;
        hero.style.backgroundSize = "100% 100%";
    }

    const factsSection = async (event) => {
        let countryCode=event.value;
        let countryName = Object.keys(country).find(key => country[key] === countryCode);
        let facts = document.getElementById("countryFacts");
        facts.innerText = `Get a quick overview of ${countryName}`; 

        const response = await fetch(`https://countries.dev/alpha/${countryCode}`);
        const data = await response.json();

        let capital = document.getElementById("capital");
        capital.innerText = data.capital;

        let currency = document.getElementById("currency");
        currency.innerText = data.currencies[0].name;

        let language = document.getElementById("language");
        language.innerText = data.languages[0].name;

        let population = document.getElementById("population");
        const populationNumber = data.population.toLocaleString();
        population.innerText = populationNumber;
        
        getCoordinates(data.capital, countryCode);
    }

    const getCoordinates = async (capital, countryCode) => {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1`);
        const data = await response.json();
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        getWeather(latitude, longitude, countryCode);
    }
    const getWeather = async (latitude, longitude, countryCode) => {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json(); 

        const daily = data.daily;

        document.getElementById("currentTemp").innerText = `${daily.temperature_2m_max[0]}°C`;
        document.getElementById("currentHumidity").innerText = ` Humidity ${data.current.relative_humidity_2m}%`;
        document.getElementById("currentWeather").innerText = getWeatherDescription(data.current.weather_code);

        document.getElementById("day1").innerText = daily.time[1];
        document.getElementById("temp1").innerText = `${daily.temperature_2m_max[1]}° / ${daily.temperature_2m_min[1]}°`;

        document.getElementById("day2").innerText = daily.time[2];
        document.getElementById("temp2").innerText = `${daily.temperature_2m_max[2]}° / ${daily.temperature_2m_min[2]}°`;

        document.getElementById("day3").innerText = daily.time[3];
        document.getElementById("temp3").innerText = `${daily.temperature_2m_max[3]}° / ${daily.temperature_2m_min[3]}°`;

        document.getElementById("day4").innerText = daily.time[4];
        document.getElementById("temp4").innerText = `${daily.temperature_2m_max[4]}° / ${daily.temperature_2m_min[4]}°`;

        document.getElementById("day5").innerText = daily.time[5];
        document.getElementById("temp5").innerText = `${daily.temperature_2m_max[5]}° / ${daily.temperature_2m_min[5]}°`;
        
    }

    function getWeatherDescription(weatherCode) {
        let weatherImage = document.querySelector(".weather-main");
        if(weatherCode === 0){ 
            weatherImage.style.backgroundImage =  `url("images/sunny.jpg")`;
            return "Sunny";
        }
        if(weatherCode === 1){
            weatherImage.style.backgroundImage =  `url("images/mainly-clear.jpg")`;
            return "Mainly Clear";
        }
        if(weatherCode === 2){
            weatherImage.style.backgroundImage =  `url("images/partly-cloudy.webp")`;
            return "Partly Cloudy";
        }
        if(weatherCode === 3){
            weatherImage.style.backgroundImage =  `url("images/cloudy.webp")`;
            return "Cloudy";
        }
        if(weatherCode >= 51 && weatherCode <= 67){
            weatherImage.style.backgroundImage =  `url("images/rainy.jpeg")`;
            return "Rainy";
        }
        if(weatherCode >= 71 && weatherCode <= 77){
            weatherImage.style.backgroundImage =  `url("images/snowy.jpg")`;
            return "Snowy";
        }
        if(weatherCode >= 80 && weatherCode <= 82){
            weatherImage.style.backgroundImage =  `url("images/rain-shower.webp")`;
            return "Rain Showers";
        }
        if(weatherCode >= 85 && weatherCode <= 86){
            weatherImage.style.backgroundImage =  `url("images/snow-shower.webp")`;
            return "Snow Showers";
        }
        if(weatherCode >= 95){
            weatherImage.style.backgroundImage =  `url("images/thunderstorm.webp")`;
            return "Thunderstorm";
        }
        weatherImage.style.backgroundImage =  `url("images/erratic.webp")`;
        return "Unpredictable Weather";
    }

    destinationSection = async(event) => {
        let countryCode=event.value;
        let countryName = Object.keys(country).find(key => country[key] === countryCode);

        let destinationDescription = document.getElementById("destinationDescription");
        destinationDescription.innerText = `Must-visit places in ${countryName}`;

    const response = await fetch(
        `https://map.orizn.app/api/v1/spots?country=${countryCode}&limit=4`
    );

    const data = await response.json();

    console.log(data);
    console.log(data.spots[0].name);
        let place1img = document.getElementById("place1img");
        place1img.src = data.spots[0].photos;
        let place1name = document.getElementById("place1name");
        place1name.innerText = data.spots[0].title;
        let place1description = document.getElementById("place1description");
        place1description.innerText = data.spots[0].description;

        let place2img = document.getElementById("place2img");
        place2img.src = data.spots[1].photos;
        let place2name = document.getElementById("place2name");
        place2name.innerText = data.spots[1].title;
        let place2description = document.getElementById("place2description");
        place2description.innerText = data.spots[1].description;

        let place3img = document.getElementById("place3img");
        place3img.src = data.spots[2].photos;
        let place3name = document.getElementById("place3name");
        place3name.innerText = data.spots[2].title;
        let place3description = document.getElementById("place3description");
        place3description.innerText = data.spots[2].description;

        let place4img = document.getElementById("place4img");
        place4img.src = data.spots[3].photos;
        let place4name = document.getElementById("place4name");
        place4name.innerText = data.spots[3].title;
        let place4description = document.getElementById("place4description");
        place4description.innerText = data.spots[3].description;

    }

    const footerSection = (event) => {
        let countryCode=event.value;
        let countryName = Object.keys(country).find(key => country[key] === countryCode);
        let footerDescription = document.getElementById("readyToExplore");
        footerDescription.innerText = `Ready to explore ${countryName}?`;
    }