import React from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete, Close, ShoppingCart } from "@mui/icons-material";
import {
  setHeader,
  increaseQty,
  decreaseQty,
  removeItem,
  closeDrawer,
  resetPO,
} from "../../redux-toolkit/poSlice";
import { useDispatch, useSelector } from "react-redux";
import { poApi } from "../../api/endpoints";
import { useSnackbar } from "notistack";

export function PODrawer() {
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const handleHeaderChange = (field, value) =>
    dispatch(setHeader({ [field]: value }));

  const { open, header, items, poNumber } = useSelector((state) => state.po);

  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (poNumber) {
        const update = await poApi.SyncItemstoPO(poNumber, {
          items: [...items],
        });

        if (update.status === 200) {
          snackbar.enqueueSnackbar("PO updated successfully!", {
            variant: "success",
          });
          dispatch(resetPO());
          dispatch(closeDrawer());
        } else {
          setError("Failed to update PO. Please try again.");
          snackbar.enqueueSnackbar("Failed to update PO. Please try again.", {
            variant: "error",
          });
        }
      } else {
        const create = await poApi.createNewPO({
          ...header,
          items,
        });

        if (create.status === 201) {
          snackbar.enqueueSnackbar("Draft PO created successfully!", {
            variant: "success",
          });
          dispatch(resetPO());
          dispatch(closeDrawer());
        } else {
          setError("Failed to save PO. Please try again.");
          snackbar.enqueueSnackbar("Failed to save PO. Please try again.", {
            variant: "error",
          });
        }
      }
    } catch (err) {
      setError("Failed to save PO. Please try again.");
      snackbar.enqueueSnackbar("Failed to save PO. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      dispatch(closeDrawer());
    }
  };

  const isFormValid =
    items.length &&
    header.requester &&
    header.costCenter &&
    header.neededBy &&
    header.paymentTerms;

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          mt: 10,
        }}
      >
        {/* Fixed Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography variant="h6" fontWeight={600}>
              {poNumber ? `Edit PO #${poNumber}` : "Create Purchase Order"}
            </Typography>
            <IconButton
              onClick={handleClose}
              disabled={isSubmitting}
              size="small"
              sx={{
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {items.length > 0 && (
            <Chip
              icon={<ShoppingCart />}
              label={`${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            fontWeight={600}
          >
            PURCHASE ORDER DETAILS
          </Typography>

          <Stack spacing={2} mt={1.5}>
            <TextField
              label="Requester"
              size="small"
              value={header.requester}
              required
              onChange={(e) => handleHeaderChange("requester", e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter requester name"
            />

            <TextField
              label="Cost Center"
              size="small"
              value={header.costCenter}
              required
              onChange={(e) => handleHeaderChange("costCenter", e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter cost center"
            />

            <TextField
              type="text"
              label="Needed By"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={header.neededBy}
              required
              onChange={(e) => handleHeaderChange("neededBy", e.target.value)}
              disabled={isSubmitting}
            />

            <FormControl size="small" required>
              <InputLabel>Payment Terms</InputLabel>
              <Select
                label="Payment Terms"
                value={header.paymentTerms}
                onChange={(e) =>
                  handleHeaderChange("paymentTerms", e.target.value)
                }
                disabled={isSubmitting}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
                <MenuItem value="Installments">Installments</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            fontWeight={600}
          >
            LINE ITEMS
          </Typography>

          {items.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <ShoppingCart sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">No items added yet</Typography>
              <Typography variant="caption" color="text.disabled">
                Add items from the catalog to get started
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} mt={1.5}>
              {items.map((item, index) => (
                <Box
                  key={item.catalogItemId}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.default",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {item.catalogItemId}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => dispatch(removeItem(item.catalogItemId))}
                      disabled={isSubmitting}
                      sx={{ ml: 1 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mr: "auto" }}
                    >
                      Quantity:
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(decreaseQty(item.catalogItemId))}
                      disabled={isSubmitting || item.quantity <= 1}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        minWidth: 32,
                        textAlign: "center",
                        px: 1,
                        py: 0.5,
                        bgcolor: "background.paper",
                        borderRadius: 0.5,
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(increaseQty(item.catalogItemId))}
                      disabled={isSubmitting}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        "&:hover": { borderColor: "primary.main" },
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Fixed Footer */}
        <Box
          sx={{
            p: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="contained"
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
              size="large"
              startIcon={
                isSubmitting && <CircularProgress size={20} color="inherit" />
              }
            >
              {isSubmitting
                ? poNumber
                  ? "Updating..."
                  : "Creating..."
                : poNumber
                ? "Update PO"
                : "Create PO"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => dispatch(resetPO())}
              disabled={isSubmitting}
              color="inherit"
            >
              Reset Form
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
