"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import UploadPanel from "@/components/UploadPanel";
import CostBreakdown from "@/components/CostBreakdown";
import { uploadCadFile, UploadResponse } from "@/lib/api";
import { colorForLayer } from "@/lib/colors";
import type { SelectedEntity } from "@/components/CadViewer";

// R3F/three.js touches window/canvas — load it client-only, no SSR
const CadViewer = dynamic(() => import("@/components/CadViewer"), { ssr: false });

export default function Home() {
  const [data, setData] = useState<UploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  const handleFileSelected = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSelectedLayer(null);
    setSelectedEntity(null);
    try {
      const result = await uploadCadFile(file);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong while parsing this file.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectEntity = useCallback((entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    setSelectedLayer(entity?.layerName ?? null);
  }, []);

  const handleSelectLayerFromPanel = useCallback((layerName: string | null) => {
    setSelectedLayer(layerName);
    if (layerName && data) {
      const layerData = data.geometry.layers[layerName];
      const match = data.costEstimate.breakdown.find((b) => b.layerName === layerName);
      setSelectedEntity({
        layerName,
        category: match?.category ?? null,
        type: "layer",
        length: layerData.totalLength,
        area: layerData.area,
      });
    } else {
      setSelectedEntity(null);
    }
  }, [data]);

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-blueprint-700 px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-draft-cyan/40 bg-draft-cyan/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 21L21 3M3 3h6M3 3v6M21 21h-6M21 21v-6" stroke="#5EEAD4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-ink-100">SiteCost</h1>
            <p className="text-xs text-ink-500">CAD drawing → material & cost estimate</p>
          </div>
        </div>
        {data && (
          <div className="font-mono text-xs text-ink-500">
            {data.geometry.meta.entityTotal} entities · {data.geometry.meta.layerNames.length} layers
          </div>
        )}
      </header>

      {/* Body */}
      <div className="grid flex-1 grid-cols-[340px_1fr] overflow-hidden">
        {/* Left panel: upload + cost breakdown */}
        <div className="flex flex-col gap-4 overflow-hidden border-r border-blueprint-700 p-4">
          <UploadPanel
            onFileSelected={handleFileSelected}
            isLoading={isLoading}
            error={error}
            fileName={data?.fileName ?? null}
          />

          {data ? (
            <CostBreakdown
              costEstimate={data.costEstimate}
              selectedLayer={selectedLayer}
              onSelectLayer={handleSelectLayerFromPanel}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm text-ink-500">Upload a site plan to see the cost breakdown here.</p>
            </div>
          )}
        </div>

        {/* Right panel: 3D viewer */}
        <div className="relative p-4">
          {data ? (
            <>
              <CadViewer
                geometry={data.geometry}
                costEstimate={data.costEstimate}
                onSelect={handleSelectEntity}
                selectedLayer={selectedLayer}
              />

              {/* Floating entity info panel */}
              <AnimatePresence>
                {selectedEntity && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-8 top-8 w-64 rounded-lg border border-blueprint-700 bg-blueprint-900/95 p-4 shadow-xl backdrop-blur"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: colorForLayer(selectedEntity.layerName, selectedEntity.category) }}
                      />
                      <p className="text-sm font-medium text-ink-100">{selectedEntity.layerName}</p>
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5 font-mono text-xs">
                      {selectedEntity.length !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-ink-500">Total length</span>
                          <span className="text-ink-100">{selectedEntity.length.toFixed(2)} m</span>
                        </div>
                      )}
                      {selectedEntity.area !== undefined && selectedEntity.area > 0 && (
                        <div className="flex justify-between">
                          <span className="text-ink-500">Enclosed area</span>
                          <span className="text-ink-100">{selectedEntity.area.toFixed(2)} m²</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-ink-500">Category</span>
                        <span className="text-ink-100">{selectedEntity.category || "unclassified"}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedEntity(null); setSelectedLayer(null); }}
                      className="mt-3 text-xs text-ink-500 hover:text-ink-300"
                    >
                      Clear selection
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="pointer-events-none absolute bottom-8 left-8 font-mono text-xs text-ink-500">
                Click any line or pole to inspect it · drag to orbit · scroll to zoom
              </p>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-blueprint-700">
              <p className="text-sm text-ink-500">3D preview will appear here after upload</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
