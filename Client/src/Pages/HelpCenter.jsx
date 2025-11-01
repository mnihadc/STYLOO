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
    <div className="bg-black text-white min-h-screen pb-20 lg:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black p-4 border-b border-gray-800 lg:px-8 lg:py-6">
        <h1 className="text-xl font-bold lg:text-3xl">Help Center</h1>
      </div>

      {/* Main Content Container */}
      <div className="lg:flex lg:max-w-7xl lg:mx-auto lg:gap-8 lg:p-8">
        {/* Left Side - Search & Popular Topics */}
        <div className="lg:w-1/3 lg:max-w-md">
          {/* Search */}
          <div className="p-4 lg:p-0 lg:mb-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 lg:w-5 lg:h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full bg-gray-900 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:py-3 lg:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Popular Topics */}
          <div className="p-4 lg:p-0 lg:mb-8">
            <h2 className="text-lg font-bold mb-4 lg:text-xl">
              Popular Topics
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
              <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center lg:p-4 lg:text-lg">
                <FiShoppingBag className="mr-2 lg:w-5 lg:h-5" />
                <span>Order Issues</span>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center lg:p-4 lg:text-lg">
                <FiMessageSquare className="mr-2 lg:w-5 lg:h-5" />
                <span>Posting Help</span>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center lg:p-4 lg:text-lg">
                <FiUsers className="mr-2 lg:w-5 lg:h-5" />
                <span>Account Security</span>
              </button>
              <button className="bg-gray-900 hover:bg-gray-800 p-3 rounded-lg flex items-center lg:p-4 lg:text-lg">
                <FiMail className="mr-2 lg:w-5 lg:h-5" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - FAQ Sections */}
        <div className="lg:flex-1">
          <div className="p-4 lg:p-0">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-10 lg:py-16">
                <p className="text-gray-400 lg:text-lg">
                  No results found for "{searchQuery}"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-blue-500 hover:underline lg:text-lg"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 lg:text-xl lg:mb-6">
                  Help Articles
                </h2>
                <div className="space-y-3 lg:space-y-4">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-900 rounded-lg overflow-hidden lg:rounded-xl"
                    >
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full p-4 flex justify-between items-center hover:bg-gray-800 lg:p-6"
                      >
                        <div className="flex items-center lg:text-lg">
                          {category.icon}
                          <span>{category.title}</span>
                        </div>
                        {activeCategory === category.id ? (
                          <FiChevronDown className="text-gray-400 lg:w-5 lg:h-5" />
                        ) : (
                          <FiChevronRight className="text-gray-400 lg:w-5 lg:h-5" />
                        )}
                      </button>

                      {activeCategory === category.id && (
                        <div className="px-4 pb-4 space-y-4 lg:px-6 lg:pb-6 lg:space-y-6">
                          {category.questions.map((item, index) => (
                            <div
                              key={index}
                              className="pt-3 border-t border-gray-800 first:border-t-0 lg:pt-4"
                            >
                              <h3 className="font-medium lg:text-lg">
                                {item.question}
                              </h3>
                              <p className="text-gray-400 mt-1 text-sm lg:text-base lg:mt-2">
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
        </div>
      </div>

      {/* Contact Support */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 lg:static lg:border-t-0 lg:bg-transparent lg:p-0 lg:mt-8">
        <div className="flex justify-between items-center lg:justify-center lg:gap-8">
          <div className="lg:text-center">
            <h3 className="font-medium lg:text-xl">Need more help?</h3>
            <p className="text-sm text-gray-400 lg:text-lg">
              We're available 24/7
            </p>
          </div>
          <div className="flex space-x-3 lg:space-x-4">
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 lg:p-3">
              <FiMail className="lg:w-5 lg:h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 lg:p-3">
              <FiPhone className="lg:w-5 lg:h-5" />
            </button>
            <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 lg:p-3">
              <FiMessageSquare className="lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
