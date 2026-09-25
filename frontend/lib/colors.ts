// Maps a layer name to a consistent draw color across the 3D viewer,
// legend, and cost breakdown — so "road" always reads the same color
// everywhere in the UI.

export const CATEGORY_COLORS: Record<string, string> = {
  road: "#B7C4D8",       // neutral grey-blue — road surface
  water: "#60A5FA",      // blue — water pipeline
  electric: "#F5B94D",   // amber — electric line
  plot_boundary: "#5EEAD4", // cyan — plot boundaries
  streetlight: "#F5876B",   // coral — point features (poles)
  unmatched: "#7A8CA6",     // muted slate — unclassified layers
};

const FALLBACK_PALETTE = ["#5EEAD4", "#60A5FA", "#F5B94D", "#F5876B", "#C084FC", "#4ADE80"];

export function colorForLayer(layerName: string, category: string | null): string {
  if (category && CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  // Deterministic fallback so the same unmatched layer always gets the same color
  let hash = 0;
  for (let i = 0; i < layerName.length; i++) hash = (hash * 31 + layerName.charCodeAt(i)) >>> 0;
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}
