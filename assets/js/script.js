$(document).ready(function () {
    //search button functionality 
    $("#search-button").on("click", function () {
      var searchInput = $("#search-input").val();
      $("#search-input").val("");
      currentWeatherCard(searchInput);
      fiveDayForecast(searchInput);
    });
  
    //load search history from local storage
    var searchHistory = JSON.parse(localStorage.getItem("history")) || [];
  
    //sets history array search to correct length
    if (searchHistory.length > 0) {
      currentWeatherCard(searchHistory[searchHistory.length - 1]);
    }

    //creates a row for each search element
    for (var i = 0; i < searchHistory.length; i++) {
      createRow(searchHistory[i]);
    }
  
    //Most recent searched cities will be sent to bottom of history list
    function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
    }
  
    //listener for list item on click function
    $(".history").on("click", "li", function () {
      currentWeatherCard($(this).text());
      fiveDayForecast($(this).text());
    });
  
    //Main weather card functionality
    function currentWeatherCard(searchInput) {
  
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput +  "&appid=474a074d15c43a8bc728f79fec76d3eb&units=imperial",
  
        //logic that checks if user input already is in history. If it is not, it will add it to the history once searched.
      }).then(function (data) {
        if (searchHistory.indexOf(searchInput) === -1) {
          searchHistory.push(searchInput);
          localStorage.setItem("history", JSON.stringify(searchHistory));
          createRow(searchInput);
        }

        // clears previous weather info before loading new one
        $("#current-weather").empty();

        //Card creation and card data
        var title = $("<h2>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#current-weather").append(card);

      });
    }
    
    //five day forecast logic and functionality
    function fiveDayForecast(searchInput) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&appid=474a074d15c43a8bc728f79fec76d3eb&units=imperial",
  
      }).then(function (data) {
        $("#five-day").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
        //for loop for creating the five day forecast cards and 
        //filling them with the required data
        for (var i = 0; i < data.list.length; i++) {
  
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
  
            var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colFive = $("<div>").addClass("col-md-2.5");
            var cardFive = $("<div>").addClass("card bg-primary text-white");
            var cardBodyFive = $("<div>").addClass("card-body p-2");
            var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
            var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].wind.speed + "MPH");
            var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            
            colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, windFive, humidFive)));
            $("#five-day .row").append(colFive);
          }
        }
      });
    }
  
  });
 