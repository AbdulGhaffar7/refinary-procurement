import { createSlice } from "@reduxjs/toolkit";

export const poSlice = createSlice({
  name: "po",
  initialState: {
    open: false,
    poNumber: null,
    supplier: null,
    header: {
      requester: "",
      costCenter: "CC-1234",
      neededBy: "",
      paymentTerms: "cash",
    },
    items: [], // { catalogItemId, quantity }
  },
  reducers: {
    openDrawer: (state) => {
      state.open = true;
    },
    closeDrawer: (state) => {
      state.open = false;
    },
    setHeader: (state, action) => {
      state.header = { ...state.header, ...action.payload };
    },
    addItem: (state, action) => {
      if (!state.supplier) {
        state.supplier = action.payload.supplier;
      }
      if (state.supplier === action.payload.supplier) {
        const existing = state.items.find(
          (i) => i.catalogItemId === action.payload.catalogItemId
        );
        if (existing) existing.quantity += 1;
        else
          state.items.push({
            catalogItemId: action.payload.catalogItemId,
            name: action.payload.name,
            quantity: 1,
          });
      }
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.catalogItemId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.catalogItemId === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0)
        state.items = state.items.filter(
          (i) => i.catalogItemId !== action.payload
        );
    },
    updatePOState: (state, action) => {
      return { ...state, ...action.payload };
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (i) => i.catalogItemId !== action.payload
      );
    },
    resetPO: (state) => {
      state.items = [];
      state.header = {
        requester: "",
        costCenter: "CC-1234",
        neededBy: "",
        paymentTerms: "cash",
      };
    },
  },
});

export const {
  openDrawer,
  closeDrawer,
  setHeader,
  addItem,
  increaseQty,
  decreaseQty,
  removeItem,
  resetPO,
  updatePOState,
} = poSlice.actions;
export default poSlice.reducer;
