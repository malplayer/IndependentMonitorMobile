


var birdiFeedID="e0664612675c3f92e43ab42c1c433979";
var birdiApiKey="e617adaf1f66a88e230969188e1a0648";
var stepFeedID="1583f80a2c43b4e8d120990d1d9b787c";
var stepApiKey="5fa06ba076a4d00ded678203729de33a";
var streamCo="co-indoor";
var streamCo2="co2-indoor";
var streamStep="steps";

var m2x_birdi = new M2X(birdiApiKey);
var m2x_step = new M2X(stepApiKey);

// setup control widget
var updateInterval = 5000;

// setup plot
var options = {
    xaxis: { mode: "time", timezone: "browser" },

    colors: ["#8ccb00"],

    grid: {
        color: "#c9cdce",
        hoverable: true
    },

    series: {
        lines: { show: true },
        points: { show: true }
    }

};
var stepPlot = $.plot($("#stepChart"), [0,0], options);
var coPlot = $.plot($("#coChart"), [0,0], options);
var co2Plot = $.plot($("#co2Chart"), [0,0], options);



var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var createStepChart = function()
{
    var chartdata = [];
    m2x_step.feeds.streamValues(stepFeedID, streamStep, function(data) {
        console.log("m2xStepJson:\n" +JSON.stringify(data) );
        var m2x_data = data.values;


        for (i = 0; i < m2x_data.length; i++) {
            chartdata.push([
                Date.parse(m2x_data[i].at),
                parseFloat(m2x_data[i].value)
            ]);
        }
        //alert(chartdata);
        stepPlot.setData([chartdata]);
        stepPlot.setupGrid();
        stepPlot.draw();
        setTimeout(createStepChart, updateInterval);
    });
}

var createCoChart = function()
{
    var chartdata = [];
    m2x_birdi.feeds.streamValues(birdiFeedID, streamCo, function(data) {
        console.log("m2xCoJson:\n" +JSON.stringify(data) );
        var m2x_data = data.values;


        for (i = 0; i < m2x_data.length; i++) {
            chartdata.push([
                Date.parse(m2x_data[i].at),
                parseFloat(m2x_data[i].value)
            ]);
        }
        //alert(chartdata);
        coPlot.setData([chartdata]);
        coPlot.setupGrid();
        coPlot.draw();
        setTimeout(createCoChart, updateInterval);
    });
}
var createCo2Chart = function()
{
    var chartdata = [];
    m2x_birdi.feeds.streamValues(birdiFeedID, streamCo2, function(data) {
        console.log("m2xCo2Json:\n" +JSON.stringify(data) );
        var m2x_data = data.values;


        for (i = 0; i < m2x_data.length; i++) {
            chartdata.push([
                Date.parse(m2x_data[i].at),
                parseFloat(m2x_data[i].value)
            ]);
        }
        //alert(chartdata);
        co2Plot.setData([chartdata]);
        co2Plot.setupGrid();
        co2Plot.draw();
        setTimeout(createCo2Chart, updateInterval);
    });
}


var test= function()
{

    var url = "http://api-m2x.att.com/v1/feeds/1583f80a2c43b4e8d120990d1d9b787c/streams/steps/values";
    $.ajax({
        url: url,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-M2X-KEY", stepApiKey);
        },
        success: function(data) {

            console.log("ajaxson:\n" +JSON.stringify(data) );

        },
        method:"GET"
    });


}






var showTooltip=function(x, y, contents) {
    $('<div id="flotTip" class="jq_tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y + 5,
        left: x + 5
    }).appendTo("body").fadeIn(0);
}



var previousPoint = null;
$(".jq_chart").bind("plothover", function (event, pos, item){
    $("#x").text(pos.x.toFixed(2));
    $("#y").text(pos.y.toFixed(2));

    if (item) {
        if (previousPoint != item.dataIndex){
            previousPoint = item.dataIndex;

            $(".jq_tooltip").remove();

            var x = (new Date(item.datapoint[0])).toUTCString(),
                y = item.datapoint[1].toFixed(2);


            showTooltip(item.pageX, item.pageY,
                "<span class=value>" + y + "</span><span class=timestamp>" + x + "</span>");
        }
    }

    else {
        $(".jq_tooltip").remove();
        previousPoint = null;
    }

});

$( document ).on( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!

   // $.mobile.allowCrossDomainPages = true;
});

$(document).on('pageinit', "#step", function (event) {
   createStepChart();
    test();

});
$(document).on('pageinit', "#co", function (event) {
    createCoChart();

});
$(document).on('pageinit', "#co2", function (event) {
    createCo2Chart();

});


