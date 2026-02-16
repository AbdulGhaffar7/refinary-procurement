import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Box,
  Typography,
} from "@mui/material";

export function FiltersPanel({ value, onChange }) {
  const categories = [
    "",
    "Gasket",
    "Hand Tool",
    "Heat Exchanger",
    "Instrumentation",
    "Pump",
    "Valve",
  ];

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Typography fontWeight={600}>Filters:</Typography>

        <TextField
          size="small"
          label="Search"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          sx={{ minWidth: 220 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={value.category}
            label="Category"
            onChange={(e) => onChange({ ...value, category: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={value.inStock}
              onChange={(e) =>
                onChange({ ...value, inStock: e.target.checked })
              }
            />
          }
          label="In Stock"
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value={`${value.sortBy}_${value.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split("_");
              onChange({ ...value, sortBy, order });
            }}
          >
            <MenuItem value="id_asc">ID</MenuItem>
            <MenuItem value="priceUsd_asc">Price Low → High</MenuItem>
            <MenuItem value="priceUsd_desc">Price High → Low</MenuItem>
            <MenuItem value="leadTimeDays_asc">Lead Time Low → High</MenuItem>
            <MenuItem value="leadTimeDays_desc">Lead Time High → Low</MenuItem>
            <MenuItem value="supplier_asc">Supplier A-Z</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
