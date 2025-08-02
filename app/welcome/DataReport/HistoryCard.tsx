"use client";

import React, { useState, useEffect } from "react";
import { Box, Text, Table, Pagination } from "@mantine/core";
import {
  getCurrentUserId,
  fetchAndFilterTransactions,
} from "./DataReportService";
import type { Transaction } from "./DataReportService";
import classes from "./Datareport.module.css";

type HistoryCardProps = {
  selectFullDate: Date | null;
  timeRange: "Day" | "Week" | "Month" | "Year";
  transactionType: "All" | "Income" | "Expenses";
};

export const HistoryCard: React.FC<HistoryCardProps> = ({
  selectFullDate,
  timeRange,
  transactionType,
}) => {
  const [userId, setUserId] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Lấy user ID
  useEffect(() => {
    const fetchUser = async () => {
      const id = await getCurrentUserId();
      if (id) setUserId(id);
    };
    fetchUser();
  }, []);

  // Lấy giao dịch theo filter
  useEffect(() => {
    if (!userId || !selectFullDate) {
      setTransactions([]);
      return;
    }

    const fetchData = async () => {
      const data = await fetchAndFilterTransactions(
        userId,
        selectFullDate,
        timeRange,
        transactionType
      );
      setTransactions(data);
      setPage(1); // reset về trang đầu khi dữ liệu mới
    };

    fetchData();
  }, [userId, selectFullDate, timeRange, transactionType]);

  // Phân trang
  const paginated = transactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box className={classes.box + " " + classes.history}>
      <Box className={classes.titles}>
        <Box component="h3">Transaction History</Box>
      </Box>

      <Table>
        {paginated.length > 0 ? (
          paginated.map((item) => (
            <Table.Tbody>
              <Table.Tr key={item.id}>
                <Table.Td>
                  <Text fw={500}>{item.categories?.name || "Unknown"}</Text>
                  <Text fz="sm" c="dimmed">
                    {item.note}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text
                    c={item.transaction_type === "Income" ? "green" : "red"}
                    fw={600}
                  >
                    {item.amount.toLocaleString()}$
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{item.date}</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          ))
        ) : (
          <Table.Caption className={classes.noTransaction}>
            <Text p="md" c="dimmed">
              There isn’t any transaction recorded for this period yet.
            </Text>
          </Table.Caption>
        )}
      </Table>

      {/* Phân trang nếu đủ số lượng */}
      {transactions.length > itemsPerPage && (
        <Pagination
          value={page}
          onChange={setPage}
          total={Math.ceil(transactions.length / itemsPerPage)}
          mt="md"
          size="sm"
          radius="xl"
        />
      )}
    </Box>
  );
};
