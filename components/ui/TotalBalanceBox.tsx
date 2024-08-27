import { formatCurrency } from "@/lib/utils";
import React from "react";
import CurrencyCounter from "./CurrencyCounter";
import DoughnutChart from "./DoughnutChart";

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">{
        <DoughnutChart accounts={accounts}/>
      }</div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2">Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Balance</p>
          <div className="total-balance-amount">
              <CurrencyCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
