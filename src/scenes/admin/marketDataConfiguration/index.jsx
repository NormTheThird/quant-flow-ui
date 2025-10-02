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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { marketDataConfigApi, symbolApi } from "../../../services/api";

const MarketDataConfiguration = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State
  const [configurations, setConfigurations] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchText, setSearchText] = useState("");

  // Add symbol form state
  const [newConfig, setNewConfig] = useState({
    symbolId: "",
    exchange: "Kraken",
    is1mActive: false,
    is5mActive: false,
    is15mActive: false,
    is1hActive: false,
    is4hActive: false,
    is1dActive: false,
  });

  // Load data on mount
  useEffect(() => {
    loadConfigurations();
    loadSymbols();
  }, []);

  // Get available symbols (active, not deleted, not already configured for this exchange)
  const availableSymbols = symbols.filter((symbol) => {
    const alreadyConfigured = configurations.some((config) => config.symbolId === symbol.id && config.exchange === newConfig.exchange);
    return !alreadyConfigured;
  });

  const loadConfigurations = async () => {
    setLoading(true);
    try {
      const response = await marketDataConfigApi.getAllConfigurations();
      setConfigurations(response.data || []);
    } catch (error) {
      showSnackbar("Failed to load configurations", "error");
      console.error("Error loading configurations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSymbols = async () => {
    try {
      const response = await symbolApi.getActiveSymbols();
      setSymbols(response.data || []);
    } catch (error) {
      showSnackbar("Failed to load symbols", "error");
      console.error("Error loading symbols:", error);
    }
  };

  const handleToggleInterval = async (id, interval, currentValue) => {
    try {
      await marketDataConfigApi.toggleInterval(id, interval, !currentValue);
      await loadConfigurations();
      showSnackbar(`${interval} ${!currentValue ? "enabled" : "disabled"} successfully`, "success");
    } catch (error) {
      showSnackbar(`Failed to toggle ${interval}`, "error");
      console.error("Error toggling interval:", error);
    }
  };

  const handleAddSymbol = async () => {
    try {
      await marketDataConfigApi.createConfiguration(newConfig);
      setOpenAddDialog(false);
      await loadConfigurations();
      showSnackbar("Symbol configuration added successfully", "success");
      resetNewConfig();
    } catch (error) {
      showSnackbar("Failed to add symbol configuration", "error");
      console.error("Error adding symbol:", error);
    }
  };

  const resetNewConfig = () => {
    setNewConfig({
      symbolId: "",
      exchange: "Kraken",
      is1mActive: false,
      is5mActive: false,
      is15mActive: false,
      is1hActive: false,
      is4hActive: false,
      is1dActive: false,
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter configurations based on search text
  const filteredConfigurations = configurations.filter((config) => {
    const searchLower = searchText.toLowerCase();
    return config.symbolName?.toLowerCase().includes(searchLower) || config.exchange?.toLowerCase().includes(searchLower);
  });

  // DataGrid columns
  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: 150,
      valueGetter: (value, row) => row.symbolName || "N/A",
    },
    {
      field: "exchange",
      headerName: "Exchange",
      width: 120,
      valueGetter: (value, row) => row.exchange || "N/A",
    },
    {
      field: "is1mActive",
      headerName: "1m",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "1m", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "is5mActive",
      headerName: "5m",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "5m", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "is15mActive",
      headerName: "15m",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "15m", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "is1hActive",
      headerName: "1h",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "1h", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "is4hActive",
      headerName: "4h",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "4h", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "is1dActive",
      headerName: "1d",
      width: 80,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleInterval(params.row.id, "1d", params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.greenAccent[600],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.greenAccent[600],
            },
          }}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      valueGetter: (value, row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box>
          <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
            Market Data Configuration
          </Typography>
          <Typography variant="h5" color={colors.greenAccent[400]}>
            Manage which symbols and intervals to collect from exchanges
          </Typography>
        </Box>

        <Box display="flex" gap="10px">
          <Tooltip title="Refresh">
            <IconButton onClick={loadConfigurations} sx={{ backgroundColor: colors.primary[400] }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}>
            Add Symbol
          </Button>
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box mb="20px">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by symbol or exchange..."
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
        ) : filteredConfigurations.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="h5" color={colors.grey[300]}>
              {searchText ? "No configurations match your search." : "No configurations found. Click 'Add Symbol' to get started."}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredConfigurations}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        )}
      </Box>

      {/* ADD SYMBOL DIALOG */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400] }}>Add Symbol Configuration</DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Exchange</InputLabel>
            <Select value={newConfig.exchange} onChange={(e) => setNewConfig({ ...newConfig, exchange: e.target.value, symbolId: "" })} label="Exchange">
              <MenuItem value="Kraken">Kraken</MenuItem>
              <MenuItem value="Kucoin">Kucoin</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Symbol</InputLabel>
            <Select value={newConfig.symbolId} onChange={(e) => setNewConfig({ ...newConfig, symbolId: e.target.value })} label="Symbol">
              {availableSymbols.length === 0 ? (
                <MenuItem disabled>No available symbols for {newConfig.exchange}</MenuItem>
              ) : (
                availableSymbols.map((symbol) => (
                  <MenuItem key={symbol.id} value={symbol.id}>
                    {symbol.symbol}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Intervals to Collect
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is1mActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is1mActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="1 minute"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is5mActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is5mActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="5 minutes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is15mActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is15mActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="15 minutes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is1hActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is1hActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="1 hour"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is4hActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is4hActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="4 hours"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newConfig.is1dActive}
                  onChange={(e) => setNewConfig({ ...newConfig, is1dActive: e.target.checked })}
                  sx={{
                    color: colors.greenAccent[400],
                    "&.Mui-checked": {
                      color: colors.greenAccent[600],
                    },
                  }}
                />
              }
              label="1 day"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddSymbol}
            variant="contained"
            disabled={!newConfig.symbolId}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[700],
              },
            }}>
            Add Symbol
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

export default MarketDataConfiguration;
