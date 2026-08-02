import os
import osmnx as ox
import networkx as nx
import folium
import random

# Define a list of colors for the paths
colors = ["red", "blue", "green", "purple", "orange", "brown"]

# Define starting and ending points
starting_points = [
    (38.247729, 21.736412),  # Start of Path 1
    (38.246779, 21.734739)   # Start of Path 2
]

ending_points = [
    (38.246622, 21.736171),  # End of Path 1
    (38.247639, 21.734935)   # End of Path 2
]


# Base station coordinates
base_stations = [
    {"lat": 38.247832, "lng": 21.735206, "name": "BS1"},
    {"lat": 38.247831995989294, "lng": 21.73617827652392, "name": "BS2"},
    {"lat": 38.2470684320085, "lng": 21.735206, "name": "BS3"},
    {"lat": 38.2470684279979, "lng": 21.73617826631019, "name": "BS4"}
]

# Load the street network for the area
location_point = (38.247437, 21.735694)  # Center point for the network
G = ox.graph_from_point(location_point, dist=1000, network_type='walk')

# Initialize a folium map
m = folium.Map(location=location_point, zoom_start=18)

# Absolute paths for custom icons
bs_icon_data_uri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTYyLjYgMi4zQzQ2LjItNC4zIDI3LjYgMy42IDIwLjkgMjBDNy40IDUzLjQgMCA4OS45IDAgMTI4czcuNCA3NC42IDIwLjkgMTA4YzYuNiAxNi40IDI1LjMgMjQuMyA0MS43IDE3LjdTODYuOSAyMjguNCA4MC4zIDIxMkM2OS44IDE4Ni4xIDY0IDE1Ny44IDY0IDEyOHM1LjgtNTguMSAxNi4zLTg0Qzg2LjkgMjcuNiA3OSA5IDYyLjYgMi4zem00NTAuOCAwQzQ5NyA5IDQ4OS4xIDI3LjYgNDk1LjcgNDRDNTA2LjIgNjkuOSA1MTIgOTguMiA1MTIgMTI4cy01LjggNTguMS0xNi4zIDg0Yy02LjYgMTYuNCAxLjMgMzUgMTcuNyA0MS43czM1LTEuMyA0MS43LTE3LjdjMTMuNS0zMy40IDIwLjktNjkuOSAyMC45LTEwOHMtNy40LTc0LjYtMjAuOS0xMDhDNTQ4LjQgMy42IDUyOS44LTQuMyA1MTMuNCAyLjN6TTM0MC4xIDE2NS4yYzcuNS0xMC41IDExLjktMjMuMyAxMS45LTM3LjJjMC0zNS4zLTI4LjctNjQtNjQtNjRzLTY0IDI4LjctNjQgNjRjMCAxMy45IDQuNCAyNi43IDExLjkgMzcuMkw5OC45IDQ2Ni44Yy03LjMgMTYuMS0uMiAzNS4xIDE1LjkgNDIuNHMzNS4xIC4yIDQyLjQtMTUuOUwxNzcuNyA0NDhsMjIwLjYgMCAyMC42IDQ1LjJjNy4zIDE2LjEgMjYuMyAyMy4yIDQyLjQgMTUuOXMyMy4yLTI2LjMgMTUuOS00Mi40TDM0MC4xIDE2NS4yek0zNjkuMiAzODRsLTE2Mi40IDAgMTQuNS0zMiAxMzMuMyAwIDE0LjUgMzJ6TTI4OCAyMDUuM0wzMjUuNiAyODhsLTc1LjIgMEwyODggMjA1LjN6TTE2My4zIDczLjZjNS4zLTEyLjEtLjItMjYuMy0xMi40LTMxLjZzLTI2LjMgLjItMzEuNiAxMi40QzEwOS41IDc3IDEwNCAxMDEuOSAxMDQgMTI4czUuNSA1MSAxNS4zIDczLjZjNS4zIDEyLjEgMTkuNSAxNy43IDMxLjYgMTIuNHMxNy43LTE5LjUgMTIuNC0zMS42QzE1NiAxNjUuOCAxNTIgMTQ3LjQgMTUyIDEyOHM0LTM3LjggMTEuMy01NC40ek00NTYuNyA1NC40Yy01LjMtMTIuMS0xOS41LTE3LjctMzEuNi0xMi40cy0xNy43IDE5LjUtMTIuNCAzMS42QzQyMCA5MC4yIDQyNCAxMDguNiA0MjQgMTI4cy00IDM3LjgtMTEuMyA1NC40Yy01LjMgMTIuMSAuMiAyNi4zIDEyLjQgMzEuNnMyNi4zLS4yIDMxLjYtMTIuNEM0NjYuNSAxNzkgNDcyIDE1NC4xIDQ3MiAxMjhzLTUuNS01MS0xNS4zLTczLjZ6Ii8+PC9zdmc+"
ue_green_data_uri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggc3Ryb2tlPSIjMDAzMzIyIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSIjMDBiZjYzIiBkPSJNMjI4LjMgNDY5LjFMNDcuNiAzMDAuNGMtNC4yLTMuOS04LjItOC4xLTExLjktMTIuNGw4NyAwYzIyLjYgMCA0My0xMy42IDUxLjctMzQuNWwxMC41LTI1LjIgNDkuMyAxMDkuNWMzLjggOC41IDEyLjEgMTQgMjEuNCAxNC4xczE3LjgtNSAyMi0xMy4zTDMyMCAyNTMuN2wxLjcgMy40YzkuNSAxOSAyOC45IDMxIDUwLjEgMzFsMTA0LjUgMGMtMy43IDQuMy03LjcgOC41LTExLjkgMTIuNEwyODMuNyA0NjkuMWMtNy41IDctMTcuNCAxMC45LTI3LjcgMTAuOXMtMjAuMi0zLjktMjcuNy0xMC45ek01MDMuNyAyNDBsLTEzMiAwYy0zIDAtNS44LTEuNy03LjItNC40bC0yMy4yLTQ2LjNjLTQuMS04LjEtMTIuNC0xMy4zLTIxLjUtMTMuM3MtMTcuNCA1LjEtMjEuNSAxMy4zbC00MS40IDgyLjhMMjA1LjkgMTU4LjJjLTMuOS04LjctMTIuNy0xNC4zLTIyLjItMTQuMXMtMTguMSA1LjktMjEuOCAxNC44bC0zMS44IDc2LjNjLTEuMiAzLTQuMiA0LjktNy40IDQuOUwxNiAyNDBjLTIuNiAwLTUgLjQtNy4zIDEuMUMzIDIyNS4yIDAgMjA4LjIgMCAxOTAuOWwwLTUuOGMwLTY5LjkgNTAuNS0xMjkuNSAxMTkuNC0xNDFDMTY1IDM2LjUgMjExLjQgNTEuNCAyNDQgODRsMTIgMTIgMTItMTJjMzIuNi0zMi42IDc5LTQ3LjUgMTI0LjYtMzkuOUM0NjEuNSA1NS42IDUxMiAxMTUuMiA1MTIgMTg1LjFsMCA1LjhjMCAxNi45LTIuOCAzMy41LTguMyA0OS4xeiIvPjwvc3ZnPg=="
ue_red_data_uri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggc3Ryb2tlPSIjNGQwMDAwIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSIjZmYzMTMxIiBkPSJNMjI4LjMgNDY5LjFMNDcuNiAzMDAuNGMtNC4yLTMuOS04LjItOC4xLTExLjktMTIuNGw4NyAwYzIyLjYgMCA0My0xMy42IDUxLjctMzQuNWwxMC41LTI1LjIgNDkuMyAxMDkuNWMzLjggOC41IDEyLjEgMTQgMjEuNCAxNC4xczE3LjgtNSAyMi0xMy4zTDMyMCAyNTMuN2wxLjcgMy40YzkuNSAxOSAyOC45IDMxIDUwLjEgMzFsMTA0LjUgMGMtMy43IDQuMy03LjcgOC41LTExLjkgMTIuNEwyODMuNyA0NjkuMWMtNy41IDctMTcuNCAxMC45LTI3LjcgMTAuOXMtMjAuMi0zLjktMjcuNy0xMC45ek01MDMuNyAyNDBsLTEzMiAwYy0zIDAtNS44LTEuNy03LjItNC40bC0yMy4yLTQ2LjNjLTQuMS04LjEtMTIuNC0xMy4zLTIxLjUtMTMuM3MtMTcuNCA1LjEtMjEuNSAxMy4zbC00MS40IDgyLjhMMjA1LjkgMTU4LjJjLTMuOS04LjctMTIuNy0xNC4zLTIyLjItMTQuMXMtMTguMSA1LjktMjEuOCAxNC44bC0zMS44IDc2LjNjLTEuMiAzLTQuMiA0LjktNy40IDQuOUwxNiAyNDBjLTIuNiAwLTUgLjQtNy4zIDEuMUMzIDIyNS4yIDAgMjA4LjIgMCAxOTAuOWwwLTUuOGMwLTY5LjkgNTAuNS0xMjkuNSAxMTkuNC0xNDFDMTY1IDM2LjUgMjExLjQgNTEuNCAyNDQgODRsMTIgMTIgMTItMTJjMzIuNi0zMi42IDc5LTQ3LjUgMTI0LjYtMzkuOUM0NjEuNSA1NS42IDUxMiAxMTUuMiA1MTIgMTg1LjFsMCA1LjhjMCAxNi45LTIuOCAzMy41LTguMyA0OS4xeiIvPjwvc3ZnPg=="

