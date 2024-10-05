import HeaderBox from "@/components/ui/HeaderBox";
import LogoutModal from "@/components/ui/LogoutModal";
import PlaidLinkWrapper from "@/components/ui/PlaidLinkWrapper";
import RecentTransactions from "@/components/ui/RecentTransactions";
import RightSideBar from "@/components/ui/RightSideBar";
import TotalBalanceBox from "@/components/ui/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { isPlaidErrorAction } from "@/lib/utils";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  let accounts = null;
  let accountsData: any | null = null;
  let account: any | null = null;
  let isDisplayError: boolean = false;
  let errorMessage: string =
    "Due to technical issues , we are unable to process your details. Please try again later";
  let doAction: 'reauthenticate' | 'addConsent' = 'reauthenticate';
  let isAction: boolean = false;
  let accesstoken: string = "";
  let appwriteItemId: string = "";

  const currentPage = Number(page as string) || 1;
  //fetch user info from session
  const loggedInUser = await getLoggedInUser();

  //check if signed in

  if (!loggedInUser) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  //fetch account data for a user from plaid
  //here we will call a method providing the id of the bank to
  //retrieve the bank access token and call plaid api for the accoutn financial info
  try {
    accounts = await getAccounts({ userId: loggedInUser.$id });
  } catch (error) {
    if (isPlaidErrorAction(error)) {
      if (error.token && error.action === "reauthenticate") {
        doAction = error.action;
        isAction = true;
        accesstoken = error.token;
      } else if (error.token && error.action === 'addConsent') {
        doAction = error.action;
        isAction = true;
        accesstoken = error.token;
      } else {
        isDisplayError = true;
        errorMessage = error.message;
      }
    } else {
      isDisplayError = true;
      errorMessage =
        "There was a technical issue fetching your details. Please try again later";
    }
  }

  //get accounts data
  if (accounts && accounts.data) {
    //fetch specific account info based on the id
    accountsData = accounts?.data;
    //typescript assertion to treat id as string
    appwriteItemId = (id as string) || accountsData[0].appwriteItemId;
  }

  if (appwriteItemId) {
    try {
      account = await getAccount({ appwriteItemId });
    } catch (error) {
      if (isPlaidErrorAction(error)) {
        if (error.token && error.action === "reauthenticate") {
          doAction = error.action;
          isAction = true;
          accesstoken = error.token;
        } else if (error.token && error.action === 'addConsent') {
          doAction = error.action;
          isAction = true;
          accesstoken = error.token;
        } else {
          isDisplayError = true;
          errorMessage = error.message;
        }
      } else {
        isDisplayError = true;
        errorMessage =
          "There was a technical issue fetching your details. Please try again later";
      }
    }
  }

  if ((!accounts || !appwriteItemId || !account) && !isAction) {
    isDisplayError = true;
  }

  return (
    <div>
      {isDisplayError ? (
        <LogoutModal message={errorMessage} />
      ) : isAction ? (
        <div className="flex justify-center mt-4">
          <PlaidLinkWrapper
            user={loggedInUser}
            initialAccessToken={accesstoken}
            action={doAction}
          />
        </div>
      ) : (
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
              transactions={account?.transactions}
              page={currentPage}
              appwriteItemId={appwriteItemId}
            />
          </div>
          <RightSideBar
            user={loggedInUser}
            transactions={account?.transactions}
            banks={accountsData.slice(0, 2)}
          />
        </section>
      )}
    </div>
  );
};

export default Home;
