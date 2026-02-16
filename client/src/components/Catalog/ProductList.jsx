import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
  Typography,
  Button,
} from "@mui/material";

export function ProductList({ data, onAdd, isLoading }) {
  // Loading state
  if (isLoading || data?.length === 0)
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid item xs={12} key={i}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
        ))}
      </Grid>
    );

  const { supplier } = useSelector((state) => state.po);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Category</b>
            </TableCell>
            <TableCell>
              <b>Supplier</b>
            </TableCell>
            <TableCell>
              <b>Manufacturer</b>
            </TableCell>

            <TableCell>
              <b>Model</b>
            </TableCell>

            <TableCell>
              <b>Lead Time</b>
            </TableCell>
            <TableCell>
              <b>In Stock</b>
            </TableCell>
            <TableCell align="right">
              <b>Price</b>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>
                <Typography fontWeight={500}>{p.id}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{p.name}</Typography>
              </TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.supplier}</TableCell>
              <TableCell>{p.manufacturer}</TableCell>
              <TableCell>{p.model}</TableCell>

              <TableCell>
                <Chip
                  label={`${p.leadTimeDays} days`}
                  size="small"
                  color="warning"
                />
              </TableCell>
              <TableCell>
                {p.inStock ? (
                  <Chip label="In Stock" size="small" color="success" />
                ) : (
                  <Chip label={"Not In Stock"} size="small" color="warning" />
                )}
              </TableCell>

              <TableCell align="right">${p.priceUsd}</TableCell>

              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  disabled={supplier && supplier !== p.supplier}
                  onClick={() => onAdd(p)}
                >
                  Add to PO
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
