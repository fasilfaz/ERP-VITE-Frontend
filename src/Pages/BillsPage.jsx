import { useEffect, useState, useRef } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { Eye } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal } from "antd";
import { Trophy } from 'lucide-react';

const BillsPage = () => {
  const componentRef = useRef(null);
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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

  return (
    <Sidebar>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice List</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded"></div>
          </div>
          <Trophy size={40} className="text-yellow-500" />
        </div>

        {/* Custom Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact No</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Subtotal</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Tax</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Amount</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {billsData.map((bill, index) => (
                  <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{bill._id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bill.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{bill.customerNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">₹{bill.subTotal}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">₹{bill.tax}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">₹{bill.totalAmount}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setPopupModal(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Modal */}
        {popupModal && (
          <Modal
            width={600}
            title={null}
            visible={popupModal}
            onCancel={() => setPopupModal(false)}
            footer={null}
            className="custom-modal"
          >
            <div className="bg-white p-6 rounded-xl" ref={componentRef}>
              {/* Invoice Header */}
              <div className="text-center mb-8">
                <Trophy size={48} className="text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">NEON Sports</h2>
                <p className="text-gray-600">Contact: 9874563210 | Delhi, India</p>
                <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mx-auto mt-4"></div>
              </div>

              {/* Customer Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <span className="font-medium">Customer Name:</span> {selectedBill?.customerName}<br />
                  <span className="font-medium">Phone No:</span> {selectedBill?.customerNumber}<br />
                  <span className="font-medium">Date:</span> {selectedBill?.date?.toString().substring(0, 10)}
                </p>
              </div>

              {/* Items Table */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-left">Item</th>
                    <th className="py-3 text-right">Qty</th>
                    <th className="py-3 text-right">Price</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill?.cartItems?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">₹{item.price}</td>
                      <td className="py-3 text-right">₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={2}></td>
                    <td className="py-3 text-right font-medium">GST (18%)</td>
                    <td className="py-3 text-right">₹{selectedBill?.tax}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={2}></td>
                    <td className="py-3 text-right">Grand Total</td>
                    <td className="py-3 text-right">₹{selectedBill?.totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Note */}
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p className="mb-2"><strong>Thank you for your order!</strong></p>
                <p>18% GST applied to the total amount. Please note that this is a non-refundable amount.</p>
                <p>For assistance, contact <span className="text-blue-600">neonsports@example.com</span></p>
              </div>

              {/* Print Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
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