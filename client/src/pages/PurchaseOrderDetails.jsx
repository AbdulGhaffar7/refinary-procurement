import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
  Stack,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Inventory } from "@mui/icons-material";
import PageHeader from "../components/Layout/PageHeader";
import { poApi } from "../api/endpoints";
import { useDispatch } from "react-redux";
import { updatePOState } from "../redux-toolkit/poSlice";

function StatusChip({ status }) {
  const map = {
    DRAFT: "default",
    SUBMITTED: "primary",
    APPROVED: "success",
    REJECTED: "error",
  };
  return (
    <Chip
      label={status}
      color={map[status] || "default"}
      sx={{
        fontWeight: 600,
        fontSize: "0.813rem",
        letterSpacing: "0.5px",
        px: 0.5,
      }}
    />
  );
}

export default function PODetails() {
  const { poNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [po, setPo] = useState(null);
  const [history, setHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadPO = async () => {
    setLoading(true);
    const res = await poApi.getPODetail(poNumber);
    setPo(res.data.data);
    setHistory(res.data.history);
    setLoading(false);
  };

  const handleEdit = () => {
    const data = {
      open: true,
      poNumber: poNumber,
      supplier: po.supplier,
      header: {
        requester: po.requester,
        costCenter: po.costCenter,
        neededBy: po.neededBy,
        paymentTerms: po.paymentTerms,
      },
      items: [
        ...po?.items?.map((item) => {
          return {
            catalogItemId: item.catalogItemId,
            quantity: item.quantity,
            name: item.name,
            supplier: po.supplier,
          };
        }),
      ], // { catalogItemId, quantity }
    };
    dispatch(updatePOState(data));
    navigate("/");
  };

  useEffect(() => {
    loadPO();
  }, [poNumber]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await poApi.submitPO(poNumber, {
      status: "SUBMITTED",
      notes: "N/A",
    });
    await loadPO();
    setSubmitting(false);
  };

  if (loading)
    return (
      <Box p={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 8 }}>
      <PageHeader
        title={`Purchase Order ${po.poNumber}`}
        description="Review order, verify pricing and finalize submission"
        icon={Inventory}
      />

      {/* HEADER SUMMARY */}
      <Paper
        elevation={0}
        sx={{
          p: 4.5,
          mt: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 3, letterSpacing: "-0.5px" }}
            >
              {po.supplier || "Supplier not selected"}
            </Typography>
            <Stack direction="row" spacing={5} flexWrap="wrap" useFlexGap>
              <Info label="Requester" value={po.requester} />
              <Info label="Cost Center" value={po.costCenter} />
              <Info
                label="Needed By"
                value={new Date(po.neededBy).toLocaleDateString()}
              />
              <Info label="Payment" value={po.paymentTerms} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <StatusChip status={po.status} />
            <Typography
              variant="h3"
              fontWeight={700}
              mt={3}
              sx={{ letterSpacing: "-1px" }}
            >
              ${po.totalAmount.toLocaleString()}
            </Typography>
            {po.status === "DRAFT" && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 3,
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "0.938rem",
                    textTransform: "none",
                    borderRadius: 1.5,
                    boxShadow: 2,
                    mr: 1,
                  }}
                  onClick={() => {
                    handleEdit(po.poNumber);
                  }}
                >
                  Edit PO
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                    px: 5,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "0.938rem",
                    textTransform: "none",
                    borderRadius: 1.5,
                    boxShadow: 2,
                  }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit PO"}
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* ITEMS */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          mt: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
          sx={{ letterSpacing: "-0.3px" }}
        >
          Order Items
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.813rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "text.secondary",
                    pb: 2,
                  }}
                >
                  Product
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.813rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "text.secondary",
                    pb: 2,
                  }}
                >
                  Qty
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.813rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "text.secondary",
                    pb: 2,
                  }}
                >
                  Pricing
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {po.items.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{
                    "& td": { py: 2.5, borderColor: "divider" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <Typography
                      fontWeight={600}
                      sx={{ mb: 0.5, fontSize: "0.938rem" }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {item.catalogItemId}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.938rem",
                    }}
                  >
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight={600}
                      sx={{ mb: 0.5, fontSize: "0.938rem" }}
                    >
                      ${item.priceTotal.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      ${item.pricePerUnit} × {item.quantity}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* HISTORY BOTTOM */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          mt: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          mb={3}
          sx={{ letterSpacing: "-0.3px" }}
        >
          Activity History
        </Typography>
        <Stack spacing={3}>
          {history.map((h, index) => (
            <Box key={h._id}>
              <Typography
                fontWeight={600}
                sx={{ mb: 0.75, fontSize: "0.938rem" }}
              >
                {h.action}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.813rem" }}
              >
                {new Date(h.timestamp).toLocaleString()} • {h.fromStatus} →{" "}
                {h.toStatus}
              </Typography>
              {index < history.length - 1 && <Divider sx={{ mt: 3 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

function Info({ label, value }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontSize: "0.75rem",
          fontWeight: 600,
          mb: 0.5,
          display: "block",
        }}
      >
        {label}
      </Typography>
      <Typography fontWeight={600} sx={{ fontSize: "0.938rem" }}>
        {value}
      </Typography>
    </Box>
  );
}
