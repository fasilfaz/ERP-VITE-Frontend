import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import Sidebar from "../Components/Sidebar/Sidebar";
import { Package, Search } from "lucide-react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import { ADD_ITEMS_API, DELETE_ITEMS_API, GET_ALL_ITEMS_API, UPDATE_ITEMS_API } from "../Utils/Contants/Api";

const ItemPage = () => {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const getAllItems = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get(GET_ALL_ITEMS_API);
      setItemsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, []);

  const handleDelete = async (record) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post(DELETE_ITEMS_API, {
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
        await axios.post(ADD_ITEMS_API, formData);
      } else {
        await axios.put(UPDATE_ITEMS_API, {
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

  // Filter data based on search term
  const filteredData = itemsData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalItems = itemsData.length;
  const totalCategories = new Set(itemsData.map(item => item.category)).size;
  const totalValue = itemsData.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <Sidebar>
      <div className="p-2 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Product List</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded mx-auto sm:mx-0"></div>
          </div>
          <Package size={32} className="text-yellow-500" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalCategories}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Inventory Value</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 sm:py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm sm:text-base"
            />
            <Search className="absolute left-4 top-2.5 sm:top-3.5 text-gray-400" size={20} />
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            className="w-full sm:w-auto"
            sx={{
              background: 'linear-gradient(to right, #facc15, #ef4444, #ec4899)',
              '&:hover': {
                background: 'linear-gradient(to right, #fbbf24, #dc2626, #db2777)',
              }
            }}
          >
            Add Product
          </Button>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                  <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((item) => (
                  <tr 
                    key={item._id}
                    className="group hover:bg-gradient-to-r hover:from-yellow-50 hover:via-red-50 hover:to-pink-50 transition-colors duration-200"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-8 w-8 sm:h-12 sm:w-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm text-gray-600">{item.name}</span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        ₹{Number(item.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                        <IconButton
                          onClick={() => {
                            setEditItem(item);
                            setFormData(item);
                            setOpenModal(true);
                          }}
                          size="small"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(item)}
                          size="small"
                          className="text-red-500 hover:text-red-700"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 gap-3">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white
                  hover:opacity-90 transition-opacity"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white
                  hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      {/* Modal */}
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
          {editItem !== null ? "Edit Product" : "Add New Product"}
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
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(to right, #facc15, #ef4444, #ec4899)',
                '&:hover': {
                  background: 'linear-gradient(to right, #fbbf24, #dc2626, #db2777)',
                }
              }}
            >
              {editItem !== null ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      </div>
    </Sidebar>
  );
};

export default ItemPage;