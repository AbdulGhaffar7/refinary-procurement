import { Request, Response, NextFunction } from "express";

export const validateCatalogData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      error: "Validation Failed",
      message: "'data' must be an array of catalog items",
    });
  }

  for (const element of data) {
    const { id, name, supplier, priceUsd } = element;

    if (!id || !name || !supplier || priceUsd === undefined) {
      return res.status(400).json({
        error: "Validation Failed",
        message:
          "Fields 'id', 'name', 'supplier', and 'priceUsd' are required.",
      });
    }

    if (priceUsd < 0) {
      return res.status(400).json({
        error: "Invalid price",
        message: "Price cannot be negative.",
      });
    }
  }

  next();
};
