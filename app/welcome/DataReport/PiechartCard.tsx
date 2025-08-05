// // src/components/PieChartCard.tsx

// "use client";

// import React from "react";
// import { Box, Select, Text, Loader } from "@mantine/core";
// import { PieChart } from "@mantine/charts";
// import classes from "./Datareport.module.css";

// // Định nghĩa kiểu dữ liệu cho props mà component này sẽ nhận
// interface PieChartCardProps {
//   pieChartData: { name: string; value: number; color: string }[];
//   transactionType: "All" | "Income" | "Expenses";
//   onTransactionTypeChange: (value: "All" | "Income" | "Expenses") => void;
//   loading: boolean; // Thêm prop loading
// }

// export const PieChartCard: React.FC<PieChartCardProps> = ({
//   pieChartData,
//   transactionType,
//   onTransactionTypeChange,
//   loading, // Nhận prop loading
// }) => {
//   return (
//     <Box className={classes.piechart + " " + classes.box}>
//       <Select
//         value={transactionType}
//         // Khi người dùng thay đổi lựa chọn, gọi hàm được truyền vào qua props
//         onChange={(val) =>
//           onTransactionTypeChange(
//             (val as "All" | "Income" | "Expenses") || "All"
//           )
//         }
//         data={[
//           { value: "All", label: "All" },
//           { value: "Income", label: "Income" },
//           { value: "Expenses", label: "Expenses" },
//         ]}
//         placeholder="Transaction Type"
//         maw={200}
//         mb="md"
//       />
//       {loading ? (
//         <Box
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "190px",
//           }}
//         >
//           <Loader />
//         </Box>
//       ) : pieChartData.length > 0 ? (
//         <PieChart
//           data={pieChartData}
//           withLabelsLine
//           withTooltip
//           size={190}
//           strokeColor="#fff"
//           tooltipDataSource="segment"
//         />
//       ) : (
//         <Text p="md" ta="center">
//           There isn’t any transaction recorded for this period yet.
//         </Text>
//       )}
//     </Box>
//   );
// };
// src/components/PieChartCard.tsx

"use client";

import React from "react";
import { Box, Select, Text, Loader, Center } from "@mantine/core";
import { PieChart } from "@mantine/charts";
import classes from "./Datareport.module.css";

interface PieChartCardProps {
  pieChartData: { name: string; value: number; color: string }[];
  transactionType: "All" | "Income" | "Expenses";
  onTransactionTypeChange: (value: "All" | "Income" | "Expenses") => void;
  loading: boolean;
}

export const PieChartCard: React.FC<PieChartCardProps> = ({
  pieChartData,
  transactionType,
  onTransactionTypeChange,
  loading,
}) => {
  return (
    <Box className={classes.piechart + " " + classes.box}>
      <Select
        value={transactionType}
        onChange={(val) =>
          onTransactionTypeChange(
            (val as "All" | "Income" | "Expenses") || "All"
          )
        }
        data={[
          { value: "All", label: "All" },
          { value: "Income", label: "Income" },
          { value: "Expenses", label: "Expenses" },
        ]}
        placeholder="Transaction Type"
        maw={200}
        mb="md"
      />
      {loading ? (
        <Center style={{ height: "190px" }}>
          <Loader />
        </Center>
      ) : pieChartData.length > 0 ? (
        <PieChart
          data={pieChartData}
          withLabelsLine
          withTooltip
          size={190}
          strokeColor="#fff"
          tooltipDataSource="segment"
        />
      ) : (
        <Text p="md" ta="center">
          There isn’t any transaction recorded for this period yet.
        </Text>
      )}
    </Box>
  );
};
