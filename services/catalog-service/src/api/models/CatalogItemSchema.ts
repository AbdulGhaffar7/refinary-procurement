import { Schema, model } from "mongoose";

const SpecsSchema = new Schema(
  {
    supplier: String,
    standard: String,
    nominalSize: String,
    pressureClass: String,
    face: String,
    windingMaterial: String,
    fillerMaterial: String,
    innerRing: String,
    outerRing: String,
  },
  { _id: false }
); // No internal ID needed for sub-docs

const CatalogItemSchema = new Schema(
  {
    // Use the business ID (e.g., GST-0001) as a unique, indexed string
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    supplier: { type: String, required: true, index: true },
    manufacturer: String,
    model: String,
    description: String,
    leadTimeDays: { type: Number, default: 0 },
    priceUsd: { type: Number, required: true, index: true },
    inStock: { type: Boolean, default: false },
    specs: SpecsSchema,
  },
  {
    timestamps: true, // Captures createdAt and updatedAt automatically
  }
);

// Compound index for the common "Filter by Supplier + Category" use case
CatalogItemSchema.index({ supplier: 1, category: 1 });

export const CatalogItem = model("CatalogItem", CatalogItemSchema);
