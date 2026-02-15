import { Request, Response, NextFunction } from "express";
import { PurchaseOrder } from "../models/PurchaseOrderSchema";
import { CatalogMirror } from "../models/CatalogMirrorSchema";

export const validateSupplierConflict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { catalogItemId } = req.body;

  const poNumber = id as string;

  try {
    const po = await PurchaseOrder.findOne({
      poNumber,
    });
    const item = await CatalogMirror.findOne({ productId: catalogItemId });

    if (!po || !item) {
      return res.status(404).json({ message: "PO or Catalog Item not found" });
    }

    // Single-Supplier Enforcement
    // If the PO already has a supplier assigned and it doesn't match the new item
    // If PO already had a supplier assigned but there is no item inside we allow and it update the supplier in controller
    if (po.supplier && po.supplier !== item.supplier && po.items?.length > 0) {
      return res.status(409).json({
        error: "Conflict",
        message: `Supplier mismatch. This PO is for ${po.supplier}, but the item is from ${item.supplier}.`,
      });
    }

    // Attach item and po to request so controller doesn't have to fetch them again
    req.body.validatedItem = item;
    req.body.targetPO = po;

    next();
  } catch (error) {
    next(error);
  }
};
