console.log(mapToken)
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: JSON.parse(coordinates), // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

console.log(coordinates)

const marker = new mapboxgl.Marker({color: "black"})
.setLngLat(JSON.parse(coordinates))
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listingLocation}</h4><p>Exact Location will be provided after Booking</p>`))
.addTo(map)
