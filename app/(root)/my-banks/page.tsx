import BankCard from "@/components/ui/BankCard";
import HeaderBox from "@/components/ui/HeaderBox";
import InfoTooltip from "@/components/ui/InfoToolTip";
import { getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { card_message } from "@/lib/utils";
import React from "react";

const MyBanks = async () => {
  const loggedInUser = await getLoggedInUser();

  //check if signed in

  if (!loggedInUser) {
    return;
  }

  //fetch account data for a user from plaid
  //here we will call a method providing the id of the bank to
  //retrieve the bank access token and call plaid api for the accoutn financial info
  const accounts = await getAccounts({ userId: loggedInUser.$id });
 
  if (!accounts) {
    return;
  }

  //fetch specific account info based on the id
  const accountsData = accounts?.data;

  return (
    <section className="my-banks">
      <div className="my-banks-snippet">
      <div className="flex items-end gap-2">
        <HeaderBox
          title="My Banks"
          subtext="Browse through your bank accounts here"
        />
        <InfoTooltip message={card_message}/>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="header-2">Your Cards</h2>
        <div className="flex flex-wrap gap-20">
          {accountsData &&
            accountsData.map((a: Account) => {
              return (
                <BankCard 
                  key={a.id}
                  account={a} 
                  userName={loggedInUser.firstName} 
                />
              );
            })}
        </div>
      </div>
    
    </section>
   
  );
};

export default MyBanks;
