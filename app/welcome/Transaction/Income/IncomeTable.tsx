"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Text,
  TextInput,
  Box,
  Pagination,
  TableCaption,
  TableThead,
  TableTr,
  TableTbody,
  TableTd,
  Popover,
  ThemeIcon,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "../transaction.module.css";
import { type Transaction } from "../TransactionSevice/IncomeService";

type IncomeTableProps = {
  transactions: Transaction[];
  onRowClick: (transaction: Transaction) => void;
};

export const IncomeTable: React.FC<IncomeTableProps> = ({
  transactions,
  onRowClick,
}) => {
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [activePage, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const filtered = transactions.filter((tran) => {
      const searchLower = search.toLowerCase();
      return (
        tran.note?.toLowerCase().includes(searchLower) ||
        tran.categories?.name?.toLowerCase().includes(searchLower) ||
        tran.amount.toString().includes(searchLower) ||
        tran.date.toString().includes(searchLower) ||
        tran.id.toString().includes(searchLower)
      );
    });

    const total = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(total);

    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setSortedTransactions(filtered.slice(start, end));
  }, [transactions, search, activePage, itemsPerPage]); // CHANGED: Phụ thuộc vào `transactions`

  return (
    <Box id={classes.incomeContainer2}>
      <Box id={classes.incomeText}>
        <Popover
          classNames={{ dropdown: classes.popoverDropdown }}
          position="right"
        >
          <Popover.Target>
            <ThemeIcon
              className={classes.searchIcon}
              variant="transparent"
              radius={"md"}
              size="lg"
            >
              <IconSearch size={25} stroke={1.5} color={"white"} />
            </ThemeIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <TextInput
              id={classes.searchInput}
              variant="transparent"
              placeholder="Search for transactions by category, note,..."
              value={search}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setPage(1);
              }}
            />
          </Popover.Dropdown>
        </Popover>

        <Table
          id={classes.transactionTable}
          horizontalSpacing="md"
          verticalSpacing="xs"
          layout="fixed"
        >
          <TableThead className={classes.tableHeader}>
            <TableTr>
              <TableTd>Categories</TableTd>
              <TableTd>Date</TableTd>
              <TableTd>Amount</TableTd>
              <TableTd>Note</TableTd>
            </TableTr>
          </TableThead>

          <TableTbody>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <TableTr
                  key={transaction.id}
                  // CHANGED: Gọi hàm onRowClick từ props, truyền transaction lên cho cha
                  onClick={() => onRowClick(transaction)}
                  className={classes.tableRow}
                  style={{ cursor: "pointer" }}
                >
                  <TableTd className={classes.categoryText}>
                    {transaction.categories?.name ?? "N/A"}
                  </TableTd>
                  <TableTd>
                    {new Date(transaction.date).toLocaleDateString("vi-VN")}
                  </TableTd>
                  <TableTd>
                    {transaction.amount.toLocaleString("vi-VN")} $
                  </TableTd>
                  <TableTd className={classes.noteText}>
                    {transaction.note}
                  </TableTd>{" "}
                </TableTr>
              ))
            ) : (
              <TableTr>
                <TableTd colSpan={4}>
                  <TableCaption
                    className={classes.noTransactionCaption}
                    w={{
                      base: "400px",
                      sm: "430px",
                      md: "490px",
                      lg: "490px",
                      xl: "650px",
                      xxl: "650px",
                    }}
                    h={{
                      base: "350px",
                      xs: "300px",
                      sm: "300px",
                      md: "300px",
                      lg: "300px",
                      xl: "350px",
                      xxl: "350px",
                    }}
                  >
                    <Text
                      span
                      c={"white"}
                      classNames={{
                        root: classes.noTransactionText,
                      }}
                    >
                      No transaction has been recorded!
                    </Text>
                  </TableCaption>
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      </Box>

      {totalPages > 1 && (
        <Box id={classes.paginationContainer}>
          <Pagination
            value={activePage}
            onChange={setPage}
            total={totalPages}
            size="sm"
            color="teal"
            radius="md"
          />
        </Box>
      )}
    </Box>
  );
};
