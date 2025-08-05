"use client";

import { Box, ScrollArea } from "@mantine/core";
import { HeaderPage } from "../Header/HeaderPage";
import classes from "./Datareport.module.css";
import { PieChartCard } from "../DataReport/PiechartCard";
import { TotalCard } from "./TotalCard";
import { HistoryCard } from "./HistoryCard";
import { ChartCard } from "./ChartCard";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  getTransactionsByPeriod,
  type Transaction,
} from "../DataReport/DataReportService";
import { supabase } from "../../supabase";

// Định nghĩa kiểu dữ liệu cho biểu đồ tròn
type PieChartDataPoint = {
  name: string;
  value: number;
  color: string;
};

// Định nghĩa kiểu dữ liệu cho biểu đồ cột
type BarChartDataPoint = {
  date: string;
  Income: number;
  Expenses: number;
};

// Hàm tạo màu ngẫu nhiên dựa trên tên
function randomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// Hàm helper để tổng hợp dữ liệu cho TotalCard
const calculateTotals = (transactions: Transaction[]) => {
  const { totalIncome, totalExpenses } = transactions.reduce(
    (totals, transaction) => {
      if (transaction.transaction_type === "Income") {
        totals.totalIncome += transaction.amount;
      } else if (transaction.transaction_type === "Expenses") {
        totals.totalExpenses += transaction.amount;
      }
      return totals;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const balance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
};

// Hàm helper để tổng hợp dữ liệu cho PieChartCard
const generatePieChartData = (
  transactions: Transaction[],
  transactionType: "All" | "Income" | "Expenses"
): PieChartDataPoint[] => {
  let filteredTransactions = transactions;

  if (transactionType !== "All") {
    filteredTransactions = transactions.filter(
      (t) => t.transaction_type === transactionType
    );
  }

  const categoryMap = new Map<
    number,
    { name: string; value: number; color: string }
  >();

  filteredTransactions.forEach((transaction) => {
    const categoryId = transaction.id_cate;
    const categoryName = transaction.categories?.name || "Unknown";
    const categoryColor = randomColor(categoryName);

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        name: categoryName,
        value: 0,
        color: categoryColor,
      });
    }

    const currentData = categoryMap.get(categoryId)!;
    currentData.value += transaction.amount;
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.value - a.value);
};

// Hàm helper để tổng hợp dữ liệu cho ChartCard
const generateBarChartData = (
  transactions: Transaction[],
  timeRange: "Day" | "Week" | "Month" | "Year",
  selectFullDate: Date
): BarChartDataPoint[] => {
  const dataMap = new Map<string, { Income: number; Expenses: number }>();
  const selectedDay = dayjs(selectFullDate);

  let sortedKeys: string[] = [];
  switch (timeRange) {
    case "Day":
      for (let i = 0; i < 24; i++) {
        sortedKeys.push(dayjs().hour(i).minute(0).second(0).format("HH:00"));
      }
      break;
    case "Week":
      for (let i = 0; i < 7; i++) {
        sortedKeys.push(
          selectedDay.startOf("week").add(i, "day").format("ddd")
        );
      }
      break;
    case "Month":
      const daysInMonth = selectedDay.daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        sortedKeys.push(dayjs().date(i).format("DD"));
      }
      break;
    case "Year":
      for (let i = 0; i < 12; i++) {
        sortedKeys.push(dayjs().month(i).format("MMM"));
      }
      break;
  }

  sortedKeys.forEach((key) => {
    dataMap.set(key, { Income: 0, Expenses: 0 });
  });

  transactions.forEach((transaction) => {
    const d = dayjs(transaction.date);
    let key = "";

    switch (timeRange) {
      case "Day":
        key = d.format("HH:00");
        break;
      case "Week":
        key = d.format("ddd");
        break;
      case "Month":
        key = d.format("DD");
        break;
      case "Year":
        key = d.format("MMM");
        break;
    }

    if (dataMap.has(key)) {
      const currentData = dataMap.get(key)!;
      if (transaction.transaction_type === "Income") {
        currentData.Income += transaction.amount;
      } else if (transaction.transaction_type === "Expenses") {
        currentData.Expenses += transaction.amount;
      }
    }
  });

  return sortedKeys.map((key) => ({
    date: key,
    ...dataMap.get(key)!,
  }));
};

export default function DataReport() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // Hàm xử lý khi click vào biểu đồ tròn
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timeRange, setTimeRange] = useState<"Day" | "Week" | "Month" | "Year">(
    "Month"
  );
  const [transactionType, setTransactionType] = useState<
    "All" | "Income" | "Expenses"
  >("All");
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Lấy userId khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user ? user.id : null);
    };
    fetchUser();
  }, []);

  // Lấy dữ liệu giao dịch khi các state thay đổi
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !selectedDate) {
        setLoading(false);
        setTransactions([]);
        return;
      }
      setLoading(true);
      try {
        const fetchedTransactions = await getTransactionsByPeriod({
          userId,
          selectFullDate: selectedDate,
          timeRange,
        });
        console.log("Dữ liệu thô từ API:", fetchedTransactions);

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, selectedDate, timeRange]);

  // Xử lý dữ liệu đã lấy được để truyền vào các card
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const pieChartData = generatePieChartData(transactions, transactionType);
  const barChartData = generateBarChartData(
    transactions,
    timeRange,
    selectedDate || new Date()
  );

  return (
    <ScrollArea mah={700} scrollbars="y">
      <Box className={classes.datareportBackground}>
        <HeaderPage />
        <Box component="main" className={classes.datareportContainer}>
          <PieChartCard
            pieChartData={pieChartData}
            transactionType={transactionType}
            onTransactionTypeChange={setTransactionType}
            loading={loading}
          />
          <TotalCard
            selectFullDate={selectedDate}
            onDateChange={setSelectedDate}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
            loading={loading}
            transactionType={transactionType}
          />
          <HistoryCard
            transactions={transactions}
            loading={loading}
            selectedCategoryId={selectedCategoryId}
            transactionType={transactionType} // Truyền prop mới
          />
          <ChartCard
            selectFullDate={selectedDate}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            barChartData={barChartData}
            loading={loading}
          />
        </Box>
      </Box>
    </ScrollArea>
  );
}
