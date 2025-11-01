import { useEffect, useState } from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiCreditCard,
  FiShield,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../Redux/user/userSlice";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile-user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserName(res.data.name || "No Name");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setUserName("Error");
      }
    };

    fetchUserProfile();
  }, []);

  const confirmLogout = async () => {
    try {
      dispatch(signoutUserStart());
      await axios.post("/api/auth/logout");
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

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 xl:p-8 max-w-md mx-auto lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
      {/* Header */}
      <header className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm lg:text-base">
          Manage your account preferences
        </p>
      </header>

      {/* Profile */}
      <section className="mb-6 lg:mb-8">
        <div className="flex items-center mb-4 lg:mb-5">
          <div className="w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full bg-purple-600 flex items-center justify-center mr-3 lg:mr-4">
            <span className="text-xl lg:text-2xl xl:text-3xl">
              {userName?.charAt(0) || "U"}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-base lg:text-lg xl:text-xl">
              {userName}
            </h2>
            <p className="text-gray-400 text-sm lg:text-base">Premium Member</p>
          </div>
        </div>
        <Link to="/edit-profile">
          <button className="w-full py-2 lg:py-3 border border-gray-700 rounded-lg text-purple-400 font-medium text-sm lg:text-base">
            Edit Profile
          </button>
        </Link>
      </section>

      {/* Settings Options */}
      <div className="space-y-4 lg:space-y-5 xl:space-y-6">
        {/* Account Section */}
        <div className="bg-gray-900 rounded-xl p-4 lg:p-5 xl:p-6">
          <h3 className="font-semibold mb-3 lg:mb-4 text-gray-300 text-base lg:text-lg">
            Account
          </h3>
          <ul className="space-y-3 lg:space-y-4">
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiUser className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">
                  Personal Information
                </span>
              </div>
              <span className="text-gray-400 text-lg lg:text-xl">&gt;</span>
            </li>
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiLock className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">Password</span>
              </div>
              <span className="text-gray-400 text-lg lg:text-xl">&gt;</span>
            </li>
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiCreditCard className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">Payment Methods</span>
              </div>
              <span className="text-gray-400 text-lg lg:text-xl">&gt;</span>
            </li>
          </ul>
        </div>

        {/* Preferences */}
        <div className="bg-gray-900 rounded-xl p-4 lg:p-5 xl:p-6">
          <h3 className="font-semibold mb-3 lg:mb-4 text-gray-300 text-base lg:text-lg">
            Preferences
          </h3>
          <ul className="space-y-3 lg:space-y-4">
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiBell className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notificationsEnabled}
                  onChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                />
                <div className="w-11 h-6 lg:w-12 lg:h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] lg:after:top-[3px] lg:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <div className="w-5 h-5 lg:w-6 lg:h-6 mr-3 lg:mr-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-black"></div>
                </div>
                <span className="text-sm lg:text-base">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 lg:w-12 lg:h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] lg:after:top-[3px] lg:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
          </ul>
        </div>

        {/* Security */}
        <div className="bg-gray-900 rounded-xl p-4 lg:p-5 xl:p-6">
          <h3 className="font-semibold mb-3 lg:mb-4 text-gray-300 text-base lg:text-lg">
            Security
          </h3>
          <ul className="space-y-3 lg:space-y-4">
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiShield className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">
                  Two-Factor Authentication
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                <div className="w-11 h-6 lg:w-12 lg:h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] lg:after:top-[3px] lg:after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
            <li className="flex items-center justify-between py-2 lg:py-3">
              <div className="flex items-center">
                <FiHelpCircle className="mr-3 lg:mr-4 text-gray-400 text-lg lg:text-xl" />
                <span className="text-sm lg:text-base">Privacy Policy</span>
              </div>
              <span className="text-gray-400 text-lg lg:text-xl">&gt;</span>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center py-3 lg:py-4 bg-gray-900 rounded-xl text-red-400 font-medium text-sm lg:text-base"
        >
          <FiLogOut className="mr-2 text-sm lg:text-base" />
          Log Out
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 lg:p-8 w-full max-w-sm lg:max-w-md text-center">
            <h2 className="text-white text-xl lg:text-2xl font-bold mb-4 lg:mb-5">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-6 lg:mb-7 text-sm lg:text-base">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4 lg:space-x-5">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 lg:px-5 py-2 lg:py-2.5 rounded bg-gray-700 text-white hover:bg-gray-600 transition text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 lg:px-5 py-2 lg:py-2.5 rounded bg-red-600 text-white hover:bg-red-500 transition text-sm lg:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
