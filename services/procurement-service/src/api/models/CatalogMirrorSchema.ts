import { Schema, model } from "mongoose";

// This is a mirror schema to store the latest product information from the catalog service.
// It will be updated regularly to reflect any changes in the supplier's offerings.
// This allows us to have a local copy of the product data for quick access and to avoid making frequent calls to the supplier's API.

const CatalogMirrorSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    supplier: { type: String, required: true, index: true },
    priceUsd: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
    leadTimeDays: { type: Number },
  },
  { timestamps: true }
);

export const CatalogMirror = model("CatalogMirror", CatalogMirrorSchema);
