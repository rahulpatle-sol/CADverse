/**
 * costEngine.js
 * Takes the parsed DXF JSON (from parser.py) + rate_card.json and
 * produces a cost breakdown. This is pure deterministic math —
 * no LLM involved here, so the numbers stay auditable and reproducible.
 */
const rateCard = require("./rate_card.json");

// Normalize a layer name for fuzzy matching (case/underscore-insensitive)
function normalize(name) {
  return name.toUpperCase().replace(/[\s\-]/g, "_");
}

// Try to match a parsed layer name to a category in the rate card.
// Returns the category key ("road", "water", ...) or null if no match.
function matchCategory(layerName) {
  const norm = normalize(layerName);
  for (const [category, def] of Object.entries(rateCard.rates)) {
    for (const candidate of def.matchLayers) {
      if (norm.includes(normalize(candidate))) {
        return category;
      }
    }
  }
  return null;
}

function computeCostBreakdown(parsedData) {
  const breakdown = [];
  const unmatchedLayers = [];
  let grandTotal = 0;
  const materialTotals = {}; // e.g. { cementBags: 120, sandCubicMeter: 45 }

  for (const [layerName, layerData] of Object.entries(parsedData.layers || {})) {
    const category = matchCategory(layerName);

    if (!category) {
      unmatchedLayers.push({
        layer: layerName,
        entityCount: layerData.entityCount,
        totalLength: layerData.totalLength,
        area: layerData.area,
        note: "No rate-card match — needs manual mapping or LLM classification"
      });
      continue;
    }

    const rateDef = rateCard.rates[category];
    let quantity = 0;

    if (rateDef.unit === "meter") quantity = layerData.totalLength;
    else if (rateDef.unit === "sqmeter") quantity = layerData.area;
    else if (rateDef.unit === "count") quantity = layerData.entityCount;

    const cost = Math.round(quantity * rateDef.costPerUnit);
    grandTotal += cost;

    // Roll up materials (sand, cement, aggregate, cable, pipe)
    const materials = {};
    for (const [matKey, perUnit] of Object.entries(rateDef.materials || {})) {
      const matQty = Math.round(quantity * perUnit * 100) / 100;
      materials[matKey] = matQty;
      materialTotals[matKey] = Math.round(((materialTotals[matKey] || 0) + matQty) * 100) / 100;
    }

    breakdown.push({
      category,
      layerName,
      description: rateDef.description,
      unit: rateDef.unit,
      quantity: Math.round(quantity * 100) / 100,
      costPerUnit: rateDef.costPerUnit,
      cost,
      materials
    });
  }

  return {
    currency: rateCard.currency,
    rateCardLastUpdated: rateCard.lastUpdated,
    grandTotal,
    grandTotalDisplay: formatINR(grandTotal),
    breakdown,
    materialTotals,
    unmatchedLayers,
    meta: parsedData.meta
  };
}

function formatINR(amount) {
  // Indian numbering (lakh/crore) grouping, e.g. 1,23,45,678
  const str = Math.round(amount).toString();
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return "₹" + (rest ? grouped + "," : "") + last3;
}

module.exports = { computeCostBreakdown, matchCategory, formatINR };
