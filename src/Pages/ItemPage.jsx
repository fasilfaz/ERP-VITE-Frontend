import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from "../Components/Sidebar/Sidebar";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const res = await axios.get("http://localhost:5000/api/items/get-item");
      setItemsData(res.data);
      setTotalCount(res.data.length);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("http://localhost:5000/api/items/delete-item", {
        itemId: record._id,
      });
      getAllItems();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "SHOW_LOADING" });
      if (editItem === null) {
        await axios.post("http://localhost:5000/api/items/add-item", formData);
      } else {
        await axios.put("http://localhost:5000/api/items/edit-item", {
          ...formData,
          itemId: editItem._id,
        });
      }
      getAllItems();
      setOpenModal(false);
      setEditItem(null);
      setFormData({ name: "", price: "", image: "", category: "" });
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const columns = [
    { 
      name: "name", 
      label: "Name",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <img src={value} alt="item" style={{ height: 60, width: 60 }} />
        ),
      },
    },
    { 
      name: "price", 
      label: "Price",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "category",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          const row = itemsData[tableMeta.rowIndex];
          return (
            <Box>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    setEditItem(row);
                    setFormData(row);
                    setOpenModal(true);
                  }}
                  size="small"
                  sx={{ color: "#5B8FF9" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => handleDelete(row)}
                  size="small"
                  sx={{ color: "#FE7062" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    },
  ];

  const theme = createTheme({
    components: {
      MuiToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "#F1F3F7",
            boxShadow: "none",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            backgroundColor: "none",
            borderRadius: "15px",
          },
          footer: {
            backgroundColor: "none",
          },
        },
      },
      MuiTableFooter: {
        styleOverrides: {
          root: {
            borderTop: "none",
            backgroundColor: "#F1F3F7",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "none",
            padding: "8px",
            textAlign: "left",
          },
          head: {
            // backgroundColor: "red",
            fontWeight: "bold",
            fontSize: "1rem",
            textTransform: "uppercase",
           
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            borderRadius: "15px",
            background: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "15px",
            backgroundColor: "#F1F3F7",
          },
        },
      },

      MuiTableBody: {
        styleOverrides: {
          root: {
            borderRadius: "15px",
            backgroundColor: "none",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            minWidth: "200px",
          },
        },
      },
      MuiFormGroup: {
        styleOverrides: {
          root: {
            marginLeft: "20px",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            textAlign: "left",
          },
          caption: {
            marginTop: "20px",
            fontSize: "0.875rem",
            fontWeight: "400",
            lineHeight: "1.5",
            color: "rgba(0, 0, 0, 0.87)",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            width: "150px",
          },
        },
      },
      MuiBox: {
        styleOverrides: {
          root: {
            borderRadius: "15px",
          },
        },
      },
    },
  });

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    print: false,
    download: false,
    viewColumns: true,
    filter: true,
    search: true,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 20, 30, 40],
    serverSide: true,
    count: totalCount,
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          setPage(tableState.page + 1);
          break;
        case "changeRowsPerPage":
          setRowsPerPage(tableState.rowsPerPage);
          setPage(1);
          break;
        default:
          break;
      }
    },
    setRowProps: (_, rowIndex) => ({
      style: {
        backgroundColor: rowIndex % 2 === 0 ? "#F7F6FE" : "#FFFFFF",
        color: "black",
      },
    }),
    customToolbar: () => (
      <Tooltip title="Add Item">
        <IconButton
          onClick={() => setOpenModal(true)}
          sx={{
            "&:hover": {
              "& .MuiSvgIcon-root": {
                color: "#1976d2",
              },
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    ),
  };

  return (
    <Sidebar>

    <Box sx={{ p: 3 }}>
      
      <ThemeProvider theme={theme}>
        <MUIDataTable
          title="Product List"
          data={itemsData}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      <Dialog 
        open={openModal} 
        onClose={() => {
          setOpenModal(false);
          setEditItem(null);
          setFormData({ name: "", price: "", image: "", category: "" });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editItem !== null ? "Edit Item" : "Add New Item"}
          <IconButton
            onClick={() => {
              setOpenModal(false);
              setEditItem(null);
              setFormData({ name: "", price: "", image: "", category: "" });
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="price"
              label="Price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="image"
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <MenuItem value="Cricket">Cricket</MenuItem>
                <MenuItem value="Tennis">Tennis</MenuItem>
                <MenuItem value="Table Tennis">Table Tennis</MenuItem>
                <MenuItem value="Fitness">Fitness</MenuItem>
                <MenuItem value="Basketball">Basketball</MenuItem>
                <MenuItem value="Badminton">Badminton</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenModal(false);
              setEditItem(null);
              setFormData({ name: "", price: "", image: "", category: "" });
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editItem !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    </Sidebar>
  );
};

export default ItemPage;