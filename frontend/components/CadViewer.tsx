"use client";

import { useMemo, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import { Geometry, CostEstimate } from "@/lib/api";
import { colorForLayer } from "@/lib/colors";

export interface SelectedEntity {
  layerName: string;
  category: string | null;
  type: string;
  length?: number;
  area?: number;
}

interface CadViewerProps {
  geometry: Geometry;
  costEstimate: CostEstimate;
  onSelect: (entity: SelectedEntity | null) => void;
  selectedLayer: string | null;
}

// One straight segment rendered as a thin cylinder so it's easy to raycast/click,
// which a hairline <Line> would make fiddly for the user.
function Segment({
  a, b, color, radius, highlighted, onClick, onHover,
}: {
  a: [number, number, number];
  b: [number, number, number];
  color: string;
  radius: number;
  highlighted: boolean;
  onClick: (e: any) => void;
  onHover: (v: boolean) => void;
}) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const len = dir.length() || 0.001;
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  return (
    <mesh
      position={mid}
      quaternion={quat}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "default"; }}
    >
      <cylinderGeometry args={[radius, radius, len, 8]} />
      <meshStandardMaterial
        color={highlighted ? "#FFFFFF" : color}
        emissive={highlighted ? color : "#000000"}
        emissiveIntensity={highlighted ? 0.6 : 0}
      />
    </mesh>
  );
}

function PoleMarker({
  position, color, highlighted, onClick, onHover,
}: {
  position: [number, number, number];
  color: string;
  highlighted: boolean;
  onClick: (e: any) => void;
  onHover: (v: boolean) => void;
}) {
  return (
    <mesh
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "default"; }}
    >
      <cylinderGeometry args={[0.25, 0.35, 1.6, 10]} />
      <meshStandardMaterial
        color={highlighted ? "#FFFFFF" : color}
        emissive={highlighted ? color : "#000000"}
        emissiveIntensity={highlighted ? 0.7 : 0.15}
      />
    </mesh>
  );
}

function SceneContent({ geometry, costEstimate, onSelect, selectedLayer }: CadViewerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const layerCategory = useMemo(() => {
    const map: Record<string, string | null> = {};
    for (const name of geometry.meta.layerNames) {
      const match = costEstimate.breakdown.find((b) => b.layerName === name);
      map[name] = match ? match.category : null;
    }
    return map;
  }, [geometry, costEstimate]);

  const { minX, minY, maxX, maxY } = geometry.bounds;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const span = Math.max(maxX - minX, maxY - minY, 10);

  // Map DXF (x, y) -> three.js (x, z), keep y=0 as ground plane, centered at origin
  const toScene = (x: number, y: number, height = 0): [number, number, number] => [
    x - centerX,
    height,
    y - centerY,
  ];

  const segments: { key: string; a: [number, number, number]; b: [number, number, number]; layerName: string; color: string; length: number }[] = [];
  const poles: { key: string; pos: [number, number, number]; layerName: string; color: string }[] = [];

  for (const [layerName, layerData] of Object.entries(geometry.layers)) {
    const category = layerCategory[layerName];
    const color = colorForLayer(layerName, category);

    layerData.entities.forEach((entity, ei) => {
      if (entity.type === "CIRCLE" && entity.center) {
        poles.push({
          key: `${layerName}-${ei}`,
          pos: toScene(entity.center[0], entity.center[1], 0.8),
          layerName,
          color,
        });
      } else if (entity.points && entity.points.length > 1) {
        for (let i = 0; i < entity.points.length - 1; i++) {
          const [x1, y1] = entity.points[i];
          const [x2, y2] = entity.points[i + 1];
          segments.push({
            key: `${layerName}-${ei}-${i}`,
            a: toScene(x1, y1, 0.05),
            b: toScene(x2, y2, 0.05),
            layerName,
            color,
            length: entity.length || 0,
          });
        }
      }
    });
  }

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[span * 0.6, span, span * 0.4]} intensity={0.9} />
      <directionalLight position={[-span * 0.4, span * 0.6, -span * 0.3]} intensity={0.3} />

      <Grid
        args={[span * 2, span * 2]}
        cellSize={span / 20}
        cellColor="#1A2B45"
        sectionSize={span / 4}
        sectionColor="#2A4568"
        fadeDistance={span * 3}
        position={[0, -0.02, 0]}
      />

      {segments.map((seg) => {
        const isSelected = selectedLayer === seg.layerName;
        const isHovered = hoveredId === seg.key;
        return (
          <Segment
            key={seg.key}
            a={seg.a}
            b={seg.b}
            color={seg.color}
            radius={Math.max(span * 0.0035, 0.08)}
            highlighted={isSelected || isHovered}
            onHover={(v) => setHoveredId(v ? seg.key : null)}
            onClick={() =>
              onSelect({
                layerName: seg.layerName,
                category: layerCategory[seg.layerName],
                type: "line",
                length: geometry.layers[seg.layerName].totalLength,
              })
            }
          />
        );
      })}

      {poles.map((pole) => {
        const isSelected = selectedLayer === pole.layerName;
        const isHovered = hoveredId === pole.key;
        return (
          <PoleMarker
            key={pole.key}
            position={pole.pos}
            color={pole.color}
            highlighted={isSelected || isHovered}
            onHover={(v) => setHoveredId(v ? pole.key : null)}
            onClick={() =>
              onSelect({
                layerName: pole.layerName,
                category: layerCategory[pole.layerName],
                type: "point",
              })
            }
          />
        );
      })}

      <OrbitControls
        makeDefault
        minDistance={span * 0.3}
        maxDistance={span * 4}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}

function CameraRig({ span }: { span: number }) {
  const { camera } = useThree();
  useMemo(() => {
    camera.position.set(span * 0.9, span * 0.9, span * 1.1);
    camera.lookAt(0, 0, 0);
    // Real DWG/DXF files are often drawn in millimeters, so raw spans can be
    // in the thousands+. R3F's default camera has a far plane of only 1000,
    // which silently clips large drawings into a blank canvas. Scale near/far
    // to the drawing's actual size instead of using the default.
    if ("near" in camera && "far" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.near = Math.max(span * 0.001, 0.01);
      cam.far = span * 20;
      cam.updateProjectionMatrix();
    }
  }, [camera, span]);
  return null;
}

export default function CadViewer(props: CadViewerProps) {
  const { minX, minY, maxX, maxY } = props.geometry.bounds;
  const span = Math.max(maxX - minX, maxY - minY, 10);

  return (
    <div
      className="h-full w-full rounded-lg border border-blueprint-700 bg-blueprint-950 overflow-hidden"
      onClick={() => props.onSelect(null)}
    >
      <Canvas shadows dpr={[1, 2]} onPointerMissed={() => props.onSelect(null)}>
        <CameraRig span={span} />
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}