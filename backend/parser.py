"""
parser.py — CAD DXF Parser
Reads a .dxf file and extracts entity geometry grouped by layer, plus
raw quantities (total length, enclosed area, entity count) per layer.

This runs standalone right now (spawned per-request from server.js).
Later, wrap this same logic in a FastAPI/Flask microservice for
better throughput — see README.md "Scaling to a microservice" section.

Usage:
    python3 parser.py <path_to_dxf_file>

Output:
    JSON printed to stdout:
    {
      "layers": {
        "ROAD_CL": {
          "color": 8,
          "totalLength": 240.0,
          "area": 0,
          "entityCount": 6,
          "entities": [
            {"type": "LWPOLYLINE", "points": [[x,y], ...], "length": 100.0}
          ]
        },
        ...
      },
      "bounds": {"minX":.., "minY":.., "maxX":.., "maxY":..},
      "meta": {"fileName": "...", "entityTotal": N}
    }
"""
import sys
import os
import json
import math

try:
    import ezdxf
except ImportError:
    print(json.dumps({"error": "ezdxf not installed. Run: pip install ezdxf --break-system-packages"}))
    sys.exit(1)


def polyline_length(points):
    total = 0.0
    for i in range(len(points) - 1):
        x1, y1 = points[i][0], points[i][1]
        x2, y2 = points[i + 1][0], points[i + 1][1]
        total += math.hypot(x2 - x1, y2 - y1)
    return total


def polygon_area(points):
    # Shoelace formula — only meaningful if the polyline is closed
    if len(points) < 3:
        return 0.0
    area = 0.0
    n = len(points)
    for i in range(n):
        x1, y1 = points[i][0], points[i][1]
        x2, y2 = points[(i + 1) % n][0], points[(i + 1) % n][1]
        area += (x1 * y2) - (x2 * y1)
    return abs(area) / 2.0


def is_closed_shape(points, tol=1e-6):
    if len(points) < 3:
        return False
    x1, y1 = points[0][0], points[0][1]
    x2, y2 = points[-1][0], points[-1][1]
    return math.hypot(x2 - x1, y2 - y1) < tol


def parse_dxf(file_path):
    doc = ezdxf.readfile(file_path)
    msp = doc.modelspace()

    layers_data = {}
    min_x = min_y = float("inf")
    max_x = max_y = float("-inf")
    entity_total = 0

    def get_layer_bucket(layer_name, color):
        if layer_name not in layers_data:
            layers_data[layer_name] = {
                "color": color,
                "totalLength": 0.0,
                "area": 0.0,
                "entityCount": 0,
                "entities": []
            }
        return layers_data[layer_name]

    for e in msp:
        etype = e.dxftype()
        layer_name = e.dxf.layer
        try:
            color = e.dxf.color
        except Exception:
            color = 256  # BYLAYER

        points = []

        if etype == "LWPOLYLINE":
            points = [(p[0], p[1]) for p in e.get_points()]
        elif etype == "POLYLINE":
            points = [(v.dxf.location.x, v.dxf.location.y) for v in e.vertices]
        elif etype == "LINE":
            points = [(e.dxf.start.x, e.dxf.start.y), (e.dxf.end.x, e.dxf.end.y)]
        elif etype == "CIRCLE":
            cx, cy = e.dxf.center.x, e.dxf.center.y
            r = e.dxf.radius
            points = [(cx, cy)]  # treat as a point-feature (pole, valve, etc.)
            bucket = get_layer_bucket(layer_name, color)
            bucket["entityCount"] += 1
            bucket["entities"].append({
                "type": "CIRCLE", "center": [cx, cy], "radius": r
            })
            min_x, max_x = min(min_x, cx - r), max(max_x, cx + r)
            min_y, max_y = min(min_y, cy - r), max(max_y, cy + r)
            entity_total += 1
            continue
        else:
            continue  # skip unsupported entity types in v0 (TEXT, DIMENSION, etc.)

        if not points:
            continue

        bucket = get_layer_bucket(layer_name, color)
        length = polyline_length(points)
        closed = is_closed_shape(points) or getattr(e, "closed", False)
        area = polygon_area(points) if closed else 0.0

        bucket["totalLength"] += length
        bucket["area"] += area
        bucket["entityCount"] += 1
        bucket["entities"].append({
            "type": etype,
            "points": [[round(p[0], 3), round(p[1], 3)] for p in points],
            "length": round(length, 3),
            "closed": closed
        })

        for x, y in points:
            min_x, max_x = min(min_x, x), max(max_x, x)
            min_y, max_y = min(min_y, y), max(max_y, y)

        entity_total += 1

    # round summary numbers
    for layer in layers_data.values():
        layer["totalLength"] = round(layer["totalLength"], 3)
        layer["area"] = round(layer["area"], 3)

    return {
        "layers": layers_data,
        "bounds": {
            "minX": min_x if entity_total else 0,
            "minY": min_y if entity_total else 0,
            "maxX": max_x if entity_total else 0,
            "maxY": max_y if entity_total else 0
        },
        "meta": {
            "fileName": os.path.basename(file_path),
            "entityTotal": entity_total,
            "layerNames": list(layers_data.keys())
        }
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "usage: python3 parser.py <file.dxf>"}))
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({"error": f"file not found: {file_path}"}))
        sys.exit(1)

    try:
        result = parse_dxf(file_path)
        print(json.dumps(result))
    except ezdxf.DXFStructureError as ex:
        print(json.dumps({"error": f"Invalid or corrupt DXF file: {str(ex)}"}))
        sys.exit(1)
    except Exception as ex:
        print(json.dumps({"error": str(ex)}))
        sys.exit(1)
