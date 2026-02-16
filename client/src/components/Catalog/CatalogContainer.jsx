import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { FiltersPanel } from "./FilterPanel";
import { ProductList } from "./ProductList";
import useCatalogQuery from "../../hooks/useCatalogQuery";
import useDebounce from "../../hooks/useDebounce";
import { PODrawer } from "../PurchaseOrders/PODrawer";
import { addItem, openDrawer } from "../../redux-toolkit/poSlice";

export default function CatalogContainer() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    inStock: true,
    sortBy: "id",
    order: "asc",
  });
  const snackbar = useSnackbar();

  const debouncedSearch = useDebounce(filters.search, 500);

  const { supplier } = useSelector((state) => state.po);

  const debouncedFilters = {
    ...filters,
    search: debouncedSearch,
  };

  const { data, isLoading } = useCatalogQuery(debouncedFilters);

  const dispatch = useDispatch();

  const handleAdd = (product) => {
    if (product.supplier !== supplier && supplier) {
      snackbar.enqueueSnackbar(
        "You can only add items from the same supplier to a purchase order.",
        { variant: "error" }
      );
    } else {
      dispatch(
        addItem({
          catalogItemId: product.id,
          name: product.name,
          supplier: product.supplier,
        })
      );
      dispatch(openDrawer());
    }
  };

  return (
    <Box>
      <PODrawer />
      <Grid
        container
        sx={{
          width: "100%",
        }}
      >
        <Grid item xs={12}>
          <FiltersPanel value={filters} onChange={setFilters} />
        </Grid>
        <Grid item xs={12}>
          <ProductList
            onAdd={handleAdd}
            data={data?.data}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
