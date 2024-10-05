import { useEffect, useState } from "react";
import { createLinkToken } from "@/lib/actions/user.actions";

const usePlaidLinkToken = (user: User, variant: string, accesstoken?: string) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const data = await createLinkToken(user, variant, accesstoken);
      setToken(data?.linkToken);
    };

      
    fetchToken();
  }, [user, accesstoken, variant]);

  return token;
};

export default usePlaidLinkToken;
