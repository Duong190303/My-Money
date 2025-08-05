"use client";

import React from "react";
import { Box, Text, Select, Loader, Center } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import classes from "./Datareport.module.css";

type BarChartDataPoint = {
  date: string;
  Income: number;
  Expenses: number;
};

interface ChartCardProps {
  selectFullDate: Date | null;
  timeRange: "Day" | "Week" | "Month" | "Year";
  onTimeRangeChange: (value: "Day" | "Week" | "Month" | "Year") => void;
  barChartData: BarChartDataPoint[];
  loading: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  selectFullDate,
  timeRange,
  onTimeRangeChange,
  barChartData,
  loading,
}) => {
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
            onTimeRangeChange(value);
          } else {
            onTimeRangeChange("Day");
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

      {loading ? (
        <Center style={{ height: '240px' }}>
          <Loader />
        </Center>
      ) : barChartData.length > 0 ? (
        <BarChart
          id={classes.barchart}
          h={240}
          data={barChartData}
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
        <Text p="md" ta="center">
          Hiện chưa có giao dịch nào được ghi lại trong khoảng thời gian này.
        </Text>
      )}
    </Box>
  );
};