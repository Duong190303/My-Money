"use client";

import { useState, useEffect } from "react"; // ADDED
import { HeaderPage } from "../../Header/HeaderPage";
import { Box, ScrollArea, ScrollAreaAutosize } from "@mantine/core";
import classes from "../transaction.module.css";
import { ExpensesTable } from "./ExpensesTable";
import { TableTranExpenses } from "./TableTranExpenses";
import {
  fetchExpenseTransactions,
  type Transaction,
} from "../TransactionSevice/ExpensesService"; // ADDED
import { getCurrentUserId } from "../TransactionSevice/IncomeService";

export default function Income() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const refreshTransactions = async () => {
    const userId = await getCurrentUserId();
    if (userId) {
      const data = await fetchExpenseTransactions(userId);
      setTransactions(data);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleClearSelection = () => {
    setSelectedTransaction(null);
  };

  return (
    // <ScrollArea mah={700} style={{ width: "100%" }}>
      <Box className={classes.incomeBackground}>
        <HeaderPage />
        <Box id={classes.incomeContainer}>
          <ExpensesTable
            transactions={transactions}
            onRowClick={handleRowClick}
          />
          <Box className={classes.incomeContainer1} />
          <TableTranExpenses
            selectedTransaction={selectedTransaction}
            onDataChange={refreshTransactions}
            onClear={handleClearSelection}
          />
        </Box>
      </Box>
    // </ScrollArea>
  );
}
