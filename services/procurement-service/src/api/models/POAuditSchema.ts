import { Schema, model, Types } from "mongoose";

const POAuditSchema = new Schema({
  // Link to the actual Purchase Order
  poNumber: {
    type: String,
    ref: "PurchaseOrder",
    required: true,
    index: true,
  },

  // The transition state
  fromStatus: { type: String, required: true },
  toStatus: { type: String, required: true },

  action: { type: String, required: true }, // e.g., "STATUS_CHANGE", "ITEM_ADDED"
  notes: { type: String }, // Reason for approval/rejection

  timestamp: { type: Date, default: Date.now },
});

export const POAudit = model("POAudit", POAuditSchema);
