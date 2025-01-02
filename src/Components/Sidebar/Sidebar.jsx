import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ListIcon from "@mui/icons-material/List";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { ShoppingCartOutlined } from "@mui/icons-material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Trophy, Bell } from 'lucide-react';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const menuItems = [
    {
      key: "/",
      parent: "HOME",
      route: "/",
      menu_name: "Home",
      icon: <HomeIcon />,
    },
    {
      key: "/bills",
      parent: "BILLS",
      route: "/bills",
      menu_name: "Bills",
      icon: <RequestQuoteIcon />,
    },
    {
      key: "/items",
      parent: "ITEMS",
      route: "/items",
      menu_name: "Items",
      icon: <ListIcon />,
    },
    {
      key: "/customers",
      parent: "CUSTOMERS",
      route: "/customers",
      menu_name: "Customers",
      icon: <PeopleAltIcon />,
    },
  ];

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (location.pathname === '/cart') {
      setActiveSection('CART');
    } else {
      const currentMenuItem = menuItems.find(item => item.route === location.pathname);
      if (currentMenuItem) setActiveSection(currentMenuItem.parent);
    }
  }, [location.pathname]);

  const isCartActive = location.pathname === '/cart';

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 text-white">
          Loading...
        </div>
      )}

      <div
        className={`fixed left-0 top-0 bottom-0 bg-white transition-all duration-300 z-40
          ${isOpen ? 'w-64' : 'w-20'} border-r border-gray-100`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
        
        <div className="h-20 px-6 flex items-center justify-between">
          {isOpen && (
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate("/")}
            >
              <Trophy size={32} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                NEON
              </h1>
            </div>
          )}
          {isOpen && (
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon className="text-gray-400" />
            </button>
          )}
        </div>

        <nav className="py-4 px-3 space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                navigate(item.route);
                setActiveSection(item.parent);
              }}
              className={`flex items-center px-4 py-3.5 cursor-pointer transition-all rounded-xl
                ${location.pathname === item.route 
                  ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-lg shadow-pink-500/20' 
                  : 'hover:bg-gray-50'}`}
            >
              {React.cloneElement(item.icon, { 
                className: `${location.pathname === item.route ? 'text-white' : 'text-gray-500'}`
              })}
              {isOpen && (
                <span className={`ml-4 font-medium ${
                  location.pathname === item.route ? 'text-white' : 'text-gray-700'
                }`}>
                  {item.menu_name}
                </span>
              )}
            </div>
          ))}
          
          <div
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="flex items-center px-4 py-3.5 cursor-pointer text-gray-700 hover:bg-gray-50 rounded-xl mt-8"
          >
            <LogoutIcon className="text-gray-500" />
            {isOpen && <span className="ml-4 font-medium">Logout</span>}
          </div>
        </nav>
      </div>

      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 px-8 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              {activeSection}
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              Welcome back, Admin
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200" />
            
            <div
              className={`relative cursor-pointer p-2 rounded-xl transition-all ${
                isCartActive 
                  ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-lg shadow-pink-500/20' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                navigate("/cart");
                setActiveSection("CART");
              }}
            >
              <ShoppingCartOutlined className={isCartActive ? 'text-white' : 'text-gray-600'} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 
                  text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </div>
            
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 flex items-center justify-center text-white font-medium cursor-pointer">
              A
            </div>
          </div>
        </header>
        <main className="p-8 bg-gray-50 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;