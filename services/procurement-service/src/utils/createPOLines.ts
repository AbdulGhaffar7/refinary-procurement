// Utility to map catalog items and user quantities to PO line items

export const createPOLines = (items: any[], validatedItems: any[]) => {
  const catalogLookup = new Map(validatedItems?.map((v) => [v.productId, v]));

  return items?.map((reqItem) => {
    const info = catalogLookup.get(reqItem.catalogItemId);
    const quantity = Number(reqItem.quantity) || 0;
    const pricePerUnit = info?.priceUsd || 0;

    return {
      catalogItemId: info?.productId,
      name: info?.name,
      quantity,
      pricePerUnit,
      priceTotal: pricePerUnit * quantity,
      supplier: info?.supplier, // Kept for reference
    };
  });
};
