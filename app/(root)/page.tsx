import HeaderBox from "@/components/ui/HeaderBox";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import React from "react"

const Home = () => {

  const loggedInUser = { firstName: "Aashiq"};

  return (
    <div>
      <section className="home">
          <div className="home-content">  
            <header className="home-header">
                  <HeaderBox
                    type="greeting"
                    title="Welcome"
                    user={loggedInUser?.firstName || "Guest"} 
                    subtext="View and manage account details"
                  />

                  <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1234} 
                  />
            </header>
          </div>
      </section>

    </div>
  )
};

export default Home;
