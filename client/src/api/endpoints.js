import apiClientCatalog from "./catalogClient";
import apiClientProcurement from "./procurementClient";

export const poApi = {
  getPOs: (params = {}) =>
    apiClientProcurement.get("/purchase-order", { params }),

  getPODetail: (poNumber, params = {}) =>
    apiClientProcurement.get(`/purchase-order/${poNumber}`, { params }),

  createNewPO: (data) => apiClientProcurement.post("/purchase-order", data),
  SyncItemstoPO: (poNumber, data) =>
    apiClientProcurement.post(`/purchase-order/${poNumber}/items`, data),
  submitPO: (poNumber, data) =>
    apiClientProcurement.patch(`/purchase-order/${poNumber}/status`, data),
};

export const catalogApi = {
  getCatalogs: (params = {}) => apiClientCatalog.get("/catalog", { params }),
};
