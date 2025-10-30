import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMessageSquare,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiPackage,
  FiLogIn,
  FiMapPin,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../Redux/user/userSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      dispatch(signoutUserStart());
      await axios.post("/api/auth/logout"); // Adjust to your API
      dispatch(signoutUserSuccess());
      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      dispatch(
        signoutUserFailure(error.response?.data?.message || "Logout failed")
      );
      console.error("Logout failed:", error);
    }
  };

  const menuItems = currentUser
    ? currentUser.role === "admin"
      ? [
          {
            icon: <FiPackage />,
            text: "Sales",
            color: "text-yellow-400",
            link: "/admin/sales",
          },
          {
            icon: <FiShoppingCart />,
            text: "List New Item",
            color: "text-green-400",
            link: "/admin/list-new-product",
          },
          {
            icon: <FiSettings />,
            text: "Update Item",
            color: "text-blue-400",
            link: "/admin/update-product",
          },
          {
            icon: <FiPackage />,
            text: "Orders",
            color: "text-indigo-400",
            link: "/admin/orders",
          },
          {
            icon: <FiSettings />,
            text: "Settings",
            color: "text-teal-400",
            link: "/settings",
          },
          {
            icon: <FiHelpCircle />,
            text: "Help Center",
            color: "text-blue-400",
            link: "/help-center",
          },
          {
            icon: <FiLogOut />,
            text: "Logout",
            color: "text-gray-400",
            onClick: handleLogoutClick,
          },
        ]
      : [
          {
            icon: <FiUser />,
            text: "Profile",
            color: "text-pink-400",
            link: "/profile",
          },
          {
            icon: <FiShoppingCart />,
            text: "Cart",
            color: "text-purple-400",
            link: "/cart",
          },
          {
            icon: <FiPackage />,
            text: "Orders",
            color: "text-indigo-400",
            link: "/order",
          },
          {
            icon: <FiHeart />,
            text: "Wishlist",
            color: "text-red-400",
            link: "/wishlist",
          },
          {
            icon: <FiMapPin />,
            text: "Address",
            color: "text-blue-400",
            link: "/address",
          },
          {
            icon: <FiHelpCircle />,
            text: "Help Center",
            color: "text-blue-400",
            link: "/help-center",
          },
          {
            icon: <FiSettings />,
            text: "Settings",
            color: "text-teal-400",
            link: "/settings",
          },
          {
            icon: <FiLogOut />,
            text: "Logout",
            color: "text-gray-400",
            onClick: handleLogoutClick,
          },
        ]
    : [
        {
          icon: <FiLogIn />,
          text: "Login",
          color: "text-green-400",
          link: "/login",
        },
      ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
        <div className="w-full mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="text-white p-2 rounded-full hover:bg-gray-800 lg:hidden"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Desktop Navigation - Left Side */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {currentUser && currentUser.role !== "admin" && (
              <>
                <Link
                  to="/cart"
                  className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <FiShoppingCart size={20} />
                </Link>
                <Link
                  to="/wishlist"
                  className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <FiHeart size={20} />
                </Link>
              </>
            )}
          </div>

          {/* Logo */}
          <div className="flex-1 text-center px-2 lg:flex-none">
            <Link to="/">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="rotate-text bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  STYLOO
                </span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              to="/chatpage"
              className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FiMessageSquare size={20} />
            </Link>

            {/* Desktop User Menu */}
            <div className="relative menu-container">
              <button className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                <FiUser size={20} />
              </button>

              {/* Desktop Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 opacity-0 invisible transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                <nav>
                  <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        {item.link ? (
                          <Link
                            to={item.link}
                            className={`flex items-center px-4 py-3 hover:bg-gray-800 ${item.color} transition-colors`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.text}</span>
                          </Link>
                        ) : (
                          <button
                            onClick={item.onClick}
                            className={`flex w-full items-center px-4 py-3 hover:bg-gray-800 ${item.color} transition-colors text-left`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.text}</span>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t border-gray-800 text-sm text-gray-400 px-4 py-2 mt-2">
                  STYLOO v1.0.0
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Chat Button */}
          <Link
            to="/chatpage"
            className="text-white p-2 rounded-full hover:bg-gray-800 lg:hidden"
          >
            <FiMessageSquare size={24} />
          </Link>

          {/* Mobile Sidebar Menu */}
          <div
            className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 shadow-2xl z-40 transition-transform menu-container border-r border-gray-800 lg:hidden ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              <nav className="flex-1">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.link ? (
                        <Link
                          to={item.link}
                          className={`flex items-center p-3 rounded-lg hover:bg-gray-800 ${item.color}`}
                          onClick={toggleMenu}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="font-medium">{item.text}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={item.onClick}
                          className={`flex w-full items-center p-3 rounded-lg hover:bg-gray-800 ${item.color}`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="font-medium">{item.text}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto pt-4 border-t border-gray-800 text-sm text-gray-400 px-3 py-2">
                STYLOO v1.0.0
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleMenu}
            />
          )}
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-white text-xl font-bold mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
