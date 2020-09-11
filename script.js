$(document).ready(function () {

    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
    var appId = "fca73468a9f85b96d53c6930a6f82317";
    var imgUrl = "https://openweathermap.org/img/wn/";
    var resolution = "@2x.png"
    var locations = [];
    var locationTemperature = [];

    $('#search').keyup(delay(function (e) {
        $('#load').css({ "display": "none" });
        $.ajax({
            type: 'GET',
            url: weatherUrl + this.value + '&appid=' + appId,
            success: function (data) {
                loadData(data);
                visualResponse();
            }
        })
    }, 500));



    function loadData(data) {
        console.log(data);
        locations.push(data);
        var temperature = data.main.temp - 273.15;
        var maxTemp = data.main.temp_max - 273.15;
        var minTemp = data.main.temp_min - 273.15;
        var name = data.name;
        var tempLoc = { name, temperature };
        locationTemperature.push(tempLoc);
        $("#cardPanel").append('<div class="col-sm-3 col-lg-3 col-md-3 col-xs-12 cardHolder animate__animated animate__slideInLeft"> <div class="w-100 h-100 card" style="border: 1px solid darkgrey;"> <div class="row w-100" style="height: 80%; margin: auto;"> <div class="col-6"> <img src="' + imgUrl + data.weather[0].icon + resolution + '" alt="" id="weatherImage" style="height: 70% !important; max-height: 70% !important"> <p id="weatherImageTitle"> ' + data.weather[0].main + ' </p> </div> <div class="col-6"> <div class="row" style="height: 25%; "> <div class="col-6" style="display: flex; justify-content: center; align-items: center; background-color: darkorange; color: whitesmoke;"> Maximum </div> <div class="col-6" style="display: flex; justify-content: center; align-items: center; border-bottom: 1px solid darkgrey ">' + maxTemp.toFixed(1) + '°C</div> </div> <div class="row" style="height: 25%; "> <div class="col-6" style="display: flex; justify-content: center; align-items: center; background-color: darkorange; color: whitesmoke;"> Minimum </div> <div class="col-6" style="display: flex; justify-content: center; align-items: center; border-bottom: 1px solid darkgrey ">' + minTemp.toFixed(1) + '°C</div> </div> <div class="row" style="height: 25%; border: "> <div class="col-6" style="display: flex; justify-content: center; align-items: center; background-color: darkorange; color: whitesmoke;"> Humidity </div> <div class="col-6" style="display: flex; justify-content: center; align-items: center; border-bottom: 1px solid darkgrey ">' + data.main.humidity + '% </div> </div> <div class="row" style="height: 25%; border: "> <div class="col-6" style="display: flex; justify-content: center; align-items: center; background-color: darkorange; color: whitesmoke;"> Pressure </div> <div class="col-6" style="display: flex; justify-content: center; align-items: center; border-bottom: 1px solid darkgrey ">' + data.main.pressure + ' hPa </div> </div> </div> </div> <div class="row" style="height: 20%; width: 100%; margin: auto; background-color: darkorange; color: whitesmoke;"> <div class="col-12" style="display: flex; justify-content: center; align-items: center;"> <b>' + data.name + ' </b> </div> </div> </div> </div>');
        var table = $("table").DataTable();
        table.row.add([
            data.name,
            temperature.toFixed(1),
            unixConverter(data.sys.sunrise),
            unixConverter(data.sys.sunset)
        ]).draw();
        renderGraph();
    }

    function visualResponse() {
        $('#search').val("");
        $('.centered').css({ "animation-name": "example", "animation-duration": "2s", "height": "20%" });
        $('#load').css({ "display": "block" });
        $('#panel').css({ "display": "block" });
    }

    function unixConverter(unix) {
        var date = new Date(unix * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    }

    function delay(callback, ms) {
        var timer = 0;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    $("#buttonCard").click(function () {
        $('#graphPanel').css({ "display": "none" });
        $('#tablePanel').css({ "display": "none" });
        $('#cardPanel').css({ "display": "block" });
    });

    $("#buttonTable").click(function () {
        $('#graphPanel').css({ "display": "none" });
        $('#cardPanel').css({ "display": "none" });
        $('#tablePanel').css({ "display": "block" });
    });

    $("#buttonGraph").click(function () {
        $('#cardPanel').css({ "display": "none" });
        $('#tablePanel').css({ "display": "none" });
        $('#graphPanel').css({ "display": "block" });
    });

    function renderGraph() {
        var dps = [];

        function parseDataPoints() {
            for (var i = 0; i <= locationTemperature.length -1; i++)
            
            dps.push({ y: locationTemperature[i].temperature, label: locationTemperature[i].name });
        };

        parseDataPoints();

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,

            title: {
                text: "Temperature of Cities"
            },
            axisX: {
                interval: 1
            },
            axisY2: {
                interlacedColor: "rgba(1,77,101,.2)",
                gridColor: "rgba(1,77,101,.1)",
                title: "Temperature of cities"
            },
            data: [{
                type: "bar",
                name: "cities",
                axisYType: "secondary",
                color: "#014D65",
                dataPoints: dps

            }]
        });
        chart.options.data[0].dataPoints = dps;
        chart.render();
    }
});