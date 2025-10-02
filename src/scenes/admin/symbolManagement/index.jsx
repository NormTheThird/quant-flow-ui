import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { symbolApi } from "../../../services/api/symbolApiService";

const SymbolManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchText, setSearchText] = useState("");

  // Form state
  const [symbolForm, setSymbolForm] = useState({
    id: "",
    symbol: "",
    baseAsset: "",
    quoteAsset: "",
    isActive: true,
    minTradeAmount: 0,
    pricePrecision: 8,
    quantityPrecision: 8,
  });

  // Load data on mount
  useEffect(() => {
    loadSymbols();
  }, []);

  const loadSymbols = async () => {
    setLoading(true);
    try {
      const response = await symbolApi.getAllSymbols();
      setSymbols(response.data || []);
    } catch (error) {
      showSnackbar("Failed to load symbols", "error");
      console.error("Error loading symbols:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (symbol = null) => {
    if (symbol) {
      setEditMode(true);
      setSymbolForm(symbol);
    } else {
      setEditMode(false);
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSaveSymbol = async () => {
    try {
      if (editMode) {
        await symbolApi.updateSymbol(symbolForm.id, symbolForm);
      } else {
        await symbolApi.createSymbol(symbolForm);
      }

      handleCloseDialog();
      await loadSymbols();
      showSnackbar(`Symbol ${editMode ? "updated" : "created"} successfully`, "success");
    } catch (error) {
      // Check if this is a deleted symbol that can be restored
      if (error.statusCode === 409 && error.responseData && error.responseData.isDeleted) {
        if (window.confirm(`Symbol '${symbolForm.symbol}' was previously deleted. Would you like to restore it with the current values?`)) {
          try {
            await symbolApi.restoreSymbol(error.responseData.id, symbolForm);
            handleCloseDialog();
            await loadSymbols();
            showSnackbar("Symbol restored successfully", "success");
          } catch (restoreError) {
            showSnackbar("Failed to restore symbol", "error");
            console.error("Error restoring symbol:", restoreError);
          }
        }
      } else {
        showSnackbar(`Failed to ${editMode ? "update" : "create"} symbol`, "error");
        console.error("Error saving symbol:", error);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} symbol(s)?`)) {
      return;
    }

    try {
      // Delete each symbol individually
      await Promise.all(selectedRows.map((id) => symbolApi.deleteSymbol(id)));

      setSelectedRows([]);
      await loadSymbols();
      showSnackbar(`${selectedRows.length} symbol(s) deleted successfully`, "success");
    } catch (error) {
      showSnackbar("Failed to delete symbols", "error");
      console.error("Error deleting symbols:", error);
    }
  };

  const resetForm = () => {
    setSymbolForm({
      id: "",
      symbol: "",
      baseAsset: "",
      quoteAsset: "",
      isActive: true,
      minTradeAmount: 0,
      pricePrecision: 8,
      quantityPrecision: 8,
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter symbols based on search text
  const filteredSymbols = symbols.filter((symbol) => {
    const searchLower = searchText.toLowerCase();
    return (
      symbol.symbol?.toLowerCase().includes(searchLower) ||
      symbol.baseAsset?.toLowerCase().includes(searchLower) ||
      symbol.quoteAsset?.toLowerCase().includes(searchLower)
    );
  });

  // DataGrid columns
  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: 150,
      valueGetter: (value, row) => row.symbol || "N/A",
    },
    {
      field: "baseAsset",
      headerName: "Base Asset",
      width: 120,
      valueGetter: (value, row) => row.baseAsset || "N/A",
    },
    {
      field: "quoteAsset",
      headerName: "Quote Asset",
      width: 120,
      valueGetter: (value, row) => row.quoteAsset || "N/A",
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => <Box color={params.value ? colors.greenAccent[400] : colors.redAccent[400]}>{params.value ? "Yes" : "No"}</Box>,
    },
    {
      field: "minTradeAmount",
      headerName: "Min Trade",
      width: 120,
      valueGetter: (value, row) => row.minTradeAmount?.toFixed(8) || "0",
    },
    {
      field: "pricePrecision",
      headerName: "Price Precision",
      width: 130,
    },
    {
      field: "quantityPrecision",
      headerName: "Qty Precision",
      width: 130,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      valueGetter: (value, row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            Symbol Management
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Manage trading symbols and pairs
          </Typography>
        </Box>

        <Box display="flex" gap="10px">
          <Tooltip title="Refresh">
            <IconButton onClick={loadSymbols} sx={{ backgroundColor: colors.primary[400] }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}>
            Add Symbol
          </Button>
          {selectedRows.length > 0 && (
            <Button
              variant="contained"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeleteSelected}
              sx={{
                backgroundColor: colors.redAccent[600],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: colors.redAccent[700],
                },
              }}>
              Delete ({selectedRows.length})
            </Button>
          )}
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box mb="20px">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by symbol, base asset, or quote asset..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: colors.grey[300], mr: 1 }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: colors.primary[400],
              "& fieldset": {
                borderColor: colors.primary[300],
              },
              "&:hover fieldset": {
                borderColor: colors.primary[200],
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.greenAccent[500],
              },
            },
          }}
        />
      </Box>

      {/* DATA GRID */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="h5">Loading...</Typography>
          </Box>
        ) : filteredSymbols.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="h5" color={colors.grey[300]}>
              {searchText ? "No symbols match your search." : "No symbols found. Click 'Add Symbol' to get started."}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredSymbols}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            rowSelectionModel={selectedRows}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        )}
      </Box>

      {/* ADD/EDIT DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400] }}>{editMode ? "Edit Symbol" : "Add Symbol"}</DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400] }}>
          <TextField
            fullWidth
            label="Symbol"
            value={symbolForm.symbol}
            onChange={(e) => setSymbolForm({ ...symbolForm, symbol: e.target.value.toUpperCase() })}
            sx={{ mb: 2 }}
            placeholder="BTCUSDT"
          />
          <TextField
            fullWidth
            label="Base Asset"
            value={symbolForm.baseAsset}
            onChange={(e) => setSymbolForm({ ...symbolForm, baseAsset: e.target.value.toUpperCase() })}
            sx={{ mb: 2 }}
            placeholder="BTC"
          />
          <TextField
            fullWidth
            label="Quote Asset"
            value={symbolForm.quoteAsset}
            onChange={(e) => setSymbolForm({ ...symbolForm, quoteAsset: e.target.value.toUpperCase() })}
            sx={{ mb: 2 }}
            placeholder="USDT"
          />
          <TextField
            fullWidth
            type="number"
            label="Minimum Trade Amount"
            value={symbolForm.minTradeAmount}
            onChange={(e) => setSymbolForm({ ...symbolForm, minTradeAmount: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Price Precision"
            value={symbolForm.pricePrecision}
            onChange={(e) => setSymbolForm({ ...symbolForm, pricePrecision: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Quantity Precision"
            value={symbolForm.quantityPrecision}
            onChange={(e) => setSymbolForm({ ...symbolForm, quantityPrecision: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={symbolForm.isActive}
                onChange={(e) => setSymbolForm({ ...symbolForm, isActive: e.target.checked })}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: colors.greenAccent[600],
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: colors.greenAccent[600],
                  },
                }}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveSymbol}
            variant="contained"
            disabled={!symbolForm.symbol || !symbolForm.baseAsset || !symbolForm.quoteAsset}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}>
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SymbolManagement;
