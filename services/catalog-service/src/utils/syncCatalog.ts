import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL_PROCUREMENT;

// Map catalog item to procurement schema
export const mapToMirrorPayload = (item: any) => ({
  productId: item.id,
  name: item.name,
  supplier: item.supplier,
  priceUsd: item.priceUsd,
  inStock: item.inStock,
  leadTimeDays: item.leadTimeDays,
});

export const syncUpsertToProcurement = async (item: any) => {
  try {
    let data = Array.isArray(item)
      ? item?.map((element: Object) => mapToMirrorPayload(element))
      : mapToMirrorPayload(item);

    await axios.post(`${BASE_URL}`, data, {
      timeout: 20000,
    });
    console.log(`✔ Synced item ${item.id} to procurement`);
    return 1;
  } catch (err: any) {
    console.error(`❌ Procurement sync failed for ${item.id}:`, err.message);
    return 0;
  }
};

// DELETE mirror
export const syncDeleteToProcurement = async (productId: string) => {
  try {
    console.log(`Attempting to delete item ${productId} from procurement...`);
    await axios.delete(`${BASE_URL}${productId}`, {
      timeout: 4000,
    });
    console.log(`✔ Deleted item ${productId} from procurement`);
    return 1;
  } catch (err: any) {
    console.error(
      `❌ Procurement delete failed for ${productId}:`,
      err.message
    );
    return 0;
  }
};
