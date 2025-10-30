import React from "react";
import {
  FiHome,
  FiPlusSquare,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiBarChart2, // for Sales
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomHeader = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {/* Mobile Bottom Navigation */}
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
            <Link to="/cart">
              <button className="flex flex-col items-center justify-center p-1.5 rounded-full hover:bg-gray-800 transition-all">
                <FiShoppingCart className="w-5 h-5" />
                <span className="text-[10px] mt-1">Cart</span>
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

      {/* Desktop Side Navigation */}
      <div className="hidden sm:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black text-white shadow-lg z-40 w-20 lg:w-24 xl:w-28 flex-col items-center py-8 space-y-8 border-r border-gray-800">
        {/* Posts */}
        <Link to="/post" className="group">
          <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
            <FiHome className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs lg:text-sm mt-2 font-medium">Posts</span>
          </button>
        </Link>

        {/* Reels */}
        <Link to="/reel" className="group">
          <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
            <FiPlusSquare className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs lg:text-sm mt-2 font-medium">Reels</span>
          </button>
        </Link>

        {/* Shop */}
        <Link to="/" className="group">
          <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
            <FiShoppingBag className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs lg:text-sm mt-2 font-medium">Shop</span>
          </button>
        </Link>

        {/* Conditional: Wishlist for Users / Sales for Admin */}
        {currentUser?.role === "admin" ? (
          <Link to="/sales" className="group">
            <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
              <FiBarChart2 className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs lg:text-sm mt-2 font-medium">Sales</span>
            </button>
          </Link>
        ) : (
          <Link to="/cart" className="group">
            <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
              <FiShoppingCart className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs lg:text-sm mt-2 font-medium">Cart</span>
            </button>
          </Link>
        )}

        {/* Profile */}
        <Link to="/profile" className="group">
          <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all w-full">
            <FiUser className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs lg:text-sm mt-2 font-medium">Profile</span>
          </button>
        </Link>
      </div>
    </>
  );
};

export default BottomHeader;
