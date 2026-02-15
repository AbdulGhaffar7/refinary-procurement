import { CatalogItem } from "../api/models/CatalogItemSchema";

export const upsertItems = async (items: any[]) => {
  const results = [];

  for (const item of items) {
    const updated = await CatalogItem.findOneAndUpdate(
      { id: item.id },
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
