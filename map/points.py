""""
import osmnx as ox
import random

# Define base stations as central points
base_stations = [
    {"lat": 38.247832, "lng": 21.735206, "name": "BS1"},
    {"lat": 38.247832, "lng": 21.736005, "name": "BS2"},
    {"lat": 38.247082, "lng": 21.735206, "name": "BS3"},
    {"lat": 38.247082, "lng": 21.736005, "name": "BS4"}
]

# Load the street network for the area
location_point = (38.2480, 21.7355)
G = ox.graph_from_point(location_point, dist=1000, network_type="walk")

# Generate random points near base stations
def generate_points_near_base_stations(base_stations, graph, num_points=3, radius=100):
    generated_points = []
    for bs in base_stations:
        center_lat, center_lon = bs["lat"], bs["lng"]
        points = []
        while len(points) < num_points:
            # Offset the center point slightly within the radius
            offset_lat = random.uniform(-radius / 1e5, radius / 1e5)
            offset_lon = random.uniform(-radius / 1e5, radius / 1e5)
            new_lat, new_lon = center_lat + offset_lat, center_lon + offset_lon

            # Snap to the nearest node on the street network
            try:
                nearest_node = ox.nearest_nodes(graph, X=new_lon, Y=new_lat)
                snapped_lat, snapped_lon = graph.nodes[nearest_node]["y"], graph.nodes[nearest_node]["x"]
                points.append((snapped_lat, snapped_lon))
            except Exception:
                continue  # Skip if snapping fails
        generated_points.extend(points)
    return generated_points

# Use base stations as centers and generate starting/ending points
starting_points_near_bs = generate_points_near_base_stations(base_stations, G, num_points=3)
ending_points_near_bs = generate_points_near_base_stations(base_stations, G, num_points=3)

print("Starting Points Near Base Stations:", starting_points_near_bs)
print("Ending Points Near Base Stations:", ending_points_near_bs)
"""
import math

# Function to calculate new coordinates based on distance and direction
def calculate_new_coordinates(lat, lon, distance, bearing):
    """
    Calculate new coordinates (latitude and longitude) given a start point,
    distance (in meters), and bearing (in degrees).
    """
    R = 6378137  # Earth's radius in meters
    bearing_rad = math.radians(bearing)
    lat_rad = math.radians(lat)
    lon_rad = math.radians(lon)

    new_lat_rad = math.asin(math.sin(lat_rad) * math.cos(distance / R) +
                            math.cos(lat_rad) * math.sin(distance / R) * math.cos(bearing_rad))
    new_lon_rad = lon_rad + math.atan2(math.sin(bearing_rad) * math.sin(distance / R) * math.cos(lat_rad),
                                       math.cos(distance / R) - math.sin(lat_rad) * math.sin(new_lat_rad))

    new_lat = math.degrees(new_lat_rad)
    new_lon = math.degrees(new_lon_rad)

    return new_lat, new_lon

# Keep BS1 fixed
bs1_lat, bs1_lon = 38.247832, 21.735206

# Distance between base stations (in meters)
distance = 85

# Calculate new coordinates
# BS2: 90° from BS1 (east)
bs2_lat, bs2_lon = calculate_new_coordinates(bs1_lat, bs1_lon, distance, 90)

# BS3: 180° from BS1 (south)
bs3_lat, bs3_lon = calculate_new_coordinates(bs1_lat, bs1_lon, distance, 180)

# BS4: Southeast of BS1, aligning with the 2x2 mesh (diagonal from BS2 and BS3)
bs4_lat, bs4_lon = calculate_new_coordinates(bs3_lat, bs3_lon, distance, 90)

# Updated base station coordinates
base_stations = [
    {"lat": bs1_lat, "lng": bs1_lon, "name": "BS1"},
    {"lat": bs2_lat, "lng": bs2_lon, "name": "BS2"},
    {"lat": bs3_lat, "lng": bs3_lon, "name": "BS3"},
    {"lat": bs4_lat, "lng": bs4_lon, "name": "BS4"}
]

# Print updated coordinates
for bs in base_stations:
    print(f"{bs['name']}: {bs['lat']}, {bs['lng']}")
