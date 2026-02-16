import { Request, Response } from "express";
import { PurchaseOrder } from "../models/PurchaseOrderSchema";
import { POAudit } from "../models/POAuditSchema";
import { generatePONumber } from "../../utils/poNumberGenerator";
import { createPOLines } from "../../utils/createPOLines";

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
    const history = await POAudit.find({ poNumber: id as string }).sort({
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
    const {
      items,
      validatedItems,
      requester,
      costCenter,
      neededBy,
      paymentTerms,
    } = req.body;

    const poNumber = await generatePONumber();
    const lineItems = createPOLines(items, validatedItems);
    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.priceTotal,
      0
    );

    const newPO = await PurchaseOrder.create({
      poNumber,
      // If items exist, use the supplier from the first validated item
      supplier: lineItems.length > 0 ? lineItems[0]?.supplier : null,
      items: lineItems,
      totalAmount,
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

export const syncItemsToPO = async (req: Request, res: Response) => {
  try {
    const { items, validatedItems, targetPO } = req.body;

    const lineItems = createPOLines(items, validatedItems);
    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.priceTotal,
      0
    );

    targetPO.items = lineItems;
    targetPO.totalAmount = totalAmount;
    await targetPO.save();
    res.status(200).json(targetPO);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeItemFromPO = async (req: Request, res: Response) => {
  try {
    const { id: poNumber, productId } = req.params;

    const po = await PurchaseOrder.findOne({ poNumber: poNumber as string });

    if (!po) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    // 1. Calculate the total value of the items being removed
    const itemsToRemove = po.items.filter(
      (item: any) => item.catalogItemId === productId
    );

    if (itemsToRemove.length === 0) {
      return res.status(404).json({ message: "Product not found in this PO" });
    }

    const totalToRemove = itemsToRemove.reduce(
      (sum: number, item: any) => sum + item.priceTotal,
      0
    );

    // 2. Update PO: Subtract amount and filter the array
    po.totalAmount -= totalToRemove;
    (po.items as any).pull({ catalogItemId: productId });

    if (po.items.length === 0) {
      po.supplier = null;
    }

    await po.save();

    res.status(200).json({
      success: true,
      message: `Removed ${itemsToRemove.length} instance(s) of product ${productId}`,
    });
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
