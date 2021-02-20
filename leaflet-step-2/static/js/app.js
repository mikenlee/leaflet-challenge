
// Define variables for our tile layers
// Adding tile layer
var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
})

var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// Only one base layer can be shown at a time
var baseMaps = {
  'Light base map': light,
  'Dark base map': dark,
  'Street base map': streets
};


var earthquakesLayer = new L.LayerGroup();
var tectonicplates = new L.LayerGroup();

// Overlays that may be toggled on or off
var overlayMaps = {
  'Earthquakes': earthquakesLayer,
  'Tectonic Plates': tectonicplates
};

// Creating map object and set default layers
var myMap = L.map("map", {
  center: [41.29530, -96.55809],
  zoom: 1,
  layers: [dark, earthquakesLayer]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Use these links to get the geojson data.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


//****************************************
//    EARTHQUAKE LAYER                  //
//****************************************

// Grabbing our GeoJSON data
// Grab the data with d3
d3.json(url).then(response => {

  function getColor(d) {
    return d >= 90 ? 'red' : 
      d >= 70 ? '#ff6666' : 
      d >= 50 ? 'orange' :
      d >= 30 ? 'yellow' : 
      d >= 10 ? '#CCFF00' : 
      d >= -10 ? 'green' : 
      '#C05900'; 
  }
  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: feature.properties.mag,
      stroke: true,
      weight: 0.5
    };
  }

  // An array which will be used to store created markers 
  var earthquakeMarkers = [];
  // Loop through data
  response.features.forEach(earthquake => {
    // Set the data location property to a variable
    var location = earthquake.geometry;

    earthquakeMarkers.push(
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius: earthquake.properties.mag,
        fillColor: getColor(location.coordinates[2]),
        color: getColor(location.coordinates[2]),
        fillOpacity: 1
      })
        .bindPopup(earthquake.properties.place)
    );
  });

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(response, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
    // We add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakesLayer);

  // Then we add the earthquake layer to our map.
  earthquakesLayer.addTo(myMap);



  
});



//****************************************
//    TECTONIC LAYER                    //
//****************************************

// Here we make an AJAX call to get our Tectonic Plate geoJSON data.
d3.json(tectonicUrl).then(platedata => {
    
    // Adding our geoJSON data, along with style information, to the tectonicplates
    // layer.
    L.geoJson(platedata, {
      color: "orange",
      weight: 1
    })
    .addTo(tectonicplates);

    // Then add the tectonicplates layer to the map.
    tectonicplates.addTo(myMap);
    
  });

