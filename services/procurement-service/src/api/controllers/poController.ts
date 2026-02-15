import { Request, Response } from "express";
import { PurchaseOrder } from "../models/PurchaseOrderSchema";
import { POAudit } from "../models/POAuditSchema";
import { generatePONumber } from "../../utils/poNumberGenerator";

export const getPOs = async (req: Request, res: Response) => {
  try {
    const { status, supplier, sortBy, order } = req.query;

    // Build filter
    let filter: any = {};
    if (status) filter.status = status;
    if (supplier) filter.supplier = supplier;

    // Build sort
    const sortField = (sortBy as string) || "poNumber";
    const sortOrder = order === "desc" ? -1 : 1;

    const pos = await PurchaseOrder.find(filter).sort({
      [sortField]: sortOrder,
    });

    res.status(200).json(pos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET PO BY ID (Including Audit Trail)
export const getPOById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const po = await PurchaseOrder.findOne({
      poNumber: id as string,
    });
    if (!po)
      return res.status(404).json({ message: "Purchase Order not found" });

    // Fetch the history/audit trail for this PO
    const history = await POAudit.find({ poId: id as string }).sort({
      timestamp: -1,
    });

    // Return the PO data along with its history
    res.status(200).json({
      data: po,
      history: history,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDraft = async (req: Request, res: Response) => {
  try {
    const { supplier, requester, costCenter, neededBy, paymentTerms } =
      req.body;

    // Generate the professional ID
    const poNumber = await generatePONumber();

    const newPO = await PurchaseOrder.create({
      poNumber: poNumber, // e.g., "2026-00001"
      supplier: supplier || null,
      items: [],
      requester,
      costCenter,
      neededBy,
      paymentTerms,
    });

    await POAudit.create({
      poNumber,
      fromStatus: "N/A",
      toStatus: "DRAFT",
      action: "PO_CREATED",
    });

    res.status(201).json(newPO);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addItemToPO = async (req: Request, res: Response) => {
  try {
    const { quantity, validatedItem, targetPO } = req.body;
    const priceTotal = validatedItem.priceUsd * quantity;
    targetPO.items.push({
      catalogItemId: validatedItem.productId,
      name: validatedItem.name,
      quantity,
      pricePerUnit: validatedItem.priceUsd,
      priceTotal,
    });

    // Update total amount
    targetPO.totalAmount += priceTotal;

    // Ensure the PO knows its supplier if this was the first item
    if (!targetPO.supplier || targetPO?.items?.length === 1)
      targetPO.supplier = validatedItem.supplier;

    await targetPO.save();
    res.status(200).json(targetPO);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, userNotes } = req.body;

  try {
    const po = await PurchaseOrder.findOne({ poNumber: id as string });
    if (!po) return res.status(404).json({ message: "PO not found" });

    const oldStatus = po.status;
    po.status = status;

    // Requirement: Status Timeline/Audit
    await POAudit.create({
      poNumber: po.poNumber,
      fromStatus: oldStatus,
      toStatus: status,
      action: `STATUS_UPDATE_${status}`,
      notes: userNotes,
    });

    await po.save();
    res.status(200).json(po);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
