import React from "react";
import Image from "next/image";
import { logoutAccount } from "@/lib/actions/user.actions";
import { useRouter } from 'next/navigation'

const Footer = ({ user, type = 'desktop'}: FooterProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logoutAccount();
    if (response) {
        console.log("Logged out session");
        router.replace('/sign-in');
    }
  };

  return (
    <div className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-gray-700 text-xl font-bold">{user.firstName[0]}</p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <p className="text-gray-700 text-14 font-semibold truncate">
          {user.name}
        </p>
        <p className="text-gray-700 text-14 truncate">{user.email}</p>
      </div>

      <div className="footer_image" onClick={handleLogout}>
        <Image src="./icons/logout.svg" alt="logout-logo" fill />
      </div>
    </div>
  );
};

export default Footer;
