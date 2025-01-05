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
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded mx-auto sm:mx-0"></div>
        </div>
        <ShoppingCart size={32} className="text-yellow-500" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Items in Cart</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{cartItems.length}</p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Sub Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{subTotal.toLocaleString()}</p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total with Tax</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</p>
        </div>
      </div>

      {/* Search Bar and Create Invoice Button */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search cart items..."
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
          onClick={() => setBillPopup(true)}
          disabled={cartItems.length === 0}
          sx={{
            background: 'linear-gradient(to right, #facc15, #ef4444, #ec4899)',
            '&:hover': {
              background: 'linear-gradient(to right, #fbbf24, #dc2626, #db2777)',
            },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Create Invoice
        </Button>
      </div>

      {/* Cart Items - Mobile View */}
      <div className="block sm:hidden mb-6">
        {paginatedData.map((item) => (
          <div 
            key={item._id}
            className="bg-white border border-gray-100 rounded-lg p-4 mb-3"
          >
            <div className="flex items-center mb-3">
              <img 
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-cover rounded-lg mr-3"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{Number(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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
              <IconButton
                onClick={() => dispatch({
                  type: "DELETE_FROM_CART",
                  payload: item,
                })}
                size="small"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Items - Desktop View */}
      <div className="hidden sm:block bg-white rounded-xl shadow-lg overflow-hidden mb-6">
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
                        onClick={() => dispatch({
                          type: "DELETE_FROM_CART",
                          payload: item,
                        })}
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
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-lg gap-3">
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

        {/* Invoice Modal */}
        <Dialog 
          open={billPopup} 
          onClose={() => setBillPopup(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              margin: { xs: 2, sm: 4 },
              width: '100%',
              borderRadius: { xs: '12px', sm: '16px' }
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              m: 0, 
              p: { xs: 2, sm: 3 }, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            Create Invoice
            <IconButton 
              onClick={() => setBillPopup(false)}
              sx={{ 
                width: { xs: '32px', sm: '40px' }, 
                height: { xs: '32px', sm: '40px' } 
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent 
              dividers
              sx={{ 
                p: { xs: 2, sm: 3 },
                '& .MuiTextField-root': { mb: { xs: 1.5, sm: 2 } }
              }}
            >
              <TextField
                fullWidth
                margin="dense"
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                InputProps={{
                  sx: { 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& .MuiInputBase-input': { 
                      p: { xs: '12px', sm: '14px' } 
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Contact Number"
                value={formData.customerNumber}
                onChange={(e) => setFormData({ ...formData, customerNumber: e.target.value })}
                required
                InputProps={{
                  sx: { 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& .MuiInputBase-input': { 
                      p: { xs: '12px', sm: '14px' } 
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { 
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              />
              <FormControl 
                fullWidth 
                margin="dense"
                sx={{ mb: { xs: 2, sm: 3 } }}
              >
                <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Payment Method
                </InputLabel>
                <Select
                  value={formData.paymentMode}
                  label="Payment Method"
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  required
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    '& .MuiSelect-select': { 
                      p: { xs: '12px', sm: '14px' } 
                    }
                  }}
                >
                  <MenuItem value="cash" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Cash</MenuItem>
                  <MenuItem value="card" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Card</MenuItem>
                </Select>
              </FormControl>

              {/* Cart Summary */}
              <div className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg">
                {/* Mobile View Summary */}
                <div className="block sm:hidden space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tax (18%):</span>
                      <span className="font-medium">₹{tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop View Summary */}
                <div className="hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="text-left font-medium py-2">Item</th>
                        <th className="text-right font-medium py-2">Qty</th>
                        <th className="text-right font-medium py-2">Price</th>
                        <th className="text-right font-medium py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-2 text-gray-800">{item.name}</td>
                          <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                          <td className="py-2 text-right text-gray-600">₹{item.price}</td>
                          <td className="py-2 text-right font-medium">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="text-sm">
                        <td colSpan={3} className="py-2 text-right text-gray-600">Subtotal:</td>
                        <td className="py-2 text-right font-medium">₹{subTotal.toLocaleString()}</td>
                      </tr>
                      <tr className="text-sm">
                        <td colSpan={3} className="py-2 text-right text-gray-600">Tax (18%):</td>
                        <td className="py-2 text-right font-medium">₹{tax.toLocaleString()}</td>
                      </tr>
                      <tr className="text-base font-bold border-t">
                        <td colSpan={3} className="py-2 text-right">Total:</td>
                        <td className="py-2 text-right">₹{total.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </DialogContent>

            <DialogActions sx={{ p: { xs: 2, sm: 3 }, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Button 
                onClick={() => setBillPopup(false)}
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #facc15, #ef4444, #ec4899)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #fbbf24, #dc2626, #db2777)',
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 }
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