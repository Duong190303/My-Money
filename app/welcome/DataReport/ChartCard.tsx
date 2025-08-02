"use client";

import React, { useState, useEffect } from "react";
import { Box, Text, Select, Loader } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import classes from "./Datareport.module.css";

import {
  getCurrentUserId,
  fetchAndFilterTransactions,
  generateBarChartData,
} from "./DataReportService";

import type { Transaction, BarChartDataPoint } from "./DataReportService";

export const ChartCard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"Day" | "Week" | "Month" | "Year">(
    "Day"
  );
  const [selectFullDate, setSelectFullDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [areaChartData, setAreaChartData] = useState<BarChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Lấy ID người dùng
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUser();
  }, []);

  // Lấy dữ liệu giao dịch khi userId hoặc timeRange đổi
  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !selectFullDate) return;
      setLoading(true);

      const data = await fetchAndFilterTransactions(
        userId,
        selectFullDate,
        timeRange,
        "All"
      );
      setTransactions(data);

      const chartData = generateBarChartData(data, timeRange);
      setAreaChartData(chartData);

      setLoading(false);
    };

    fetchData();
  }, [userId, selectFullDate, timeRange]);

  // const handleTimeRangeChange = (
  //   value: "Day" | "Week" | "Month" | "Year" | null
  // ) => {
  //   setTimeRange(value || "Day");
  // };

  return (
    <Box className={`${classes.box} ${classes.chart}`}>
      <Select
        placeholder="Time Range"
        value={timeRange}
        onChange={(value) => {
          if (
            value === "Day" ||
            value === "Week" ||
            value === "Month" ||
            value === "Year"
          ) {
            setTimeRange(value);
          } else {
            setTimeRange("Day"); // default to "Day" if value is null or invalid
          }
        }}
        data={[
          { value: "Day", label: "Day" },
          { value: "Week", label: "Week" },
          { value: "Month", label: "Month" },
          { value: "Year", label: "Year" },
        ]}
        maw={200}
        mb="md"
      />

    
      {areaChartData.length > 0 ? (
        <BarChart
          id={classes.barchart}
          h={240}
          data={areaChartData}
          dataKey="date"
          series={[
            { name: "Income", color: "teal" },
            { name: "Expenses", color: "red" },
          ]}
          withLegend
          withXAxis
          withYAxis
          withTooltip
          tickLine="x"
          gridAxis="none"
        />
      ) : (
        <Text>
          There isn’t any transaction recorded for this period yet.
        </Text>
      )}
    </Box>
  );
};
