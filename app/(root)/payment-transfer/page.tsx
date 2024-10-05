import HeaderBox from "@/components/ui/HeaderBox";
import PaymentTransferFormComponent from "@/components/ui/PaymentTransferFormComponent";
import { getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const PaymentTransfer = async () => {
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
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Perform transfer of funds seamlessly here"
      />

      {/* form */}
      <section className="pt-5 size-full">
        <PaymentTransferFormComponent accounts={accountsData} />
      </section>
    </section>
  );
};

export default PaymentTransfer;
