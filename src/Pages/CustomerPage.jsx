import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { Users, Search } from "lucide-react";
import axios from "axios";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
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

  // Get unique customers by filtering duplicate customer names
  const uniqueCustomers = Array.from(
    new Set(billsData.map(bill => bill.customerName))
  ).length;

  // Calculate total spending per customer
  const totalSpending = billsData.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const averageSpending = totalSpending / (uniqueCustomers || 1);

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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer List</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded"></div>
          </div>
          <Users size={40} className="text-yellow-500" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{uniqueCustomers}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalSpending.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Average Spending</p>
            <p className="text-2xl font-bold text-gray-900">₹{averageSpending.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact No</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Orders</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((bill) => (
                  <tr 
                    key={bill._id}
                    className="group hover:bg-gradient-to-r hover:from-yellow-50 hover:via-red-50 hover:to-pink-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium">
                        {bill._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center text-white font-medium mr-3">
                          {bill.customerName.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">{bill.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{bill.customerNumber}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-gray-600">
                        {billsData.filter(b => b.customerName === bill.customerName).length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{billsData
                          .filter(b => b.customerName === bill.customerName)
                          .reduce((sum, b) => sum + b.totalAmount, 0)
                          .toLocaleString()}
                      </span>
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
      </div>
    </Sidebar>
  );
};

export default CustomerPage;