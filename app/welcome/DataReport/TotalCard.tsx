// // src/components/TotalCard.tsx

// "use client";

// import React from "react";
// import { Box, Text, Loader } from "@mantine/core";
// import { DatePickerInput } from "@mantine/dates";
// import classes from "./Datareport.module.css";

// // Định nghĩa các props mà component này cần để hoạt động
// interface TotalCardProps {
//   selectFullDate: Date | null;
//   onDateChange: (date: Date | null) => void;
//   totalIncome: number;
//   totalExpenses: number;
//   balance: number;
//   loading: boolean;
// }

// export const TotalCard: React.FC<TotalCardProps> = ({
//   selectFullDate,
//   onDateChange,
//   totalIncome,
//   totalExpenses,
//   balance,
//   loading,

// }) => {
//   return (
//     <Box className={`${classes.total} ${classes.box}`}>
//       <DatePickerInput
//         value={selectFullDate}
//         onChange={onDateChange} // Gọi hàm từ props khi ngày thay đổi
//         placeholder="Select date"
//         maw={300}
//       />

//       {/* Hiển thị Loader khi component cha đang tải dữ liệu */}
//       {loading ? (
//         <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
//             <Loader />
//         </Box>
//       ) : (
//         <>
//           <Text component="p" mt="md" fw={500}>
//             Total Balance: {balance.toLocaleString()}$
//           </Text>

//           <Box className={classes.incomeExpense}>
//             {totalIncome > 0 && (
//               <Box className={classes.income}>
//                 Income
//                 <br />
//                 {totalIncome.toLocaleString()}$
//               </Box>
//             )}

//             {totalExpenses > 0 && (
//               <Box className={classes.expense}>
//                 Expenses
//                 <br />
//                 {totalExpenses.toLocaleString()}$
//               </Box>
//             )}
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };
// src/components/TotalCard.tsx

"use client";

import React from "react";
import { Box, Text, Loader, Center } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import classes from "./Datareport.module.css";

interface TotalCardProps {
  selectFullDate: Date | null;
  onDateChange: (date: Date | null) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  loading: boolean;
  transactionType: "All" | "Income" | "Expenses";
}

export const TotalCard: React.FC<TotalCardProps> = ({
  selectFullDate,
  onDateChange,
  totalIncome,
  totalExpenses,
  balance,
  loading,
  transactionType,
}) => {
  return (
    <Box className={`${classes.total} ${classes.box}`}>
      <DatePickerInput
        value={selectFullDate}
        onChange={onDateChange}
        placeholder="Select date"
        maw={300}
      />

      {loading ? (
        <Center style={{ height: '100px' }}>
          <Loader />
        </Center>
      ) : (
        <>
          {/* Phần hiển thị tiêu đề tổng */}
          <Text component="p" mt="md" fw={500}>
            {transactionType === "All" && `Total Balance: ${balance.toLocaleString()}$`}
            {transactionType === "Income" && `Total Income: ${totalIncome.toLocaleString()}$`}
            {transactionType === "Expenses" && `Total Expenses: ${totalExpenses.toLocaleString()}$`}
          </Text>

          {/* Logic hiển thị chi tiết Income và Expense */}
          <Box className={classes.incomeExpense}>
            {/* Hiển thị Income khi:
            1. transactionType là "All" (và có dữ liệu)
            2. transactionType là "Income" (và có dữ liệu) */}
            {(transactionType === "All" || transactionType === "Income") && totalIncome > 0 && (
              <Box className={classes.income}>
                <Text className={classes.incomeText}>Income</Text>
                <Box component={"br"} />
                {totalIncome.toLocaleString()}$
              </Box>
            )}

            {/* Hiển thị Expenses khi:
            1. transactionType là "All" (và có dữ liệu)
            2. transactionType là "Expenses" (và có dữ liệu) */}
            {(transactionType === "All" || transactionType === "Expenses") && totalExpenses > 0 && (
              <Box className={classes.expense}>
                <Text className={classes.expenseText}>Expenses</Text>
                <Box component={"br"} />
                {totalExpenses.toLocaleString()}$
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};