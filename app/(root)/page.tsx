import HeaderBox from "@/components/ui/HeaderBox";
import RecentTransactions from "@/components/ui/RecentTransactions";
import RightSideBar from "@/components/ui/RightSideBar";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page }} : SearchParamProps) => {

  const currentPage = Number(page as string);

  //fetch user info from session 
  const loggedInUser = await getLoggedInUser();

  //check if signed in

  if(!loggedInUser){
    return
  }


  //fetch account data for a user from plaid
  //here we will call a method providing the id of the bank to 
  //retrieve the bank access token and call plaid api for the accoutn financial info 
  const accounts = await getAccounts({userId: loggedInUser.$id});
  
  if (!accounts) {
    return;
  }

  //fetch specific account info based on the id
  const accountsData = accounts?.data; 
  //typescript assertion to treat id as string

  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  //fetch account data using ID
  const account = await getAccount({ appwriteItemId});
  
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
              accounts={accountsData}
              totalBanks={accounts?.totalBanks}
              totalCurrentBalance={accounts?.totalCurrentBalance}
            />
          </header>
          <RecentTransactions 
            accounts={accountsData}
            transactions={account.transactions}
            page={currentPage}
            appwriteItemId={appwriteItemId}

          />
        </div>
        <RightSideBar user={loggedInUser} transactions={accounts?.transactions} banks={accountsData.slice(0, 2)} />
      </section>
    </div>
  );
};

export default Home;
