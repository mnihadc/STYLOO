import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FiPackage, // Order icon
} from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside or pressing Escape
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    {
      icon: <FiUser size={20} />,
      text: "Profile",
      color: "text-pink-400",
      link: "/profile",
    },
    {
      icon: <FiShoppingCart size={20} />,
      text: "Cart",
      color: "text-purple-400",
      link: "/cart",
    },
    {
      icon: <FiPackage size={20} />,
      text: "Orders",
      color: "text-indigo-400",
      link: "/order",
    },
    {
      icon: <FiHeart size={20} />,
      text: "Wishlist",
      color: "text-red-400",
      link: "/wishlist",
    },
    {
      icon: <FiHelpCircle size={20} />,
      text: "Help Center",
      color: "text-blue-400",
      link: "/help-center",
    },
    {
      icon: <FiSettings size={20} />,
      text: "Settings",
      color: "text-teal-400",
      link: "/settings",
    },
    {
      icon: <FiLogOut size={20} />,
      text: "Logout",
      color: "text-gray-400",
      link: "/logout",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-gray-800">
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        {/* Menu button */}
        <button
          onClick={toggleMenu}
          className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Center logo - responsive sizing */}
        <div className="flex-1 text-center px-2">
          <Link to="/shop">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="rotate-text bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                STYLOO
              </span>
              <style jsx>{`
                @keyframes flipInOut {
                  0% {
                    transform: rotateY(0deg);
                  }
                  83.33% {
                    transform: rotateY(0deg); /* Stay static for 10 seconds */
                  }
                  91.66% {
                    transform: rotateY(
                      180deg
                    ); /* Rotate 180 degrees in 2 seconds */
                  }
                  100% {
                    transform: rotateY(
                      0deg
                    ); /* Rotate back to the original position in 2 seconds */
                  }
                }

                .rotate-text {
                  display: inline-block;
                  animation: flipInOut 12s linear infinite;
                  transform-origin: center;
                  backface-visibility: hidden;
                }
              `}</style>
            </h1>
          </Link>
        </div>

        {/* Chat icon */}
        <Link
          to="/chatpage"
          className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Chat"
        >
          <FiMessageSquare size={24} />
        </Link>

        {/* Dropdown menu */}
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 shadow-2xl z-40 overflow-y-auto 
            transition-all duration-300 ease-in-out transform menu-container border-r border-gray-800
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-5 h-full flex flex-col">
            {/* Menu header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={toggleMenu}
                className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
                aria-label="Close Menu"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={`flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200
        ${item.color} hover:text-white`}
                      onClick={toggleMenu}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-800">
              <div className="text-sm text-gray-400 px-3 py-2">
                STYLOO v1.0.0
              </div>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
