// Creating map object
var myMap = L.map("map", {
  center: [41.29530, -96.55809],
  zoom: 1
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


// Grabbing our GeoJSON data
// Grab the data with d3
d3.json(url).then(response => {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();
  
  // Function that will determine the color of earthquake based on depth
  function getColor(d) {
    return d >= 90 ? 'red' : 
      d >= 70 ? '#ff6666' : 
      d >= 50 ? 'orange' :
      d >= 30 ? 'yellow' : 
      d >= 10 ? '#CCFF00' : 
      d >= -10 ? 'green' : 
      '#C05900'; 
  }

  // Loop through data
  for (var i = 0; i < response.features.length; i++) {
    console.log(response.features[i].geometry);  
    // Set the data location property to a variable
    var location = response.features[i].geometry;

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius: response.features[i].properties.mag,
        fillColor: getColor(location.coordinates[2]),
        color: getColor(location.coordinates[2]),
        fillOpacity: 1
      })
        .bindPopup(response.features[i].properties.place));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(markers);
});