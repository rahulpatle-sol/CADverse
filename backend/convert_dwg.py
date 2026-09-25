"""
convert_dwg.py — DWG / DWT / DWS -> DXF converter wrapper

DWG is Autodesk's closed binary format — no open-source Python library
can parse it directly. The standard free workaround is the ODA (Open
Design Alliance) File Converter, a free desktop CLI tool.

SETUP (one-time, on your laptop):
1. Download "ODA File Converter" (free): https://www.opendesign.com/guestfiles/oda_file_converter
2. Install it. Note the install path:
   - Windows: usually "C:\\Program Files\\ODA\\ODAFileConverter\\ODAFileConverter.exe"
   - Mac:     "/Applications/ODAFileConverter.app/Contents/MacOS/ODAFileConverter"
   - Linux:   wherever you extract the AppImage/binary
3. Set the path below (ODA_CONVERTER_PATH) or pass it via env var ODA_PATH.

WHY A SEPARATE STEP: ODA Converter works on a folder-to-folder basis,
not single files via stdin — so this script copies the input file into
a temp input folder, runs the converter pointed at that folder, then
picks up the resulting .dxf from the temp output folder.

Usage:
    python3 convert_dwg.py <path_to_dwg_or_dwt_or_dws> <output_dxf_path>
"""
import sys
import os
import shutil
import subprocess
import tempfile
import json

# Adjust this to your local ODA File Converter install path,
# or set the ODA_PATH environment variable instead.
ODA_CONVERTER_PATH = os.environ.get(
    "ODA_PATH",
    "C:\Program Files\ODA\ODAFileConverter 27.1.0\ODAFileConverter.exe"  # macOS default guess
)

# DXF version + output type args ODA expects: <ODAFileConverter> <in_dir> <out_dir> <out_ver> <out_type> <recurse 0/1> <audit 0/1> [filter]
OUTPUT_VERSION = "ACAD2013"  # widely compatible DXF version
OUTPUT_TYPE = "DXF"


def convert(input_path, output_dxf_path):
    if not os.path.exists(input_path):
        return {"error": f"input file not found: {input_path}"}

    if not os.path.exists(ODA_CONVERTER_PATH):
        return {
            "error": "ODA File Converter not found at configured path.",
            "hint": (
                "Install it free from https://www.opendesign.com/guestfiles/oda_file_converter "
                "then set ODA_PATH env var to its executable location."
            )
        }

    with tempfile.TemporaryDirectory() as in_dir, tempfile.TemporaryDirectory() as out_dir:
        in_file = os.path.join(in_dir, os.path.basename(input_path))
        shutil.copy(input_path, in_file)

        cmd = [
            ODA_CONVERTER_PATH,
            in_dir, out_dir,
            OUTPUT_VERSION, OUTPUT_TYPE,
            "0",  # recurse subfolders: no
            "1",  # audit: yes (fixes minor corruption)
        ]

        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=120)
        except subprocess.CalledProcessError as e:
            return {"error": f"ODA converter failed: {e.stderr.decode(errors='ignore')}"}
        except subprocess.TimeoutExpired:
            return {"error": "ODA converter timed out (file too large or converter hung)"}

        produced = [f for f in os.listdir(out_dir) if f.lower().endswith(".dxf")]
        if not produced:
            return {"error": "Conversion ran but no .dxf output was produced. Check input file validity."}

        shutil.move(os.path.join(out_dir, produced[0]), output_dxf_path)
        return {"success": True, "outputPath": output_dxf_path}


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "usage: python3 convert_dwg.py <input.dwg> <output.dxf>"}))
        sys.exit(1)

    result = convert(sys.argv[1], sys.argv[2])
    print(json.dumps(result))
    sys.exit(0 if result.get("success") else 1)
