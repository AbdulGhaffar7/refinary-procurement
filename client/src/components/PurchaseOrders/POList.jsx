import React from "react";
import {
  Grid,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function POList({ data, isLoading, onReview }) {
  const navigate = useNavigate();
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

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>PO Number</b>
            </TableCell>
            <TableCell>
              <b>Supplier</b>
            </TableCell>
            <TableCell>
              <b>Items</b>
            </TableCell>
            <TableCell>
              <b>Total Amount</b>
            </TableCell>
            <TableCell>
              <b>Needed By</b>
            </TableCell>

            <TableCell>
              <b>Status</b>
            </TableCell>

            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((p) => (
            <TableRow key={p.poNumber} hover>
              <TableCell>
                <Typography fontWeight={500}>{p.poNumber}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{p.supplier}</Typography>
              </TableCell>
              <TableCell>{p.items.length}</TableCell>
              <TableCell>${p.totalAmount}</TableCell>
              <TableCell>{p.neededBy}</TableCell>
              <TableCell>{p.status}</TableCell>

              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    onReview(navigate(`/purchase-order/${p.poNumber}`))
                  }
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
