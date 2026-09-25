export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export interface ParsedEntity {
  type: string;
  points?: number[][];
  length?: number;
  closed?: boolean;
  center?: number[];
  radius?: number;
}

export interface LayerData {
  color: number;
  totalLength: number;
  area: number;
  entityCount: number;
  entities: ParsedEntity[];
}

export interface Geometry {
  layers: Record<string, LayerData>;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  meta: { fileName: string; entityTotal: number; layerNames: string[] };
}

export interface CostLineItem {
  category: string;
  layerName: string;
  description: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
  cost: number;
  materials: Record<string, number>;
}

export interface CostEstimate {
  currency: string;
  rateCardLastUpdated: string;
  grandTotal: number;
  grandTotalDisplay: string;
  breakdown: CostLineItem[];
  materialTotals: Record<string, number>;
  unmatchedLayers: { layer: string; entityCount: number; totalLength: number; area: number; note: string }[];
}

export interface UploadResponse {
  fileName: string;
  geometry: Geometry;
  costEstimate: CostEstimate;
}

export interface RateCategoryDef {
  matchLayers: string[];
  unit: "meter" | "sqmeter" | "count";
  costPerUnit: number;
  description: string;
  materials: Record<string, number>;
}

export interface RateCard {
  currency: string;
  lastUpdated: string;
  region: string;
  rates: Record<string, RateCategoryDef>;
}

export async function fetchRateCard(): Promise<RateCard> {
  const res = await fetch(`${API_BASE}/api/rate-card`);
  if (!res.ok) throw new Error("Failed to load rate card");
  return res.json();
}

export async function uploadCadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(body.error || `Upload failed (${res.status})`);
  }

  return res.json();
}