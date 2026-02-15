import { Schema, model } from "mongoose";

const LineItemSchema = new Schema({
  catalogItemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit: { type: Number, required: true }, // Captures price at the moment of adding so it can be locked in even if the catalog price changes later.
  priceTotal: { type: Number, required: true },
});

const POSchema = new Schema(
  {
    // PO Number Generation Strategy: e.g., "PO-2026-0001"
    poNumber: { type: String, unique: true, required: true, index: true },
    supplier: { type: String, index: true },
    requester: {
      type: String,
      required: true,
    },
    costCenter: {
      type: String,
      default: "CC-1234",
    },
    neededBy: {
      type: Date,
      required: true,
    },
    paymentTerms: {
      type: String,
      enum: ["Cash", "Credit", "Installments"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "DRAFT",
      index: true,
    },
    items: [LineItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PurchaseOrder = model("PurchaseOrder", POSchema);
