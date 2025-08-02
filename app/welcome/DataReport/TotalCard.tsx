"use client";

import React, { useState, useEffect } from "react";
import { Box, Text, Loader } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import classes from "./Datareport.module.css";
import {
  getCurrentUserId,
  fetchAndFilterTransactions,
  calculateTotals,
} from "./DataReportService"; // đúng path tới logic

export const TotalCard: React.FC = () => {
  const [selectFullDate, setSelectFullDate] = useState<Date | null>(new Date());
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  // Lấy ID người dùng
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Lấy và tính toán giao dịch
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !selectFullDate) return;
      setLoading(true);

      const transactions = await fetchAndFilterTransactions(
        userId,
        selectFullDate,
        "Month", // hoặc "Day", "Week", hoặc cho chọn tùy biến
        "All"
      );

      const { totalIncome, totalExpenses, balance } =
        calculateTotals(transactions);

      setTotalIncome(totalIncome);
      setTotalExpenses(totalExpenses);
      setBalance(balance);
      setLoading(false);
    };

    fetchData();
  }, [userId, selectFullDate]);

  return (
    <Box className={`${classes.total} ${classes.box}`}>
      <DatePickerInput
        id={classes.selectFullDate}
        value={selectFullDate}
        onChange={setSelectFullDate}
        placeholder="Select date"
        maw={300}
      />
        <>
          <Text component="p" mt="md" fw={500}>
            Total Balance: {balance.toLocaleString()}$
          </Text>

          <Box className={classes.incomeExpense}>
            {totalIncome > 0 && (
              <Box className={classes.income}>
                Income
                <Box component="br" />
                {totalIncome.toLocaleString()}$
              </Box>
            )}

            {totalExpenses > 0 && (
              <Box className={classes.expense}>
                Expenses
                <Box component="br" />
                {totalExpenses.toLocaleString()}$
              </Box>
            )}
          </Box>
        </>
    </Box>
  );
};
