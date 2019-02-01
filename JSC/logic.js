// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Add tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Define circles & popups
function createCircleMarker(feature, latlng ){
  // Update color according to magnitude
  if (feature.properties.mag < 1) {
    fillColor = "green"
  }
  else if (feature.properties.mag < 2) {
    fillColor = "greenyellow"
  }
  else if (feature.properties.mag < 3) {
    fillColor = "gold"
  }
  else if (feature.properties.mag < 4) {
    fillColor = "darkorange"
  }
  else if (feature.properties.mag < 5) {
    fillColor = "chocolate"
  }
  else if (feature.properties.mag >= 5) {
    fillColor = "firebrick"
  }
  let options = {
    radius: feature.properties.mag * 5,
    fillColor: fillColor,
    color: "black",
    weight: .5,
    fillOpacity: 0.7
  }
  return L.circleMarker(latlng, options).bindPopup("<h3>" + feature.properties.place +
  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
};

// Fetch the data from a URL
jQuery.getJSON(queryUrl, function(json) {
  // Turn the geojson data into a feature layer
  L.geoJSON(json, {
    // Call createCircleMarker for circles + popups
    pointToLayer: createCircleMarker 
  }).addTo(myMap)
});

// Build legend
var legend = L.control({
  position: 'bottomright'
});
// Add legend elements
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info-legend'),
      labels = ["0-1","1-2","2-3","3-4","4-5","5+"],
      styles = ["m1","m2","m3","m4","m5","m6"]
      div.innerHTML += `<h3>Magnitude</h3>`;
  for (var i = 0; i < labels.length; i++) {
      div.innerHTML += `<p class="${styles[i]}">${labels[i]}</p>`
  }
  return div;
};

legend.addTo(myMap);