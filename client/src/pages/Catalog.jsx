import React from "react";
import { Box, Button } from "@mui/material";
import { Add, Inventory } from "@mui/icons-material";
import PageHeader from "../components/Layout/PageHeader";
import CatalogContainer from "../components/Catalog/CatalogContainer";
import { useDispatch } from "react-redux";
import { openDrawer } from "../redux-toolkit/poSlice";

export default function CatalogPage() {
  const dispatch = useDispatch();

  return (
    <Box>
      <PageHeader
        title="Product Catalog"
        description="Browse and search through our extensive product catalog to find the best components for your projects."
        icon={Inventory}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            dispatch(openDrawer());
          }}
          sx={{
            backgroundColor: "white",
            color: "#1976d2",
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            },
          }}
        >
          Purchase Order
        </Button>
      </PageHeader>
      <CatalogContainer />
    </Box>
  );
}
