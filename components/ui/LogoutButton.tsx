"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { logoutAccount } from "@/lib/actions/user.actions";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutAccount();
    if (response) {
      console.log("Logged out session");
      router.replace("/sign-in");
    }
  };
  return (
      <div className="p-2 text-center space-y-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Logout
        </button>
      </div>
  );
};

export default LogoutButton;
