"use client";

import React, { useState, useEffect } from "react";
import { Box, Select, Text } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import classes from "./Datareport.module.css";

import {
  getCurrentUserId,
  fetchAndFilterTransactions,
  generatePieChartData,
} from "./DataReportService"; 
import type { Transaction, PieChartDataPoint } from "./DataReportService";

interface PieChartCardProps {
  selectFullDate: Date | null;
  timeRange: "Day" | "Week" | "Month" | "Year";
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  selectFullDate,
  timeRange,
}) => {
  // 3. Khai báo các state cần thiết cho component
  const [userId, setUserId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartDataPoint[]>([]);
  const [transactionType, setTransactionType] = useState<
    "All" | "Income" | "Expenses"
  >("All");

  // Hook để lấy ID người dùng khi component được tải
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      if (id) setUserId(id);
    };
    fetchUser();
  }, []);

  // Hook để tìm nạp và lọc giao dịch khi có sự thay đổi
  useEffect(() => {
    if (!userId || !selectFullDate) {
      setTransactions([]); // Xóa dữ liệu cũ nếu không có user hoặc ngày
      return;
    }

    const loadTransactions = async () => {
      const data = await fetchAndFilterTransactions(
        userId,
        selectFullDate,
        timeRange,
        transactionType
      );
      setTransactions(data);
    };

    loadTransactions();
  }, [userId, selectFullDate, timeRange, transactionType]); // <-- Chạy lại khi các giá trị này thay đổi

  // Hook để tạo dữ liệu cho biểu đồ khi danh sách giao dịch thay đổi
  useEffect(() => {
    const dataForChart = generatePieChartData(transactions);
    setPieChartData(dataForChart);
  }, [transactions]);

  return (
    <Box className={classes.piechart + " " + classes.box}>
      <Select
        value={transactionType}
        onChange={(val) =>
          setTransactionType((val as "All" | "Income" | "Expenses") || "All")
        }
        data={[
          { value: "All", label: "All" },
          { value: "Income", label: "Income" },
          { value: "Expenses", label: "Expenses" },
        ]}
        placeholder="Transaction Type"
        maw={200}
        mah={50}

      />
      {/* 4. Kiểm tra pieChartData thay vì transactions để đảm bảo có dữ liệu đã xử lý */}
      {pieChartData.length > 0 ? (
        <PieChart
          data={pieChartData}
          withLabelsLine
          withTooltip
          size={190}
          strokeColor="#fff"
          tooltipDataSource="segment"
        />
      ) : (
        <Text p="md">
          There isn’t any transaction recorded for this period yet.
        </Text>
      )}
    </Box>
  );
};
