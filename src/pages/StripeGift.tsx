import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Gift, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SparkleRain from "@/components/SparkleRain";
import Navbar from "@/components/Navbar";
import { hero3, hero7, hero9 } from "@/assets";

const StripeGift = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; amount?: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const backgroundImages = [hero3, hero7, hero9];
  
  // Background image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const amountToPay = selectedAmount || Number(customAmount);

  const validateForm = () => {
    const newErrors: {email?: string; amount?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!amountToPay || amountToPay <= 0) {
      newErrors.amount = "Please select or enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://stripe-payment-3okv.onrender.com/api/create-checkout-session/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountToPay,
            email,
            note,
            name,
            phone,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!data?.data?.url) throw new Error("Missing Stripe redirect URL.");

      window.location.href = data.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      setShowSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const presetAmounts = [25, 50, 75, 100, 150, 200];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Enhanced Background with Overlay */}
      <div className="fixed inset-0 z-0">
        <motion.div 
          key={currentBgImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: `url(${backgroundImages[currentBgImage]})`, 
            filter: 'brightness(0.2) saturate(1.2)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-gray-800/50" />
      </div>
      
      {/* Enhanced SparkleRain */}
      <SparkleRain zIndex={5} showBackground={false} />
      
      {/* Navigation Header */}
      <Navbar />

      <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-8 pb-16 relative z-10 min-h-screen">
        {/* Main Gift Form */}
        <motion.div
          className="w-full max-w-lg my-8 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-black/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
            {/* Header with Icon */}
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "backOut" }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Gift className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-rochester text-white mb-2">
                Contribute to Our Wedding Gift
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Your contribution will help us start our new journey together
              </p>
            </motion.div>

            {/* Amount Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((amt) => (
                  <motion.button
                    key={amt}
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount("");
                      setErrors(prev => ({ ...prev, amount: undefined }));
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 px-4 rounded-xl text-lg font-bold border-2 shadow-md transition-all duration-300 ${
                      selectedAmount === amt
                        ? "bg-yellow-500 text-black border-yellow-400 shadow-yellow-200"
                        : "bg-gray-800 text-yellow-400 border-yellow-500 hover:border-yellow-400 hover:shadow-lg hover:bg-gray-700"
                    }`}
                  >
                    £{amt}
                  </motion.button>
                ))}
              </div>
              
              <motion.input
                type="number"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                  setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                className="w-full border-2 border-yellow-500 rounded-xl p-4 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.amount && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.amount}
                </motion.p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Your Email Address *
              </label>
              <motion.input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className="w-full border-2 border-yellow-500 rounded-xl p-4 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Contact Details */}
            <div className="mb-6 grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Your Name
                </label>
                <motion.input
                  type="text"
                  placeholder="e.g., Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-yellow-500 rounded-xl p-4 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <motion.input
                  type="tel"
                  placeholder="e.g., +44 7123 456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-yellow-500 rounded-xl p-4 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Location
                </label>
                <motion.input
                  type="text"
                  placeholder="City / Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-2 border-yellow-500 rounded-xl p-4 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Personal Message (Optional)
              </label>
              <motion.textarea
                placeholder="Leave a heartfelt message for Rudolf & Jemima..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border-2 border-yellow-500 rounded-xl p-4 h-24 text-lg font-medium bg-gray-800 text-white shadow-md focus:border-yellow-400 focus:outline-none resize-none transition-all duration-300 placeholder-gray-400"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            {/* Payment Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handlePayment}
                disabled={isLoading || !amountToPay || !email}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  `Pay £${amountToPay || ""}`
                )}
              </Button>
            </motion.div>

            <motion.p 
              className="text-center text-sm text-gray-300 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              🔒 Secure payment powered by Stripe
            </motion.p>
          </div>
        </motion.div>

        {/* Bank Transfer Option */}
        <motion.div
          className="w-full max-w-lg mt-6 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-black/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-rochester text-white mb-4 text-center">
              Alternative: Bank Transfer
            </h3>
            <p className="text-gray-300 text-sm mb-4 text-center">
              Prefer to transfer directly? Use these details:
            </p>
            <div className="bg-gray-800 p-4 rounded-xl border border-yellow-500">
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-yellow-400">Account Name:</span> <span className="text-white">Rudolf Ehumah</span></p>
                <p><span className="font-semibold text-yellow-400">Account Number:</span> <span className="text-white">05430972</span></p>
                <p><span className="font-semibold text-yellow-400">Sort Code:</span> <span className="text-white">07-13-06</span></p>
                <p><span className="font-semibold text-yellow-400">Bank:</span> <span className="text-white"></span></p>
                <p className="text-xs text-gray-400 mt-3 italic">Please include your name as reference</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Thank You Section */}
        <motion.div
          className="w-full max-w-lg mt-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 1, ease: "backOut" }}
              className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Heart className="w-8 h-8 text-black fill-black" />
            </motion.div>
            
            <h3 className="text-2xl font-rochester text-white mb-4">
              Thank You!
            </h3>
            
            <p className="text-gray-300 text-base leading-relaxed mb-6">
              Thank you for being part of our celebration. <br />
              We can't wait to share this new chapter with you!
            </p>
            
            <motion.div
              className="bg-gray-800 p-4 rounded-xl border border-yellow-500"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-yellow-400 font-bold text-lg">
                With love, Rudolf & Jemima
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StripeGift;
