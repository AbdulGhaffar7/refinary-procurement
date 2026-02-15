// procurement-service/src/api/controllers/mirrorController.ts
import { Request, Response } from "express";
import { CatalogMirror } from "../models/CatalogMirrorSchema";
import { upsertMirrorItems } from "../../utils/upsertArray";

export const syncItem = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const productId = data?.productId;

    console.log("Received data for sync:", data);

    if (productId) {
      //  Update if exists
      const item = await CatalogMirror.findOneAndUpdate({ productId }, data, {
        upsert: true,
        new: true,
      });
      res.status(200).json(item);
    } else {
      const item = await upsertMirrorItems(Array.isArray(data) ? data : [data]);
      res.status(201).json(item);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  const items = await CatalogMirror.find();
  res.json(items);
};

export const deleteMirroredItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedItem = await CatalogMirror.findOneAndDelete({
      productId: id as string,
    });
    if (!deletedItem)
      return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
