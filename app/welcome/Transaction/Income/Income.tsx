// import { HeaderPage } from "../../Header/HeaderPage";
// import { Box } from "@mantine/core";
// import classes from "../transaction.module.css";
// import { IncomeTable } from "./IncomeTable";
// import { TableTranIncome } from "./TableTranIncome";

// export default function Income() {
//   const handleRowClick = (transaction: any) => {
//     console.log("Row clicked:", transaction);
//   };
//   return (
//     <Box className={classes.incomeBackground}>
//       <HeaderPage />
//       <Box id={classes.incomeContainer}>
//         <IncomeTable onRowClick={handleRowClick} />
//         <Box className={classes.incomeContainer1} />
//         <TableTranIncome />
//       </Box>
//     </Box>
//   );
// }
// Income.tsx
"use client"; // ADDED: Cần có "use client" vì component này bây giờ sử dụng hooks

import { useState, useEffect } from "react"; // ADDED
import { HeaderPage } from "../../Header/HeaderPage";
import { Box } from "@mantine/core";
import classes from "../transaction.module.css";
import { IncomeTable } from "./IncomeTable";
import { TableTranIncome } from "./TableTranIncome";
import {
  fetchIncomeTransactions,
  getCurrentUserId,
  type Transaction,
} from "../TransactionSevice/IncomeService"; // ADDED

export default function Income() {
  // ADDED: State được nâng cấp lên component cha
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // ADDED: Hàm để tải lại danh sách giao dịch, sẽ được truyền xuống form
  const refreshTransactions = async () => {
    const userId = await getCurrentUserId();
    if (userId) {
      const data = await fetchIncomeTransactions(userId);
      setTransactions(data);
    }
  };

  // ADDED: Tải dữ liệu lần đầu khi component được render
  useEffect(() => {
    refreshTransactions();
  }, []);

  // ADDED: Hàm này sẽ được truyền xuống IncomeTable.
  // Khi một hàng được click, nó cập nhật state ở đây.
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // ADDED: Hàm để xóa lựa chọn, reset form
  const handleClearSelection = () => {
    setSelectedTransaction(null);
  }

  return (
    <Box className={classes.incomeBackground}>
      <HeaderPage />
      <Box id={classes.incomeContainer}>
        {/* CHANGED: Truyền props mới xuống các component con */}
        <IncomeTable transactions={transactions} onRowClick={handleRowClick} />
        <Box className={classes.incomeContainer1} />
        <TableTranIncome
          selectedTransaction={selectedTransaction}
          onDataChange={refreshTransactions}
          onClear={handleClearSelection}
        />
      </Box>
    </Box>
  );
}