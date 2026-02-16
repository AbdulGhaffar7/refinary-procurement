import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Box,
  Typography,
} from "@mui/material";

export function FiltersPanel({ value, onChange }) {
  const statusFields = [
    "",
    "DRAFT",
    "SUBMITTED",
    "APPROVED",
    "REJECTED",
    "FULFILLED",
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

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={value.status}
            label="Status"
            onChange={(e) => onChange({ ...value, status: e.target.value })}
          >
            {statusFields.map((s) => (
              <MenuItem key={s} value={s}>
                {s || "All"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            <MenuItem value="poNumber_asc">PO Number Low → High</MenuItem>
            <MenuItem value="poNumber_desc">PO Number High → Low</MenuItem>
            <MenuItem value="totalAmount_asc">Total Amount Low → High</MenuItem>
            <MenuItem value="totalAmount_desc">
              Total Amount High → Low
            </MenuItem>
            <MenuItem value="supplier_asc">Supplier A-Z</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
