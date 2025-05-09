import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="pt-16">
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
          </Route>
        </Routes>
      </div>
      <BottomHeader />
    </BrowserRouter>
  );
}

export default App;
