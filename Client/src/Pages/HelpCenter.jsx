import React, { useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ categories
  const categories = [
    {
      id: "ecommerce",
      title: "E-Commerce Help",
      icon: <FiShoppingBag className="mr-2" />,
      questions: [
        {
          question: "How do I place an order?",
          answer:
            "To place an order: 1) Browse products 2) Add to cart 3) Proceed to checkout 4) Enter shipping details 5) Select payment method 6) Confirm your order.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards, UPI, Net Banking, and popular digital wallets like Paytm and PhonePe.",
        },
        {
          question: "How can I track my order?",
          answer:
            'Go to "My Orders" in your account to view real-time tracking information. You\'ll also receive SMS/email updates.',
        },
      ],
    },
    {
      id: "social",
      title: "Social Features Help",
      icon: <FiUsers className="mr-2" />,
      questions: [
        {
          question: "How do I create a post?",
          answer:
            'Tap the "+" icon in the app or click "Create Post" on web. Add photos/videos, write a caption, and choose your audience before posting.',
        },
        {
          question: "Can I sell products through my posts?",
          answer:
            "Yes! Verified sellers can tag products in posts. Followers can shop directly from your content.",
        },
        {
          question: "How do I manage my followers?",
          answer:
            "Go to your profile > Followers. You can remove followers or restrict accounts from here.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Security",
      icon: <FiUsers className="mr-2" />,
      questions: [
        {
          question: "How do I reset my password?",
          answer:
            "Go to Login > Forgot Password. Enter your email to receive a reset link. The link expires in 24 hours.",
        },
        {
          question: "How do I enable two-factor authentication?",
          answer:
            "Go to Settings > Security > Two-Factor Auth. Choose between SMS or authenticator app verification.",
        },
        {
          question: "Can I merge my social and shopping accounts?",
          answer:
            "Yes! Go to Settings > Account > Merge Accounts to combine your profiles.",
        },
      ],
    },
    {
      id: "returns",
      title: "Returns & Refunds",
      icon: <FiShoppingBag className="mr-2" />,
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "Most items can be returned within 15 days of delivery. Some products like perishables are final sale.",
        },
        {
          question: "How long do refunds take?",
          answer:
            "Refunds are processed within 3-5 business days after we receive your return. Bank processing may take additional 2-3 days.",
        },
      ],
    },
  ];

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Help Center</h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full bg-gray-900 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">
              No results found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-blue-500 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Popular Topics */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Popular Topics</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center">
                  <FiShoppingBag className="mr-2" />
                  <span>Order Issues</span>
                </button>
                <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center">
                  <FiMessageSquare className="mr-2" />
                  <span>Posting Help</span>
                </button>
                <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center">
                  <FiUsers className="mr-2" />
                  <span>Account Security</span>
                </button>
                <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center">
                  <FiMail className="mr-2" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>

            {/* FAQ Sections */}
            <h2 className="text-lg font-bold mb-4">Help Articles</h2>
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-4 flex justify-between items-center hover:bg-gray-800"
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <span>{category.title}</span>
                    </div>
                    {activeCategory === category.id ? (
                      <FiChevronDown className="text-gray-400" />
                    ) : (
                      <FiChevronRight className="text-gray-400" />
                    )}
                  </button>

                  {activeCategory === category.id && (
                    <div className="px-4 pb-4 space-y-4">
                      {category.questions.map((item, index) => (
                        <div
                          key={index}
                          className="pt-3 border-t border-gray-800 first:border-t-0"
                        >
                          <h3 className="font-medium">{item.question}</h3>
                          <p className="text-gray-400 mt-1 text-sm">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contact Support */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Need more help?</h3>
            <p className="text-sm text-gray-400">We're available 24/7</p>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FiMail />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FiPhone />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
              <FiMessageSquare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
