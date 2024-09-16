import HeaderBox from "@/components/ui/HeaderBox";
import RightSideBar from "@/components/ui/RightSideBar";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async () => {
  const loggedInUser = await getLoggedInUser();
  console.log(loggedInUser);
  return (
    <div>
      <section className="home">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedInUser?.name || "Guest"}
              subtext="View and manage account details"
            />

            <TotalBalanceBox
              accounts={[]}
              totalBanks={1}
              totalCurrentBalance={1234}
            />
          </header>
          Transactions
        </div>
        <RightSideBar user={loggedInUser} transactions={[]} banks={[{currentBalance:223.09}, {currentBalance:443}]} />
      </section>
    </div>
  );
};

export default Home;
