import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
    cn,
  formatCurrency,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { log } from "console";
import { transactionCategoryStyles } from "@/constants";
import { string } from "zod";

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatCurrency(t.amount);

          //credit or debit status
          const isDebit = amount[0] === '-' ? true : false;

          //handle corrupt data
          if (t.amount === undefined) {
            return;
          }

          //category badge -> background styling
          const CategoryBadge = ({category} : CategoryBadgeProps) => {

            const { borderColor, backgroundColor, textColor, chipBackgroundColor } = transactionCategoryStyles[category as keyof typeof string]
            || transactionCategoryStyles['default'];

            return (
                <div className={cn('category-badge', chipBackgroundColor, borderColor)}>
                    <div className={cn('size-2 rounded-full', backgroundColor)}></div>
                    <p className={cn('text-[12px] font-medium', textColor)}>
                        {category}
                    </p>
                </div>
            )
          }

          return (
            <TableRow
              key={t.id}
              className={`${
                amount[0] === "-" ? "bg-[#fcf2f2]" : "bg-[#eaf6ee]" 
              } !overflow:bg-none !border-b-DEFAULT`}
            >
              <TableCell className="max-w-[285px] pr-10 pl-2">
                <div className="flex items-center">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">{removeSpecialCharacters(t.name)}</h1>
                </div>
              </TableCell>
              <TableCell className={cn('pr-10 font-semibold', {
                "text-red-700" : amount[0] === '-',
                "text-[#039855] pl-[21px]" : isDebit === false
              })}>{amount}</TableCell>
              <TableCell className="pr-10 pl-2">
                <CategoryBadge category={status} /></TableCell>
              <TableCell className="pr-10 pl-2 min-w-32">{formatDateTime(new Date(t.date)).dateTime}</TableCell>
              <TableCell className="pr-10 pl-2 capitalize min-w-24">{t.paymentChannel}</TableCell>
              <TableCell className="pr-10 pl-2 max-md:hidden">
                <CategoryBadge category={t.category} /></TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
