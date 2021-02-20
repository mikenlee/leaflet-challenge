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

// Function that will determine the color of a neighborhood based on the borough it belongs to
// function chooseColor(borough) {
//   switch (borough) {
//   case "Brooklyn":
//     return "yellow";
//   case "Bronx":
//     return "red";
//   case "Manhattan":
//     return "orange";
//   case "Queens":
//     return "green";
//   case "Staten Island":
//     return "purple";
//   default:
//     return "black";
//   }
// }

// Grabbing our GeoJSON data
// Grab the data with d3
d3.json(url).then(response => {

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();
  
  // LAYERS/SITES POP UP COLOUR CIRCLE MARKERS
  function getColor(depth) {
    switch (depth) {
      case '1':
        return  'orange';
      case 'Regen':
        return 'green';
      case 'LLU':
        return 'blue';
      case 'Colo':
        return 'purple';
      case 'DMSU':
        return 'blue';
      default:
        return 'white';
    }
  }

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

// d3.json(link).then(data => {
//   // Creating a geoJSON layer with the retrieved data
//   L.geoJson(data, {
//     // Style each feature (in this case a neighborhood)
//     style: function(feature) {
//       return {
//         color: "white",
//         // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
//         fillColor: chooseColor(feature.properties.borough),
//         fillOpacity: 0.5,
//         weight: 1.5
//       };
//     },
//     // Called on each feature
//     onEachFeature: function(feature, layer) {
//       // Set mouse events to change map styling
//       layer.on({
//         // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
//         mouseover: function(event) {
//           layer = event.target;
//           layer.setStyle({
//             fillOpacity: 0.9
//           });
//         },
//         // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
//         mouseout: function(event) {
//           layer = event.target;
//           layer.setStyle({
//             fillOpacity: 0.5
//           });
//         },
//         // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
//         click: function(event) {
//           myMap.fitBounds(event.target.getBounds());
//         }
//       });
//       // Giving each feature a pop-up with information pertinent to it
//       layer.bindPopup(`<h1>${feature.properties.neighborhood}</h1><hr/><h2 style='text-align: center;'>${feature.properties.borough}</h2>`);

//     }
//   }).addTo(myMap);
// });
