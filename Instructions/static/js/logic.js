// some code is from activity 10

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag +"</h4>");
  }


// Function for Circle Color Base on Criteria. The Color Scale is base of the 7 colors of a Rainboy ROY G BIV
function QuakeColor(Qcolor) {
    switch(true) {
        case (0 <= Qcolor && Qcolor <= 1.0):
          return "Red";
        case (1.0 <= Qcolor && Qcolor <= 2.0):
            return "Orange";
        case (2.0 <= Qcolor && Qcolor<= 3.0):
          return "Yellow";
        case (3.0 <= Qcolor && Qcolor<= 4.0):
            return "Green";
        case (4.0 <= Qcolor && Qcolor<= 5.0):
            return "Blue";
        case (5.0 <= Qcolor && Qcolor <= 6.0):
          return "Indigo";
        default:
          return "Violet";
    }
  }
//   Create a circle function

function CircleMaker(features, latlng){
    var CircleOptions = {
        radius: features.properties.mag * 8,
        fillColor: QuakeColor(features.properties.mag),
        color: QuakeColor(features.properties.mag),
        opacity: 1.0,
        fillOpacity: .5

    }
    return L.circleMarker(latlng, CircleOptions)
}
  // Create a GeoJSON 
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: CircleMaker
  });

  // earthquakes layer 
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // streetmap and Satellite layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });


  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  // base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Satellite Map": Satellite
  };

  // overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

// display information about our map
var info = L.control({
    position: "bottomright"
  });
// Add legend
info.addTo(myMap);

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
