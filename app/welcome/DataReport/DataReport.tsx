"use client";

import { Box, Grid, GridCol } from "@mantine/core";
import { HeaderPage } from "../Header/HeaderPage";
import classes from "./Datareport.module.css";
import { PieChartCard } from "./PiechartCard";
import { TotalCard } from "./TotalCard";
import { HistoryCard } from "./HistoryCard";
import { ChartCard } from "./ChartCard";
import { useState } from "react";
export async function loader() {
  return null;
}

export default function DataReport() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const someDateValue = selectedDate || new Date();
  return (
    <Box className={classes.datareportBackground}>
      <HeaderPage />
      {/* <Grid className={classes.datareportContainer}>
        <GridCol span={3}>
          <PieChart />
        </GridCol>
        <GridCol span={3}>
          <TotalCard />
        </GridCol>
        <GridCol span={3}>
          <HistoryCard />
        </GridCol>
        <GridCol span={3}>
          <ChartCard />
        </GridCol>
      </Grid> */}
      <Box component="main" className={classes.datareportContainer}>
        <PieChartCard selectFullDate={someDateValue} timeRange="Day"
         />
        <TotalCard />
        <HistoryCard
          selectFullDate={someDateValue}
          timeRange="Day"
          transactionType="All"
        />{" "}
        <ChartCard />
      </Box>
    </Box>
  );
}
