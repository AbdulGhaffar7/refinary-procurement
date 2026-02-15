import { Request, Response } from "express";
const { CatalogItem } = require("../models/CatalogItemSchema");
import {
  syncUpsertToProcurement,
  syncDeleteToProcurement,
} from "../../utils/syncCatalog";
import { upsertItems } from "../../utils/upsertArray";

// CREATE
export const createItem = async (req: Request, res: Response) => {
  try {
    const newItem = await upsertItems(
      Array.isArray(req.body) ? req.body : [req.body]
    );

    await syncUpsertToProcurement(newItem);

    res.status(201).json(newItem);
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Product ID already exists in the Data" });
    }
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // This is the business ID like GST-0001
    const updatedItem = await CatalogItem.findOneAndUpdate(
      { id: id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    await syncUpsertToProcurement(updatedItem);
    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await CatalogItem.findOneAndDelete({ id: id });

    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });

    await syncDeleteToProcurement(id as string);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH / FILTER / SORT

export const getItems = async (req: Request, res: Response) => {
  try {
    const { search, category, inStock, sortBy, order } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (inStock) query.inStock = inStock;

    if (search) {
      const regex = new RegExp(search as string, "i");

      query.$or = [
        { name: regex },
        { id: regex },
        { supplier: regex },
        { manufacturer: regex },
        { model: regex },
      ];
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortField = (sortBy as string) || "id"; // Default sort by ID

    const items = await CatalogItem.find(query).sort({
      [sortField]: sortOrder,
    });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
