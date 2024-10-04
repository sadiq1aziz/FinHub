import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";
import { countTransactionCategories } from "@/lib/utils";
import { Category } from "./Category";

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {

  const categories: CategoryCount[] = countTransactionCategories(transactions);
  console.log(categories);
  return (
    <aside className="right-sidebar-pane">
      {/* section for profile info */}
      <section className="profile-screen">
        <div className="profile-banner-screen"></div>
        <div className="profile-img-screen">
          <div className="profile-img">
            <span className="text-indigo-600 text-5xl font-bold p-4">
              {user.firstName[0]}
            </span>
          </div>
        </div>
        <div className="profile-info-screen">
          <h1 className="profile-name-info">
            {user.firstName} {user.lastName}
          </h1>
          <h2 className="profile-email-info">{user.email}</h2>
        </div>
      </section>

      {/* section for bank details */}
      <section className="bank-details-screen">
        <div className="bank-title">
          <h2 className="my-banks-snippet">My Banks</h2>
          <Link href="/my-banks" className="add-bank-link">
            <Image
              src="/icons/arrow-right.svg"
              width={20}
              height={20}
              alt="plus logo"
            />
            <div className="add-bank-title">View Banks</div>
          </Link>
        </div>
        {/* banks is an array of account objects therefore for any iterable we will need to use key */}
        {banks?.length > 0 &&  (
            // center items centrally across cross and main axes
            <div className="flex flex-1 relative flex-col justify-center items-center mr-3">
                <div className="relative z-10">
                    <BankCard
                        key={banks[0].$id} 
                        account={banks[0]}
                        userName={`${user.firstName}${user.lastName}`}
                        showBalance={false}
                    />
                </div>
                {banks[1] && (
                    <div className="absolute right-0 top-8 w-[90%] z-0">
                        <BankCard
                        key={banks[0].$id} 
                        account={banks[0]}
                        userName={`${user.firstName}${user.lastName}`}
                        showBalance={false}
                    />
                    </div>
                )}
            </div>
        )}

        
      </section>

      <div className="ml-6 mt-10 flex flex-1 flex-col gap-6"> 
            <h2 className="header-2">
              Top Categories
            </h2>
            <div className="space-y-5">
              {categories.map( (category, index) => {
                  return (
                    <Category key={category.name}  category={category}  />
                  )
              })}
            </div>
        </div>
    </aside>
  );
};

export default RightSideBar;
