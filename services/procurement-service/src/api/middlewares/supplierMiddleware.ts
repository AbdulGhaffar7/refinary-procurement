import { Request, Response, NextFunction } from "express";
import { PurchaseOrder } from "../models/PurchaseOrderSchema";
import { CatalogMirror } from "../models/CatalogMirrorSchema";

export const validateSupplierConflict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: poNumber } = req.params;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Items array is required and cannot be empty." });
  }

  try {
    // 1. Fetch PO and all Catalog items in parallel to save time
    const productIds = items.map((i: any) => i.catalogItemId);

    const catalogItems = await CatalogMirror.find({
      productId: { $in: productIds },
    });

    // 2. Validate all items exist in catalog
    if (catalogItems.length !== items.length && catalogItems.length === 0) {
      return res
        .status(404)
        .json({ message: "One or more Catalog Items not found!" });
    }

    const po = poNumber
      ? await PurchaseOrder.findOne({ poNumber: poNumber as string })
      : null;

    //If PO and Items already exist in the PO, we should use the supplier from the PO for validation. If not, we can use the supplier from the first Catalog Item as the expected supplier for all items.

    let requiredSupplier =
      po && po?.items?.length > 0 ? po.supplier : catalogItems[0]?.supplier;

    // 4. Single-pass validation for all items
    for (const item of catalogItems) {
      if (item.supplier !== requiredSupplier) {
        return res.status(409).json({
          error: "Conflict",
          message: `Supplier mismatch. Expected: ${requiredSupplier}, but found ${item.supplier} on product ${item.productId}.`,
        });
      }
    }

    // Attach to req.body
    req.body.validatedItems = catalogItems;
    req.body.targetPO = po;

    next();
  } catch (error) {
    next(error);
  }
};
