// src/components/HistoryCard.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Box, Text, Table, Pagination, Loader, Center } from "@mantine/core";
import type { Transaction } from "../DataReport/DataReportService";
import classes from "./Datareport.module.css";

// Thêm prop `selectedCategoryId` và `transactionType`
interface HistoryCardProps {
  transactions: Transaction[];
  loading: boolean;
  selectedCategoryId: number | null; // ID của danh mục được chọn, hoặc null nếu không có
  transactionType: "All" | "Income" | "Expenses"; // Loại giao dịch
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  transactions,
  loading,
  selectedCategoryId,
  transactionType, // Nhận prop mới
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  // Áp dụng bộ lọc cho loại giao dịch trước
  const filteredByTransactionType =
    transactionType === "All"
      ? transactions
      : transactions.filter((t) => t.transaction_type === transactionType);

  // Sau đó, áp dụng bộ lọc cho danh mục đã chọn
  const finalFilteredTransactions = selectedCategoryId
    ? filteredByTransactionType.filter((t) => t.id_cate === selectedCategoryId)
    : filteredByTransactionType;

  // Reset trang về 1 khi danh sách giao dịch hoặc danh mục/loại giao dịch thay đổi
  useEffect(() => {
    setPage(1);
  }, [finalFilteredTransactions]);

  const paginated = finalFilteredTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box className={classes.box + " " + classes.history}>
      <Box className={classes.titles}>
        <h3>Transaction History</h3>
      </Box>

      {loading ? (
        <Center style={{ height: "200px" }}>
          <Loader />
        </Center>
      ) : (
        <>
          <Table verticalSpacing="sm">
            <Table.Tbody>
              {paginated.length > 0 ? (
                paginated.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td id={classes.TableName}>
                      {/* <Text fw={500} className={classes.name}> */}
                        {item.categories?.name || "Unknown"}
                      {/* </Text> */}
                      <Text fz="sm" c="dimmed" className={classes.note}>
                        {item.note}
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text
                        c={item.transaction_type === "Income" ? "teal" : "red"}
                        fw={500}
                      >
                        {item.amount.toLocaleString()}$
                      </Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: "right" }}>
                      <Text fz="xs" c="dimmed">
                        {item.date}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text p="md" c="dimmed" ta="center">
                      There isn’t any transaction recorded for this period yet.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>

          {finalFilteredTransactions.length > itemsPerPage && (
            <Center className={classes.pagination}>
              <Pagination
                value={page}
                onChange={setPage}
                total={Math.ceil(
                  finalFilteredTransactions.length / itemsPerPage
                )}
                mt="md"
                size="sm"
                radius="xl"
              />
            </Center>
          )}
        </>
      )}
    </Box>
  );
};
