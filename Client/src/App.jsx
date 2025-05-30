import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { initSocket } from "./lib/socket";
import Header from "./Components/Header";
import BottomHeader from "./Components/BottomHeader";
import Post from "./Pages/Post";
import ReelsPage from "./Pages/Reel";
import ShopPage from "./Pages/Shop";
import WishlistPage from "./Pages/WishList";
import ChatPage from "./Pages/ChatPage";
import Profile from "./Pages/Profile";
import CartPage from "./Pages/Cart";
import OrderPage from "./Pages/Order";
import HelpCenter from "./Pages/HelpCenter";
import SettingsPage from "./Pages/Settings";
import UserSearch from "./Components/SearchUser";
import ProductView from "./Components/ProductView";
import SignupPage from "./Pages/SignUp";
import LoginPage from "./Pages/Login";
import { Toaster } from "react-hot-toast";
import UserRoute from "./Components/UserRoute";
import AdminRoute from "./Components/AdminRoute";
import NewProductPage from "./Admin/ListProduct";
import ProductPage from "./Admin/UpdateProduct";
import ViewProductPage from "./Admin/ViewProduct";
import OrderSummaryPage from "./Pages/OrderSummery";
import AddressPage from "./Pages/Address";
import AddressCreatePage from "./Pages/CreateAddress";
import OrderSuccessPage from "./Components/OrderSuccessPage";
import EditProfilePage from "./Components/EditProfile";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser); // Redux example

  useEffect(() => {
    if (currentUser?._id) {
      initSocket(currentUser._id);
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Header />

      <div className="pt-16 pb-16">
        <Toaster
          position="top-right"
          toastOptions={{
            // Global styles for all toasts
            style: {
              background: "#1f2937", // Tailwind's gray-800
              color: "#fff",
              border: "1px solid #4b5563", // gray-600
            },
            // Success-specific options
            success: {
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #10b981", // emerald border for success
              },
              iconTheme: {
                primary: "#10b981", // emerald
                secondary: "#fff",
              },
            },
            // Error-specific options
            error: {
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #ef4444", // red border for error
              },
              iconTheme: {
                primary: "#ef4444", // red
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          <Route path="/reel" element={<ReelsPage />} />
          <Route path="/" element={<ShopPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user-search" element={<UserSearch />} />
          <Route path="/product-view" element={<ProductView />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<UserRoute />}>
            <Route path="/post" element={<Post />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/chatpage" element={<ChatPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/address" element={<AddressPage />} />
            <Route path="/create-address" element={<AddressCreatePage />} />
            <Route path="/order-summery" element={<OrderSummaryPage />} />
            <Route path="/place-order-success" element={<OrderSuccessPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/list-new-product"
              element={<NewProductPage />}
            />
            <Route path="/admin/update-product" element={<ProductPage />} />
            <Route path="/admin/view-prdouct" element={<ViewProductPage />} />
          </Route>
        </Routes>
      </div>
      <BottomHeader />
    </BrowserRouter>
  );
}

export default App;
