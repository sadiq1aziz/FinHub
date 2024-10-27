import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import Image from "next/image";
import {
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
  exchangePublicToken,
} from "@/lib/actions/user.actions";
import LogoutButton from "./LogoutButton";
import usePlaidLinkToken from "./UsePlaidLinkToken";


const PlaidLink = ({ user, variant, accesstoken }: PlaidLinkProps) => {

  const router = useRouter();

  
  // here we define the flow for connecting to Plaid :
  // for first connect
  // 1. We first fetch the token from plaid by passing in user details
  // 2. Once we have the token we send it across to Plaid to receive the Link

  
  const [toggle, setToggle] = useState(false);

  const token = usePlaidLinkToken(user, variant, accesstoken);

  //2. get link via callback
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
      
      async (public_token: string) => {
      if (!accesstoken) {
        await exchangePublicToken({
          publicToken: public_token,
          user,
        });
      } else {
        setToggle(true);
      }

    
      //if success we route
      router.push("/");
    },
    [user, accesstoken, router]
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
          <p className="font-semibold text-black-2 text-[16px] hidden xl:block">
            Connect Bank
          </p>
        </Button>
      ) : variant === "reauthenticate" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center space-y-4 max-w-xs min-h-[300px] mx-auto">
            <p className="text-lg font-light text-gray-700">
              You are required to authenticate your bank account once again.
            </p>
            <Button
              className="px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                open(); // Open the Plaid Link when user clicks
              }}
              disabled={toggle}
            >
              Authenticate Bank Account
            </Button>
            <p className="text-gray-600">Or</p>
            <LogoutButton />
          </div>
        </div>
      ) : variant === "addConsent" ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-xl text-center space-y-4 max-w-xs min-h-[300px] mx-auto">
            <p className="text-lg font-light text-gray-700">
              To proceed, you will need to authorize access to banking transaction services
            </p>
            <Button
              className="px-6 py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                open(); // Open the Plaid Link when user clicks
              }}
              disabled={toggle}
            >
              Consent to add transactions
            </Button>
            <p className="text-gray-600">Or</p>
            <LogoutButton />
          </div>
        </div>
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
          <p className="hidden xl:block font-semibold text-black-2 text-[16px]">
            Connect Bank
          </p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
