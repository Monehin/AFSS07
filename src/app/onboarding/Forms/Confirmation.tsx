"use client";

import { motion } from "framer-motion";
import { DoorOpen } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const Confirmation = () => {
  const { signOut } = useClerk();

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Glass-like Card */}
      <div className="relative m-8 bg-white/70 backdrop-blur-md rounded-xl max-w-md w-full p-8 shadow-xl text-center">
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
        <div
          className=" text-sm text-gray-700 mb-2  cursor-pointer"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <DoorOpen className="w-6 h-6 text-gray-500 mx-auto mt-8" />
          <p>Exit page</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Confirmation;
