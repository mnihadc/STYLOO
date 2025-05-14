import { useState } from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiCreditCard,
  FiShield,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </header>

      {/* Profile Section */}
      <section className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-3">
            <span className="text-xl">JD</span>
          </div>
          <div>
            <h2 className="font-semibold">John Doe</h2>
            <p className="text-gray-400 text-sm">Premium Member</p>
          </div>
        </div>
        <Link to="/edit-profile">
          <button className="w-full py-2 border border-gray-700 rounded-lg text-purple-400 font-medium">
            Edit Profile
          </button>
        </Link>
      </section>

      {/* Settings Options */}
      <div className="space-y-4">
        {/* Account Settings */}
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-gray-300">Account</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiUser className="mr-3 text-gray-400" />
                <span>Personal Information</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </li>
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiLock className="mr-3 text-gray-400" />
                <span>Password</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </li>
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiCreditCard className="mr-3 text-gray-400" />
                <span>Payment Methods</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </li>
          </ul>
        </div>

        {/* Preferences */}
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-gray-300">Preferences</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiBell className="mr-3 text-gray-400" />
                <span>Notifications</span>
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
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 rounded-full bg-gray-400 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                </div>
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
          </ul>
        </div>

        {/* Security */}
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-gray-300">Security</h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiShield className="mr-3 text-gray-400" />
                <span>Two-Factor Authentication</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </li>
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiHelpCircle className="mr-3 text-gray-400" />
                <span>Privacy Policy</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center py-3 bg-gray-900 rounded-xl text-red-400 font-medium">
          <FiLogOut className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
}
