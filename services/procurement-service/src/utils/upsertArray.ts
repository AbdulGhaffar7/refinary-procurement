import { CatalogMirror } from "../api/models/CatalogMirrorSchema";

export const upsertMirrorItems = async (items: any[]) => {
  const results = [];

  for (const item of items) {
    const updated = await CatalogMirror.findOneAndUpdate(
      { productId: item.productId },
      {
        ...item,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    results.push(updated);
  }

  return results;
};
