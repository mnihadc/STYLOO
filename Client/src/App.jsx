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
function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="pt-16">
        <Routes>
          <Route path="/post" element={<Post />} />
          <Route path="/reel" element={<ReelsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user-search" element={<UserSearch />} />
          <Route path="/product-view" element={<ProductView />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <BottomHeader />
    </BrowserRouter>
  );
}

export default App;
