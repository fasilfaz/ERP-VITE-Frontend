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
  // ... previous state and effects remain the same ...
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderNavigationItems = () => (
    <>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.route;
        
        return (
          <div
            key={item.key}
            onClick={() => {
              navigate(item.route);
              setActiveSection(item.parent);
            }}
            className={`
              ${isMobile 
                ? 'flex-1 flex flex-col items-center justify-center gap-1 py-3 relative' 
                : 'flex items-center px-4 py-3.5 relative'} 
              cursor-pointer transition-all group
              ${!isMobile && 'rounded-xl'}
              ${isActive 
                ? isMobile 
                  ? '' 
                  : 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-lg shadow-pink-500/20' 
                : 'hover:bg-gray-50'}
            `}
          >
            {/* Mobile Active Indicator */}
            {isMobile && isActive && (
              <>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-pink-500/10 rounded-xl" />
              </>
            )}

            {React.cloneElement(item.icon, { 
              className: `${isActive 
                ? isMobile 
                  ? 'text-pink-500' 
                  : 'text-white' 
                : 'text-gray-500 group-hover:scale-110 transition-transform'}`
            })}
            
            {(isOpen || isMobile) && (
              <span className={`
                ${isMobile ? 'text-xs font-medium' : 'ml-4 font-medium'}
                ${isActive 
                  ? isMobile 
                    ? 'text-pink-500' 
                    : 'text-white' 
                  : 'text-gray-700'}
                transition-colors
              `}>
                {item.menu_name}
              </span>
            )}

            {/* Hover Gradient Border */}
            {!isMobile && !isActive && (
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gradient-to-r group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        );
      })}
      
      {!isMobile && (
        <div
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="flex items-center px-4 py-3.5 cursor-pointer text-gray-700 hover:bg-gray-50 rounded-xl mt-8 group relative"
        >
          <LogoutIcon className="text-gray-500 group-hover:scale-110 transition-transform" />
          {isOpen && <span className="ml-4 font-medium">Logout</span>}
          
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-gradient-to-r group-hover:from-yellow-400 group-hover:via-red-500 group-hover:to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen w-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 text-white">
          Loading...
        </div>
      )}

      {!isMobile && (
        <div
          className={`fixed left-0 top-0 bottom-0 bg-white transition-all duration-300 z-40
            ${isOpen ? 'w-64' : 'w-20'} border-r border-gray-100`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
          
          <div className="h-20 px-6 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => navigate("/")}
            >
              <Trophy size={32} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              {isOpen && (
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  NEON
                </h1>
              )}
            </div>
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
            {renderNavigationItems()}
          </nav>
        </div>
      )}

      <div className={`flex-1 ${!isMobile && (isOpen ? 'ml-64' : 'ml-20')}`}>
        <header className="h-20 px-8 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {isMobile && (
              <div className="flex items-center gap-3 group">
                <Trophy size={32} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  NEON
                </h1>
              </div>
            )}
            {!isMobile && (
              <div className="text-xl font-semibold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                {activeSection}
              </div>
            )}
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            <div className="hidden sm:block text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              Welcome back, Admin
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative group">
              <Bell size={20} className="text-gray-600 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="hidden sm:block h-8 w-px bg-gray-200" />
            
            <div
              className={`relative cursor-pointer p-2 rounded-xl transition-all group ${
                isCartActive 
                  ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 shadow-lg shadow-pink-500/20' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                navigate("/cart");
                setActiveSection("CART");
              }}
            >
              <ShoppingCartOutlined className={`${isCartActive ? 'text-white' : 'text-gray-600'} group-hover:scale-110 transition-transform`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 
                  text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </div>
            
            <div className="hidden sm:flex h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 items-center justify-center text-white font-medium cursor-pointer group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-shadow">
              A
            </div>
          </div>
        </header>

        <main className="p-8 bg-gray-50 min-h-[calc(100vh-5rem)] pb-24">
          {children}
        </main>

        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-4 z-40 shadow-lg rounded-t-xl">
            {renderNavigationItems()}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Sidebar;