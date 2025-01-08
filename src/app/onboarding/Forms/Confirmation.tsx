"use client";

import { motion } from "framer-motion";

const Confirmation = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glass-like Card */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-xl max-w-md w-full p-8 shadow-xl text-center">
        <h2 className="text-2xl font-semibold text-grey-800 mb-3">
          Account Created!
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Your account is almost ready. Please ask someone in the WhatsApp group
          to approve your join request.
        </p>
        <p className="text-xs text-gray-500">
          This ensures our community remains exclusive and secure.
        </p>
      </div>
    </motion.div>
  );
};

export default Confirmation;
