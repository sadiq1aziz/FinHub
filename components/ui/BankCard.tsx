import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Copy from "./Copy";

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {

  return (
    <div className="flex flex-col">
      <Link href={`/transaction-history/?id=${account.appwriteItemId}`} className="bank-card min-w-[280px]">
        <div className="bank-card_content">
          <div className="space-y-1">
            <h2 className="text-14 font-semibold text-white justify-center">
              {account.name}
            </h2>
            <p className="text-14 font-ibm-plex-serif text-white">
              {formatCurrency(account.currentBalance)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between ">
              <h2 className="text-12 font-ibm-plex-serif text-white">{userName}</h2>
              <div className="text-12 font-ibm-plex-serif text-white">●●/●●</div>  
            </div>
            <p className="text-14 font-ibm-plex-serif text-white">●●●● ●●●● ●●●● {account.mask}
            </p>
          </article>
        </div>
        <div className="bank-card_icon">    
            <Image 
                src='/icons/Paypass.svg'
                width={20}
                height={20}
                alt="pay-logo"
            />
            <Image
                src='/icons/mastercard.svg'
                width={40}
                height={40}
                alt="card-logo"
                className="ml-11 pl-2"
            />
            {/* using absolute creates a stacking wherein other UI imgs are layered on top : occurs w.r.t 
             position: absolute,  relative, fixed*/}
             <Image
                src='/icons/lines.png'
                width={316}
                height={190}
                alt="lines"
                className='absolute top-0 left-0'
            />
        </div>
      </Link>
      {showBalance && <Copy title={account?.shareableId} />}
    </div>
  );
};

export default BankCard;