# Add base stations
for bs in base_stations:
    # Add circle to represent coverage area
    folium.Circle(
        location=(bs["lat"], bs["lng"]),
        radius=65,  # 65 meters
        color="blue",
        fill=True,
        fill_color="#30f",
        fill_opacity=0.2,
    ).add_to(m)

    # Add marker with custom icon
    folium.Marker(
        location=(bs["lat"], bs["lng"]),
        popup=bs["name"],
        icon=folium.CustomIcon(bs_icon_data_uri, icon_size=(24, 24)),  # Custom Icon for Base Stations
    ).add_to(m)

# Add routes for each pair of points
for i, (start, end) in enumerate(zip(starting_points, ending_points)):
    # Find the nearest nodes to the start and end points
    start_node = ox.nearest_nodes(G, X=start[1], Y=start[0])
    end_node = ox.nearest_nodes(G, X=end[1], Y=end[0])

    # Compute the shortest path between the nodes
    route = nx.shortest_path(G, source=start_node, target=end_node, weight="length")

    # Extract the coordinates of the route
    route_coords = [(G.nodes[node]["y"], G.nodes[node]["x"]) for node in route]

    # Select a color (cycle through colors list or assign randomly)
    path_color = colors[i % len(colors)]  # Cycle through the list
    # Alternatively, use random colors: path_color = "#{:06x}".format(random.randint(0, 0xFFFFFF))

    # Add the route to the map with a popup showing the path number
    folium.PolyLine(
        route_coords,
        color=path_color,
        weight=6,
        opacity=0.8,
        popup=f"Path {i + 1}"  # Path number
    ).add_to(m)

    # Add start marker with custom UE icon
    folium.Marker(
        location=start,
        popup=f"Start of Path {i + 1}",
        icon=folium.CustomIcon(ue_green_data_uri, icon_size=(28, 28)),  # Custom Icon for UEs
    ).add_to(m)

    # Add end marker with custom UE icon
    folium.Marker(
        location=end,
        popup=f"End of Path {i + 1}",
        icon=folium.CustomIcon(ue_red_data_uri, icon_size=(28, 28)),  # Custom Icon for UEs
    ).add_to(m)
    
# Save the map to the Desktop
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop", "ue_bs_custom_icon_map.html")
m.save(desktop_path)

print(f"Map has been saved to: {desktop_path}")

