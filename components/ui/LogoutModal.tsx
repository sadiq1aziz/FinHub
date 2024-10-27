"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { logoutAccount } from "@/lib/actions/user.actions";

interface LogoutModalProps {
  message: string;
}
interface MessageProps {
    message: string | undefined;
}
const LogoutModal: React.FC<LogoutModalProps> = ({ message } : MessageProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutAccount();
    if (response) {
      console.log("Logged out session");
      router.replace("/sign-in");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-sm p-8 text-center space-y-6">
        <p className="text-gray-700 text-lg font-light tracking-wide">
          {message}
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
