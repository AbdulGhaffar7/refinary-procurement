import React, { useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { Add, Folder } from "@mui/icons-material";
import PageHeader from "../components/Layout/PageHeader";
import { FiltersPanel } from "../components/PurchaseOrders/FilterPanel";
import { POList } from "../components/PurchaseOrders/POList";
import usePOQuery from "../hooks/usePOQuery";

export default function PurchaseOrders() {
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "id",
    order: "asc",
  });

  const { data, isLoading } = usePOQuery(filters);

  const handleReview = (po) => {
    console.log("Add to PO", po);
  };

  return (
    <Box>
      <PageHeader
        title="Purchase Orders"
        description="Manage your purchase orders efficiently. Create new orders, track existing ones, and ensure timely deliveries for your projects."
        icon={Folder}
      />
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
          <POList
            onReview={handleReview}
            data={data?.data}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
