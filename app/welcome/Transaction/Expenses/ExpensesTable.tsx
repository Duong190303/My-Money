// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   Text,
//   TextInput,
//   Box,
//   Pagination,
//   TableCaption,
//   TableThead,
//   TableTr,
//   TableTbody,
//   TableTd,
// } from "@mantine/core";
// import { IconSearch } from "@tabler/icons-react";
// import classes from "../transaction.module.css";
// import {
//   getCurrentUserId,
//   fetchIncomeTransactions,
//   type Transaction,
// } from "../TransactionSevice/IncomeService";

// type IncomeTableProps = {
//   onRowClick: (transaction: Transaction) => void;
// };

// export const IncomeTable: React.FC<IncomeTableProps> = ({ onRowClick }) => {
//   const [userId, setUserId] = useState<string>("");
//   const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
//   const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>(
//     []
//   );
//   const [search, setSearch] = useState("");
//   const [activePage, setPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [amount, setAmount] = useState<string>("");
//   const [note, setNote] = useState<string>("");
//   const [date, setDate] = useState<Date | null>(null);
//   const [editingTransactionId, setEditingTransactionId] = useState<
//     number | null
//   >(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const userId = await getCurrentUserId();
//       if (!userId) return;
//       setUserId(userId);
//       const transactions = await fetchIncomeTransactions(userId);
//       setAllTransactions(transactions);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filtered = allTransactions.filter((tran) => {
//       const searchLower = search.toLowerCase();
//       return (
//         tran.note?.toLowerCase().includes(searchLower) ||
//         tran.categories?.name?.toLowerCase().includes(searchLower)
//       );
//     });

//     const total = Math.ceil(filtered.length / itemsPerPage);
//     setTotalPages(total);

//     const start = (activePage - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     setSortedTransactions(filtered.slice(start, end));
//   }, [allTransactions, search, activePage, itemsPerPage]);

//   const handleRowClick = (transaction: Transaction) => {
//     setSelectedCategory(transaction.id_cate.toString());
//     setAmount(transaction.amount.toString());
//     setNote(transaction.note || "");
//     setDate(new Date(transaction.date));
//     setEditingTransactionId(transaction.id);
//   };
//   return (
//     <Box id={classes.incomeContainer2}>
//       <Box id={classes.incomeText}>
//         <TextInput
//           id={classes.searchInput}
//           leftSection={<IconSearch size={16} stroke={1.5} />}
//           placeholder="Search for transactions by category, note,..."
//           value={search}
//           onChange={(event) => {
//             setSearch(event.currentTarget.value);
//             setPage(1);
//           }}
//         />

//         <Table
//           id={classes.transactionTable}
//           horizontalSpacing="md"
//           verticalSpacing="xs"
//           layout="fixed"
//         >
//           <TableThead className={classes.tableHeader}>
//             <TableTr>
//               <TableTd>Categories</TableTd>
//               <TableTd>Date</TableTd>
//               <TableTd>Amount</TableTd>
//               <TableTd>Note</TableTd>
//             </TableTr>
//           </TableThead>

//           <TableTbody>
//             {sortedTransactions.length > 0 ? (
//               sortedTransactions.map((transaction) => (
//                 <TableTr
//                   key={transaction.id}
//                   onClick={handleRowClick.bind(null, transaction)}
//                   className={classes.tableRow}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <TableTd>{transaction.categories?.name ?? "N/A"}</TableTd>
//                   <TableTd>
//                     {new Date(transaction.date).toLocaleDateString("vi-VN")}
//                   </TableTd>
//                   <TableTd>
//                     {transaction.amount.toLocaleString("vi-VN")} $
//                   </TableTd>
//                   <TableTd>{transaction.note}</TableTd>
//                 </TableTr>
//               ))
//             ) : (
//               <TableTr>
//                 <TableTd colSpan={4}>
//                   <TableCaption
//                     className={classes.noTransactionCaption}
//                     w={{
//                       base: "400px",
//                       sm: "430px",
//                       md: "490px",
//                       lg: "490px",
//                       xl: "650px",
//                       xxl: "650px",
//                     }}
//                     h={{
//                       base: "350px",
//                       xs: "300px",
//                       sm: "300px",
//                       md: "300px",
//                       lg: "300px",
//                       xl: "350px",
//                       xxl: "350px",
//                     }}
//                   >
//                     <Text
//                       span
//                       c={"white"}
//                       classNames={{
//                         root: classes.noTransactionText,
//                       }}
//                     >
//                       No transaction has been recorded!
//                     </Text>
//                   </TableCaption>
//                 </TableTd>
//               </TableTr>
//             )}
//           </TableTbody>
//         </Table>
//       </Box>

//       {totalPages > 1 && (
//         <Box id={classes.paginationContainer}>
//           <Pagination
//             value={activePage}
//             onChange={setPage}
//             total={totalPages}
//             size="sm"
//             color="teal"
//             radius="md"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };
// IncomeTable.tsx
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
import { type Transaction } from "../TransactionSevice/IncomeService";

// CHANGED: Cập nhật props
type IncomeTableProps = {
  transactions: Transaction[];
  onRowClick: (transaction: Transaction) => void;
};

export const ExpensesTable: React.FC<IncomeTableProps> = ({
  transactions,
  onRowClick,
}) => {
  // REMOVED: Xóa state và logic fetch data không cần thiết nữa
  // const [userId, setUserId] = useState<string>("");
  // const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [activePage, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // REMOVED: Xóa các state không cần thiết vì chúng không thuộc về component này
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // ... và các state khác

  // REMOVED: Xóa useEffect fetch data
  // useEffect(() => { ... });

  // CHANGED: Lọc và phân trang dựa trên prop `transactions` từ cha
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

  // REMOVED: Xóa hàm handleRowClick cục bộ
  // const handleRowClick = (transaction: Transaction) => { ... };

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
            setPage(1);
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
<TableTd>{transaction.categories?.name ?? "N/A"}</TableTd>
                 <TableTd>
                    {new Date(transaction.date).toLocaleDateString("vi-VN")}
                   </TableTd>
                  <TableTd>
                     {transaction.amount.toLocaleString("vi-VN")} $
                   </TableTd>
                   <TableTd>{transaction.note}</TableTd>                </TableTr>
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