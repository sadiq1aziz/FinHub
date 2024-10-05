import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import Image from "next/image";
import {
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { plaidClient } from "@/lib/plaid";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/user.actions";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  // here we define the flow for connecting to Plaid :
  // 1. We first fetch the token from plaid by passing in user details
  // 2. Once we have the token we send it across to Plaid to receive the Link

  //1.get token via useEffect immediately
  const [token, setToken] = useState("");

  //fetch token
  useEffect(() => {
    const fetchAndSetToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    fetchAndSetToken();
  }, []);

  //2. get link via callback
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });

      //if success we route
      router.push("/");
    },
    [user]
  );

  //instance to communicate with plaid linkn interface
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  //fire into network to obtain resources from plaid link interface
  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          className="plaidlink-primary"
          disabled={!ready}
          onClick={() => open()}
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          className="plaidlink-ghost"
          variant="ghost"
          onClick={() => open()}
        >
          <Image
            src="./icons/connect-bank.svg"
            alt="connect-bank"
            width={24}
            height={24}
          />
          <p className="font-semibold text-black-2 text-[16px] hidden xl:block">Connect Bank</p>
        </Button>
      ) : (
        <Button
          className="plaidlink-default"
          variant="default"
          onClick={() => open()}
        >
          <Image
            src="./icons/connect-bank.svg"
            alt="connect-bank"
            width={25}
            height={25}
          />
          <p className="hidden xl:block font-semibold text-black-2 text-[16px]">Connect Bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
