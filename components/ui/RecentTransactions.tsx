import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

import BankInfo from "./BankInfo";
import { BankTabItem } from "./BankTabItem";
import TransactionTable from "./TransactionTable";

const RecentTransactions = ({
  accounts,
  transactions = [],
  page = 1,
  appwriteItemId,
}: RecentTransactionsProps) => {
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between ">
        <h2 className="recent-transactions-label">Recent Transactions</h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      {/* content for tab */}
      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => {
            return (  
              <TabsTrigger key={account.id} value={account.appwriteItemId}>
                <BankTabItem
                  key={account.id}
                  account={account}
                  appwriteItemId={appwriteItemId}
                />
              </TabsTrigger>
            );
          })}
        </TabsList>

        {accounts.map((account: Account) => {
          return (
            <TabsContent key={account.id} 
            value={account.appwriteItemId}
            className="space-y-4">
              <BankInfo
                account={account}
                appwriteItemId={appwriteItemId}
                type="full"
              />
              {/*transaction data  */}
              <TransactionTable transactions={transactions} />
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
