import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useDispatch } from "react-redux";
import { Users, Search } from "lucide-react";
import axios from "axios";
import { GET_ALL_BILLS_API } from "../Utils/Contants/Api";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getAllBills = async () => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const { data } = await axios.get(GET_ALL_BILLS_API);
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
      <div className="p-2 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Customer List</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded mx-auto sm:mx-0"></div>
          </div>
          <Users size={32} className="text-yellow-500" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Customers</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{uniqueCustomers}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalSpending.toLocaleString()}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Average Spending</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{averageSpending.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
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
                  <th className="hidden md:table-cell px-6 py-4 text-right text-sm font-semibold text-gray-700">Orders</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((bill) => (
                  <tr 
                    key={bill._id}
                    className="group hover:bg-gradient-to-r hover:from-yellow-50 hover:via-red-50 hover:to-pink-50 transition-colors duration-200"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        {bill._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center">
                        <span className="text-xs sm:text-sm text-gray-600">{bill.customerName}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className="text-sm text-gray-600">{bill.customerNumber}</span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-right">
                      <span className="text-sm text-gray-600">
                        {billsData.filter(b => b.customerName === bill.customerName).length}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
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
      </div>
    </Sidebar>
  );
};

export default CustomerPage;