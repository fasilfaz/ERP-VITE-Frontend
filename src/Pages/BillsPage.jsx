import { useEffect, useState, useRef } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { Eye, Trophy, Search } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal } from "antd";

const BillsPage = () => {
  const componentRef = useRef(null);
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get("http://localhost:5000/api/bills/get-bills");
      setBillsData(data);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
      @media print {
        #invoice-POS {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 2rem;
          background: white;
        }
      }
    `,
  });

  // Filter data based on search term
  const filteredData = billsData.filter(bill =>
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerNumber.includes(searchTerm) ||
    bill._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Sidebar>
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Invoice List</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded mx-auto sm:mx-0"></div>
        </div>
        <Trophy size={32} className="text-yellow-500" />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{billsData.length}</p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{billsData.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Average Bill Value</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{(billsData.reduce((sum, bill) => sum + bill.totalAmount, 0) / billsData.length || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 sm:py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm sm:text-base"
          />
          <Search className="absolute left-4 top-2.5 sm:top-3.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Customer</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="hidden md:table-cell px-6 py-4 text-right text-sm font-semibold text-gray-700">Subtotal</th>
                <th className="hidden lg:table-cell px-6 py-4 text-right text-sm font-semibold text-gray-700">Tax</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">Total</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((bill) => (
                <tr 
                  key={bill._id} 
                  className="group hover:bg-gradient-to-r hover:from-yellow-50 hover:via-red-50 hover:to-pink-50 transition-colors duration-200"
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">{bill._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-medium mr-2 sm:mr-3">
                        {bill.customerName.charAt(0)}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600">{bill.customerName}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className="text-sm text-gray-600">{bill.customerNumber}</span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-right">
                    <span className="text-sm text-gray-600">₹{bill.subTotal.toLocaleString()}</span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-right">
                    <span className="text-sm text-gray-600">₹{bill.tax.toLocaleString()}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">₹{bill.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setPopupModal(true);
                        }}
                        className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white hover:opacity-90 transition-all duration-200"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
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

      {/* Invoice Modal */}
      {popupModal && (
        <Modal
          width="90%"
          style={{ maxWidth: '600px' }}
          title={null}
          visible={popupModal}
          onCancel={() => setPopupModal(false)}
          footer={null}
          className="custom-modal"
        >
          <div className="bg-white p-3 sm:p-6 rounded-xl" ref={componentRef}>
            {/* Invoice Header */}
            <div className="text-center mb-6 sm:mb-8">
              <Trophy size={40} className="text-yellow-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">NEON Sports</h2>
              <p className="text-sm sm:text-base text-gray-600">Contact: 9874563210 | Delhi, India</p>
              <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mx-auto mt-4"></div>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
              <p className="text-gray-700">
                <span className="font-medium">Customer Name:</span> {selectedBill?.customerName}<br />
                <span className="font-medium">Phone No:</span> {selectedBill?.customerNumber}<br />
                <span className="font-medium">Date:</span> {selectedBill?.date?.toString().substring(0, 10)}
              </p>
            </div>

              {/* Items Section - Mobile View */}
              <div className="block sm:hidden mb-4">
                {selectedBill?.cartItems?.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-100 rounded-lg p-3 mb-2"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                      <span className="text-sm text-gray-600">x{item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">₹{item.price} each</span>
                      <span className="font-medium text-gray-800">₹{item.quantity * item.price}</span>
                    </div>
                  </div>
                ))}
                
                {/* Mobile Summary */}
                <div className="border-t-2 border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm text-gray-800">₹{selectedBill?.subTotal}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">GST (18%):</span>
                    <span className="text-sm text-gray-800">₹{selectedBill?.tax}</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-sm text-gray-800">Total:</span>
                    <span className="text-sm text-gray-800">₹{selectedBill?.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Items Table - Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full mb-6">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                      <th className="py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                      <th className="py-3 text-right text-sm font-semibold text-gray-700">Price</th>
                      <th className="py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill?.cartItems?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-800">{item.name}</td>
                        <td className="py-3 text-right text-sm text-gray-600">{item.quantity}</td>
                        <td className="py-3 text-right text-sm text-gray-600">₹{item.price}</td>
                        <td className="py-3 text-right text-sm font-medium text-gray-800">
                          ₹{item.quantity * item.price}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={2}></td>
                      <td className="py-3 text-right text-sm font-medium text-gray-600">Subtotal:</td>
                      <td className="py-3 text-right text-sm text-gray-800">₹{selectedBill?.subTotal}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-3 text-right text-sm font-medium text-gray-600">GST (18%):</td>
                      <td className="py-3 text-right text-sm text-gray-800">₹{selectedBill?.tax}</td>
                    </tr>
                    <tr className="font-medium">
                      <td colSpan={2}></td>
                      <td className="py-3 text-right text-sm text-gray-800">Total Amount:</td>
                      <td className="py-3 text-right text-sm text-gray-800">₹{selectedBill?.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-gray-600">
                <p className="mb-2"><strong>Thank you for your order!</strong></p>
                <p className="mb-1">18% GST applied to the total amount. Please note that this is a non-refundable amount.</p>
                <p>For assistance, contact <span className="text-blue-600">neonsports@example.com</span></p>
              </div>

              {/* Print Button */}
              <div className="flex justify-end mt-4 sm:mt-6">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </Sidebar>
  );
};

export default BillsPage;