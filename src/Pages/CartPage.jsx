import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Plus, Minus, Trash2, Search } from "lucide-react";
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
import CloseIcon from '@mui/icons-material/Close';
import { ADD_BILLS_API } from "../Utils/Contants/Api";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerNumber: "",
    paymentMode: ""
  });

  // Calculate totals
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  const tax = Number(((subTotal / 100) * 18).toFixed(2));
  const total = Number(subTotal) + tax;

  // Filter data based on search term
  const filteredData = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  //handle increament
  const handleIncreament = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handleDecreament = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newObject = {
        ...formData,
        cartItems,
        subTotal,
        tax,
        totalAmount: total,
      };
      await axios.post(ADD_BILLS_API, newObject);
      navigate("/bills");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded"></div>
          </div>
          <ShoppingCart size={40} className="text-yellow-500" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Items in Cart</p>
            <p className="text-2xl font-bold text-gray-900">{cartItems.length}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Sub Total</p>
            <p className="text-2xl font-bold text-gray-900">₹{subTotal.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total with Tax</p>
            <p className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 mr-4">
            <input
              type="text"
              placeholder="Search cart items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
          <Button
            variant="contained"
            onClick={() => setBillPopup(true)}
            disabled={cartItems.length === 0}
            sx={{
              background: 'linear-gradient(to right, #facc15, #ef4444, #ec4899)',
              '&:hover': {
                background: 'linear-gradient(to right, #fbbf24, #dc2626, #db2777)',
              }
            }}
          >
            Create Invoice
          </Button>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((item) => (
                  <tr 
                    key={item._id}
                    className="group hover:bg-gradient-to-r hover:from-yellow-50 hover:via-red-50 hover:to-pink-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{Number(item.price * item.quantity).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <IconButton
                          size="small"
                          onClick={() => handleDecreament(item)}
                          disabled={item.quantity === 1}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </IconButton>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <IconButton
                          size="small"
                          onClick={() => handleIncreament(item)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <IconButton
                          onClick={() =>
                            dispatch({
                              type: "DELETE_FROM_CART",
                              payload: item,
                            })
                          }
                          size="small"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium rounded-md 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white
                  hover:opacity-90 transition-opacity"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium rounded-md 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white
                  hover:opacity-90 transition-opacity"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        <Dialog 
          open={billPopup} 
          onClose={() => setBillPopup(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Create Invoice
            <IconButton onClick={() => setBillPopup(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <TextField
                fullWidth
                margin="dense"
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
              <TextField
                fullWidth
                margin="dense"
                label="Contact Number"
                value={formData.customerNumber}
                onChange={(e) => setFormData({ ...formData, customerNumber: e.target.value })}
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMode}
                  label="Payment Method"
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  required
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                </Select>
              </FormControl>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBillPopup(false)}>
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
                Generate Bill
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </Sidebar>
  );
};

export default CartPage;