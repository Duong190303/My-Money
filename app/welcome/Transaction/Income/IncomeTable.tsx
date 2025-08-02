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
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "../transaction.module.css";
import { supabase } from "../../../supabase";

type Transaction = {
  id: number;
  id_user: string;
  id_cate: number;
  amount: number;
  note: string;
  date: string;
  categories: { name: string; id_type: number };
};

// Đổi tên để rõ ràng hơn, và nhận props từ component cha
type IncomeTableProps = {
  onRowClick: (transaction: Transaction) => void;
};

export const IncomeTable: React.FC<IncomeTableProps> = ({ onRowClick }) => {
  const [userId, setUserId] = useState<string>("");
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // Lưu tất cả giao dịch của user
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>(
    []
  ); // Giao dịch để hiển thị (đã lọc và phân trang)
  const [search, setSearch] = useState("");
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // 1. Lấy thông tin user hiện tại
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getCurrentUser();
  }, []);

  // 2. Fetch tất cả giao dịch của user một lần khi có userId
  useEffect(() => {
    if (!userId) return;

    const fetchAllTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, categories (name, id_type)`)
        .eq("id_user", userId)
        .order("date", { ascending: false }); // Sắp xếp sẵn

      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }

      const incomeTransactions = (data || []).filter(
        (tran) => tran.categories?.id_type === 11111
      );
      setAllTransactions(incomeTransactions);
    };

    fetchAllTransactions();
  }, [userId]);

  // 3. Lọc và phân trang dữ liệu mỗi khi data gốc, search, hoặc page thay đổi
  useEffect(() => {
    let filtered = allTransactions;

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = allTransactions.filter(
        (transaction) =>
          transaction.categories?.name.toLowerCase().includes(searchTerm) ||
          transaction.note.toLowerCase().includes(searchTerm) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.date.includes(searchTerm)
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));

    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setSortedTransactions(filtered.slice(start, end));
  }, [allTransactions, search, activePage]);

  return (
    <Box id={classes.incomeContainer2}>
      <Box id={classes.incomeText}>
        <TextInput
          id={classes.searchInput}
          leftSection={<IconSearch size={16} stroke={1.5} />}
          placeholder="Search for transactions by category, note,..."
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1); // Reset về trang 1 khi tìm kiếm
          }}
        />
        <Table
          id={classes.transactionTable}
          horizontalSpacing="md"
          verticalSpacing="xs"
          layout="fixed"
        >
          <TableThead className={classes.tableHeader}>
            <TableTr>
              <TableTd>Catelogies</TableTd>
              <TableTd>Date</TableTd>
              <TableTd>Amount</TableTd>
              <TableTd>Note</TableTd>
            </TableTr>
          </TableThead>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <TableTbody>
                {/* SỬA LỖI: Kiểm tra sortedTransactions thay vì transactions */}
                {/* sortedTransactions.map((transaction) => ( */}
                <TableTr
                  // SỬA BUG: Key phải là duy nhất, dùng transaction.id
                  key={transaction.id}
                  onClick={() => onRowClick(transaction)}
                  className={classes.tableRow} // Thêm class để có hiệu ứng hover
                >
                  <TableTd>{transaction.categories?.name ?? "N/A"}</TableTd>
                  <TableTd>
                    {new Date(transaction.date).toLocaleDateString("vi-VN")}
                  </TableTd>
                  <TableTd>
                    {transaction.amount.toLocaleString("vi-VN")} $
                  </TableTd>
                  <TableTd>{transaction.note}</TableTd>
                </TableTr>
              </TableTbody>
            ))
          ) : (
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
          )}
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
