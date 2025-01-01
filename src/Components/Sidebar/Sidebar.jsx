import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./sidebar.module.css"
import HomeIcon from '@mui/icons-material/Home';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ListIcon from '@mui/icons-material/List';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { ShoppingCartOutlined } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const menuItems = [
    {
      key: '/',
      parent: "HOME",
      route: "/",
      menu_name: "Home",
      icon: <HomeIcon />
    },
    {
      key: '/bills',
      parent: "BILLS",
      route: "/bills",
      menu_name: "Bills",
      icon: <RequestQuoteIcon />
    },
    {
      key: '/items',
      parent: "ITEMS",
      route: "/items",
      menu_name: "Items",
      icon: <ListIcon />
    },
    {
      key: '/customers',
      parent: "CUSTOMERS",
      route: "/customers",
      menu_name: "Customers",
      icon: <PersonIcon />
    }
  ];

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.route === location.pathname);
    if (currentMenuItem) {
      setActiveSection(currentMenuItem.parent);
    }
  }, [location.pathname]);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleMenuClick = (route, parent) => {
    console.log('Navigating to:', route);
    navigate(route);
    setActiveSection(parent);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className={styles.layout}>
      {loading && <div className={styles.spinner}>Loading...</div>}
      
      <div 
        className={`${isOpen ? styles.sidebarOpen : styles.sidebar}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles["sidebar-header"]}>
        {isOpen && (
    <div onClick={() => navigate("/")}>
      <h1 className={styles.logo}>NEON Sports</h1>
    </div>
  )}
  {isOpen && (
    <button
      className={styles["sidebar-close-btn"]}
      onClick={() => setIsOpen(false)}
    >
      <CloseIcon />
    </button>
  )}
        </div>

        <div className={styles["sidebar-content"]}>
          <nav className={styles["sidebar-nav"]}>
            {menuItems.map((item) => (
              <div
                key={item.key}
                className={styles["menu-section"]}
                onClick={() => handleMenuClick(item.route, item.parent)}
              >
                <div
                  className={`
                    ${isOpen ? styles["sidebar-menu-title-icon-open"] : styles["sidebar-menu-title-icon"]}
                    ${location.pathname === item.route ? styles.active : ""}
                  `}
                >
                  {item.icon}
                  {isOpen && <p>{item.menu_name}</p>}
                </div>
              </div>
            ))}

            <div 
              className={styles["menu-section"]}
              onClick={handleLogout}
            >
              <div className={styles["sidebar-menu-title-icon"]}>
                <LogoutIcon />
                {isOpen && <p>Logout</p>}
              </div>
            </div>
          </nav>
        </div>

        
      </div>

      <div className={styles.content}>
        <div className={styles["content-header"]}>
          <button 
            className={styles["menu-trigger"]}
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon />
          </button>
          <div 
          className={styles["cart-section"]}
          onClick={() => navigate("/cart")}
        >
          <ShoppingCartOutlined />
          {cartItems.length > 0 && (
            <span className={styles["cart-badge"]}>{cartItems.length}</span>
          )}
        </div>
        </div>
        <div className={styles["content-body"]}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar