const API_KEY = "pk.eyJ1IjoibHJlbmtlbCIsImEiOiJjamxoNWUweTgwMjVyM3BuMjB3NDkzYXp5In0.Zw0QRoKwa5J76-zechRiOA";

const endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [39.6660, -105.2045],
    zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap)

function chooseColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'orange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
  };

function createCircleMarker(feature, latlng) {
    let options = {
        radius: feature.properties.mag *3, 
        weight: "1",
        color: "darkgray",
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: "50%"
    }

    return L.circleMarker(latlng, options )
                        .bindTooltip(`Location: ${feature.properties.place} <br>
                                      Magnitude: ${feature.properties.mag}`)
}

fetch(endpoint)
    .then(res => res.json())
    .then(out => {
        console.log(out)
        L.geoJSON(out.features, {
            pointToLayer: createCircleMarker
        }).addTo(myMap)
})

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];
        
    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }
    
    return div;
};

legend.addTo(myMap);
