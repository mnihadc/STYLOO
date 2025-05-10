import React from "react";
import {
  FiHome,
  FiPlusSquare,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiBarChart2, // for Sales
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomHeader = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-lg z-50 sm:hidden">
      <div className="flex justify-between items-center py-2 px-4 w-full max-w-full">
        {/* Posts */}
        <Link to="/post">
          <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
            <FiHome className="w-5 h-5" />
            <span className="text-[10px] mt-1">Posts</span>
          </button>
        </Link>

        {/* Reels */}
        <Link to="/reel">
          <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
            <FiPlusSquare className="w-5 h-5" />
            <span className="text-[10px] mt-1">Reels</span>
          </button>
        </Link>

        {/* Shop */}
        <Link to="/">
          <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
            <FiShoppingBag className="w-5 h-5" />
            <span className="text-[10px] mt-1">Shop</span>
          </button>
        </Link>

        {/* Conditional: Wishlist for Users / Sales for Admin */}
        {currentUser?.role === "admin" ? (
          <Link to="/sales">
            <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
              <FiBarChart2 className="w-5 h-5" />
              <span className="text-[10px] mt-1">Sales</span>
            </button>
          </Link>
        ) : (
          <Link to="/wishlist">
            <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
              <FiHeart className="w-5 h-5" />
              <span className="text-[10px] mt-1">Wishlist</span>
            </button>
          </Link>
        )}

        {/* Profile */}
        <Link to="/profile">
          <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
            <FiUser className="w-5 h-5" />
            <span className="text-[10px] mt-1">Profile</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BottomHeader;
