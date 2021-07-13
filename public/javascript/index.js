// when the page loads
window.addEventListener("load", () => {
  let currentTime = document.querySelector(".current-time");
  let location = document.querySelector(".current-location");

  // month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // week days name
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function currentTimeDay() {
    var today = new Date();
    var hours = today.getHours();
    var ampm = hours >= 12 ? "PM" : "AM";

    // changing the background image based on the time
    changeBackground(hours);

    var time =
      today.getHours() +
      ":" +
      ((today.getMinutes() < 10 ? "0" : "") + today.getMinutes());
    currentTime.textContent =
      days[today.getDay()] + ", " + "Updated at " + time + " " + ampm;
  }

  function getLocation() {
    var requestUrl = "http://ip-api.com/json";
    $.ajax({
      url: requestUrl,
      type: "GET",
      success: function (json) {
        location.textContent = json.city + ", " + json.country;
      },
      error: function (err) {
        console.log("Request failed, error= " + err);
      },
    });
  }

  function changeBackground(hours) {
    if ((hours) => 19) {
      let imgUrl = "./images/night.jpg";
      $(".app-background").css("background-image", 'url("' + imgUrl + '")');
    } else if (hours < 19 && hours > 8) {
      let imgUrl = "./images/morning.jpg";
      $(".app-background").css("background-image", 'url("' + imgUrl + '")');
    } else {
      let imgUrl = "./images/banner_5.jpg";
      $(".app-background").css("background-image", 'url("' + imgUrl + '")');
    }
  }

  getLocation();
  currentTimeDay();

  const server = "http://localhost:4000";
  let currentIcon = document.querySelector("#urrent_day_icon");
  let currentTemp = document.querySelector(".current-day-temp");
  let currentWeather = document.querySelector(".current-weather-large");

  const weatherdata = async () => {
    const response = await fetch(`${server}/getWeatherInfo`, {
      method: "Get",
    });
    const data = await response.json();
    const {
      current: {
        temp,
        feels_like,
        humidity,
        dew_point,
        visibility,
        wind_speed,
        pressure,
      },
      current: {
        weather: [{ main, description }],
      },
    } = data;
    // adding current temperature data
    $(".current-day-temp").append(
      `${Math.floor(temp)} <sup>o    <small>C</small></sup>`
    );
    // feels like
    $(".feels-like").append(
      `Feels Like ${Math.floor(feels_like)} <sup>o</sup>`
    );
    $(".wind").append(`Wind ${Math.floor(wind_speed)} mph`);
    $(".pressure").append(`Pressure ${pressure} in`);
    $(".visibility").append(`visibility ${visibility} mi`);
    $(".humidity").append(`Humidity ${humidity}%`);
    $(".dewPoint").append(`Dew Point ${dew_point} <sup>o</sup>`);

    currentWeather.textContent = description;
    let iconClass = getIconclass(main);
    $("#current_day_icon").addClass(`${iconClass}`);

    // destructuring for daily data
    createForecastWeatherData(data.daily);
  };

  weatherdata();

  function createForecastWeatherData(daily) {
    for (let i = 0; i <= daily.length - 3; i++) {
      temp = daily[i].temp["day"];
      weather = daily[i].weather[0].main;
      description = daily[i].weather[0].description;
      createForecastElement(temp, weather, description);
    }
  }

  let i = 0;
  var today = new Date();
  function createForecastElement(temp, weather, description) {
    // creating seperating weather elements for each day upto next 6
    if (i == 6) {
      i = 0;
    } else {
      i++;
    }

    //let day = days[today.getDay() + i];
    let day = moment().day(today.getDay() + i);
    const htmlElements = $(`
          <div class="forecast-weather-data">
          <span class="day">${day}</span>
          <i class="bi ${getIconclass(weather)} medium-icon"></i>
          <p class="small-temp">${Math.floor(temp)}<sup>o  C</sup></p>
          <p class="small-weather-desc">${description}</p>
          </div>
          `);
    $(".forecast-weather").append(htmlElements);
  }

  function getIconclass(weatherDetails) {
    switch (weatherDetails) {
      case "Clear":
        return "bi-brightness-high";
        break;
      case "Clouds":
        return "bi-cloud";
        break;
      case "Rain":
        return "bi-cloud-rain";
        break;
      case "Drizzle":
        return "bi-cloud-drizzle";
        break;
      case "Thunderstorm":
        return "bi-cloud-lightning";
        break;
      case "Snow":
        return "bi-cloud-snow";
        break;
      case "Snow":
        return "bi-cloud-snow";
        break;
      default:
        return "bi-cloud";
    }
  }
});
