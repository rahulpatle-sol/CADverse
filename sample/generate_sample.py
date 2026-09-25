"""
Generates a sample "society plan" DXF file for testing the parser.
Mimics a real civil site plan: roads, water pipeline, electric line,
plot boundaries, and street-light poles (as blocks/points).

Run: python3 generate_sample.py
Output: society_plan.dxf (in the same folder)
"""
import ezdxf

doc = ezdxf.new("R2010")
msp = doc.modelspace()

# --- Define layers like a real contractor's CAD file would ---
doc.layers.add(name="ROAD_CL", color=8)        # grey - road centerline
doc.layers.add(name="WATER_LINE", color=5)     # blue - water pipeline
doc.layers.add(name="ELEC_LINE", color=2)      # yellow - electric line
doc.layers.add(name="PLOT_BOUNDARY", color=3)  # green - plot boundaries
doc.layers.add(name="STREETLIGHT", color=1)    # red - poles (points/blocks)

# --- Roads: a simple grid layout (in meters) ---
road_paths = [
    [(0, 0), (100, 0)],
    [(0, 20), (100, 20)],
    [(0, 40), (100, 40)],
    [(0, 0), (0, 40)],
    [(50, 0), (50, 40)],
    [(100, 0), (100, 40)],
]
for path in road_paths:
    msp.add_lwpolyline(path, dxfattribs={"layer": "ROAD_CL"})

# --- Water pipeline: runs alongside roads, slightly offset ---
water_paths = [
    [(0, 2), (100, 2)],
    [(0, 22), (100, 22)],
    [(2, 0), (2, 40)],
]
for path in water_paths:
    msp.add_lwpolyline(path, dxfattribs={"layer": "WATER_LINE"})

# --- Electric line: overhead line along one side ---
elec_paths = [
    [(0, -3), (100, -3)],
    [(50, -3), (50, 40)],
]
for path in elec_paths:
    msp.add_lwpolyline(path, dxfattribs={"layer": "ELEC_LINE"})

# --- Plot boundaries: individual society plots (rectangles) ---
plot_w, plot_h = 15, 18
for row in range(2):
    for col in range(6):
        x = col * plot_w
        y = row * 20
        rect = [
            (x, y), (x + plot_w, y), (x + plot_w, y + plot_h), (x, y + plot_h), (x, y)
        ]
        msp.add_lwpolyline(rect, dxfattribs={"layer": "PLOT_BOUNDARY"})

# --- Streetlight poles as point-like circles every 20m along main road ---
for x in range(0, 101, 20):
    msp.add_circle((x, -1), radius=0.3, dxfattribs={"layer": "STREETLIGHT"})

doc.saveas("society_plan.dxf")
print("Sample file created: society_plan.dxf")
print("Layers:", [l.dxf.name for l in doc.layers])
