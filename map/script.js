// Initialize the map
const map = L.map('map').setView([38.247247, 21.735678], 18); // Latitude, Longitude, Zoom level
const bsIcon = L.icon({
    iconUrl: 'tower-cell-solid.svg',  // Replace with your SVG file path
    iconSize: [32, 32],                // Icon size (adjust as necessary)
    iconAnchor: [16, 32],              // Anchor point (adjust to center)
    popupAnchor: [0, -32],
    className: 'colored-icon',             // Position of the popup
});

const ueIcon = L.icon({
    iconUrl: 'heart-pulse-solid.svg',  // Replace with your SVG file path
    iconSize: [32, 32],                // Icon size (adjust as necessary)
    iconAnchor: [16, 32],              // Anchor point (adjust to center)
    popupAnchor: [0, -32],
    className: 'colored-icon',             // Position of the popup
});

// Add a tile layer (map visuals)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Use Case 1

 // Define coordinates for the intersections
 var pointA = [38.248237, 21.734192]; // Ερμού & Αγίου Ανδρέου
 var pointB = [38.246108, 21.736812]; // Ερμού & Κανακάρη

 // Create a polyline connecting the two points
 var polyline = L.polyline([pointA, pointB], {
    color: 'red',
    weight: 6,
    opacity: 0.8
}).addTo(map);

// Base station coordinates with a central uncovered area
var baseStations = [
    { lat: 38.247832, lng: 21.735206, name: "BS1", }, // Overlaps BS2, BS3
    { lat: 38.247832, lng: 21.736005, name: "BS2" }, // Overlaps BS1, BS4
    { lat: 38.247082, lng: 21.735206, name: "BS3" }, // Overlaps BS1, BS4
    { lat: 38.247082, lng: 21.736005, name: "BS4" }  // Overlaps BS2, BS3
];

// Add circles to the map with 65m radius
baseStations.forEach(function(bs) {
    L.circle([bs.lat, bs.lng], {
        color: 'blue',
        weight: 1,
        fillColor: '#30f',
        fillOpacity: 0.2,
        radius: 65
    }).addTo(map).bindPopup(bs.name);
    L.marker([bs.lat, bs.lng], {
         icon: bsIcon }).addTo(map).bindPopup(bs.name);
});
