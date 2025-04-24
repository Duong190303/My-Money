import { Header } from "./Header";
import { DatePickerInput } from "@mantine/dates";
import "./Style/Datareport.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { PieChart, AreaChart, BarChart } from "@mantine/charts";
import { Select } from "@mantine/core";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);
import { Table, Text } from "@mantine/core";

type transaction = {
  id: number;
  categories: { name: string; id_type: number };
  amount: number;
  color: string;
  id_cate: number;
  id_type: number;
  transaction_type: string;
  date: string;
  created_at: string;
  note: string;
};
export default function TransactionPieChart() {
  if (typeof window === "undefined") return null;

  const [userId, setUserId] = useState<string>("");
  const [timeRange, setTimeRange] = useState("week");
  const [selectFullDate, setSelectFullDate] = useState<Date | null>(new Date());

  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [areaChartData, setAreaChartData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<
    "All" | "Income" | "Expenses"
  >("All");

  const [transactions, setTransactions] = useState<transaction[]>([]);
  const [latestTransactions, setLatest] = useState<transaction[]>([]);

  // User
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("No User!", error.message);
      } else if (user) {
        setUserId(user.id);
        console.log("User ID:", user.id);
      }
    }

    getCurrentUser();
  }, []);
  // Pie Chart
  useEffect(() => {
    if (transactions.length === 0) return;

    const grouped = new Map<string, number>();

    transactions.forEach((t) => {
      const name = t.categories?.name || "Unknown";
      const prev = grouped.get(name) || 0;
      grouped.set(name, prev + t.amount);
    });

    const chartData = Array.from(grouped.entries()).map(([name, value]) => ({
      name,
      value,
      color: randomColor(name),
      // color: randomColor(
      //   name,
      //   transactionType === "Income"
      //     ? "income"
      //     : transactionType === "Expenses"
      //     ? "expense"
      //     : "all"
      // ),
    }));

    setPieChartData(chartData);
  }, [transactions]);
  // useEffect(() => {
  //   if (transactions.length === 0) return;
  
  //   const grouped = new Map<
  //     string,
  //     { total: number; type: "income" | "expense" }
  //   >();
  
  //   transactions.forEach((t) => {
  //     const name = t.categories?.name || "Unknown";
  //     const type = t.transaction_type === "income" ? "income" : "expense";
  //     const existing = grouped.get(name);
  //     if (existing) {
  //       existing.total += t.amount;
  //     } else {
  //       grouped.set(name, { total: t.amount, type });
  //     }
  //   });
  
  //   const chartData = Array.from(grouped.entries()).map(([name, { total, type }]) => ({
  //     name,
  //     value: total,
  //     color: randomColor(
  //       name,
  //       transactionType === "Income"
  //         ? "income"
  //         : transactionType === "Expenses"
  //         ? "expense"
  //         : "all",
  //       type // actualType
  //     ),
  //   }));
  
  //   setPieChartData(chartData);
  // }, [transactions, transactionType]);
  

  useEffect(() => {
    if (!userId || !selectFullDate) return;

    const fetchTransactions = async () => {
      const selectedMonth = dayjs(selectFullDate).month() + 1;
      const selectedYear = dayjs(selectFullDate).year();

      let query = supabase
        .from("transactions")
        .select("amount, transaction_type, date, categories(name, id_type)")
        .eq("id_user", userId);

      if (transactionType !== "All") {
        query = query.eq("transaction_type", transactionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Transaction fetch error:", error.message);
        return;
      }

      const filtered = (data as any[]).filter((item) => {
        const d = dayjs(item.date);
        const selected = dayjs(selectFullDate);

        if (timeRange === "Week") {
          return d.week() === selected.week() && d.year() === selected.year();
        }

        if (timeRange === "Month") {
          return d.month() === selected.month() && d.year() === selected.year();
        }

        if (timeRange === "Year") {
          return d.year() === selected.year();
        }

        return d.isSame(selected, "day");
      });

      setTransactions(filtered);
    };

    fetchTransactions();
  }, [userId, selectFullDate, transactionType, timeRange]);

  // Area Chart
  useEffect(() => {
    if (transactions.length === 0) return;

    let grouped: Record<string, { Income: number; Expenses: number }> = {};

    transactions.forEach((item) => {
      const d = dayjs(item.date);
      let label = "";

      if (timeRange === "Week") {
        // Gom theo từng ngày trong tuần
        label = d.format("YYYY-MM-DD"); // mỗi ngày riêng
      } else if (timeRange === "Month") {
        // Gom theo từng tuần trong tháng
        const week = d.week() - dayjs(d).startOf("month").week() + 1;
        label = `Week ${week} - ${d.format("MMM YYYY")}`;
      } else if (timeRange === "Year") {
        // Gom theo từng tháng trong năm
        label = d.format("MMM YYYY"); // Jan 2025, Feb 2025...
      } else {
        label = d.format("YYYY-MM-DD");
      }

      if (!grouped[label]) {
        grouped[label] = { Income: 0, Expenses: 0 };
      }

      if (item.transaction_type === "Income") {
        grouped[label].Income += item.amount;
      } else if (item.transaction_type === "Expenses") {
        grouped[label].Expenses += item.amount;
      }
    });

    const formatted = Object.entries(grouped)
      .map(([date, values]) => ({
        date,
        ...values,
      }))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    setAreaChartData(formatted);
  }, [transactions, timeRange]);

  const totalIncome = transactions
    .filter((t) => t.transaction_type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === "Expenses")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleTimeRangeChange = (val: any) => {
    setTimeRange(val);
  };
  // const ChartData = [
  //   { date: "2025-04-20", Income: 300, Expenses: 200 },
  //   { date: "2025-04-21", Income: 200, Expenses: 400 },
  //   { date: "2025-04-22", Income: 150, Expenses: 500 },
  //   { date: "2025-04-23", Income: 400, Expenses: 250 },
  // ];
  // transaction history

  useEffect(() => {
    if (!userId) return;

    const fetchLatestTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(name)")
        .eq("id_user", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching latest transactions:", error.message);
      } else {
        setLatest((data as never[]) || []);
      }
    };

    fetchLatestTransactions();
  }, [userId]);

  return (
    <div className="datareport-background">
      <Header />

      <main className="datareport-container">
        <div className="box piechart">
          <Select
            id="select-piechart"
            // styles={{ input: { backgroundColor: "#aad0d7", border: "none" } }}
            value={transactionType}
            onChange={(val) =>
              setTransactionType(val as "All" | "Income" | "Expenses")
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

          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              withLabelsLine
              withTooltip
              size={220}
              strokeColor="#fff"
              tooltipDataSource="segment"
            />
          ) : (
            <p>Không có dữ liệu trong ngày này.</p>
          )}
        </div>
        <div className="box total">
          <DatePickerInput
            id="select-full-date"
            value={selectFullDate}
            onChange={setSelectFullDate}
            placeholder="Select date range"
            mx="auto"
            maw={300}
          />

          <p>Total Balance: {balance}$</p>

          <div className="income-expense">
            {totalIncome > 0 && (
              <div className="income">
                income
                <br />
                {totalIncome}$
              </div>
            )}

            {totalExpenses > 0 && (
              <div className="expense">
                expenses
                <br />
                {totalExpenses}$
              </div>
            )}
          </div>
        </div>
        <div className="box history">
          <h3 className="title">TRANSACTION HISTORY</h3>
          <Table>
            {transactions.length > 0 ? (
              latestTransactions.map((item) => (
                <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text>{item.categories?.name}</Text>
                      <Text style={{ fontSize: "12px" }}>{item.note}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        style={{
                          color:
                            item.transaction_type === "Income"
                              ? "green"
                              : "red",
                          width: "100px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {item.amount}$
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{item.date}</Text>
                    </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Text>
                There isn’t any transaction recorded for this period yet.
              </Text>
            )}
          </Table>
        </div>
        <div className="box chart">
          <Select
            // styles={{ input: { backgroundColor: "#b8dfe6", border: "none" } }}
            placeholder="Time Range"
            defaultValue="Week"
            value={timeRange}
            onChange={handleTimeRangeChange}
            data={[
              { value: "Week", label: "Week" },
              { value: "Month", label: "Month" },
              { value: "Year", label: "Year" },
            ]}
            maw={200}
            mb="md"
          />

          {areaChartData.length > 0 ? (
            <BarChart
              h={250}
              data={areaChartData}
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
            <p>Không có dữ liệu trong khoảng thời gian đã chọn.</p>
          )}
        </div>
      </main>
    </div>
  );
}
// Hàm tạo màu ngẫu nhiên dựa trên tên
function randomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;

}

// function randomColor(name: string, type: "income" | "expense" | "all") {
//   name: string,
//   type: "income" | "expense" | "all",
//   actualType?: "income" | "expense"
// ) {
//   const warmColors = [
//     "#FF6B6B", "#FF8C42", "#FFA94D", "#FFC857", "#FF9A9E", "#FFD1A9",
//   ];
//   const coolColors = [
//     "#6BCB77", "#4D96FF", "#A1C4FD", "#C2E9FB", "#B5EAD7", "#D0F4FF",
//   ];

//   const targetColors =
//     type === "all"
//       ? actualType === "income"
//         ? coolColors
//         : warmColors
//       : type === "income"
//       ? coolColors
//       : warmColors;

//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   const index = Math.abs(hash) % targetColors.length;
//   return targetColors[index];
// }
// import { Header } from "./Header";
// import { DatePickerInput } from "@mantine/dates";
// import "./Style/Datareport.css";
// import { useEffect, useState } from "react";
// import { supabase } from "../supabase";
// import { PieChart, AreaChart } from "@mantine/charts";
// import { Select } from "@mantine/core";
// import dayjs from "dayjs";
// import weekOfYear from "dayjs/plugin/weekOfYear";
// dayjs.extend(weekOfYear);

// type Transaction = {
//   categories: { name: string; id_type: number };
//   amount: number;
//   transaction_type: string;
//   date: string;
// };

// export default function TransactionPieChart() {
//   const [userId, setUserId] = useState<string>("");
//   const [timeRange, setTimeRange] = useState("Week");
//   const [selectFullDate, setSelectFullDate] = useState<Date | null>(new Date());
//   const [transactionType, setTransactionType] = useState<
//     "Income" | "Expenses" | "All"
//   >("Income");
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [pieChartData, setPieChartData] = useState<any[]>([]);
//   const [areaChartData, setAreaChartData] = useState<any[]>([]);

//   // Get User ID
//   useEffect(() => {
//     (async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();
//       if (user) setUserId(user.id);
//       else if (error) console.error("No user!", error.message);
//     })();
//   }, []);

//   // Fetch Transactions
//   useEffect(() => {
//     if (!userId || !selectFullDate) return;

//     const fetchTransactions = async () => {
//       let query = supabase
//         .from("transactions")
//         .select("amount, transaction_type, date, categories(name, id_type)")
//         .eq("id_user", userId);

//       if (transactionType !== "All") {
//         query = query.eq("transaction_type", transactionType);
//       }

//       const { data, error } = await query;

//       if (error) {
//         console.error("Transaction fetch error:", error.message);
//         return;
//       }

//       const selected = dayjs(selectFullDate);
//       const filtered = data
//         .map((item) => ({
//           amount: item.amount,
//           transaction_type: item.transaction_type,
//           date: item.date,
//           categories: item.categories[0], // assuming there's only one category per transaction
//         }))
//         .filter((item) => {
//           const d = dayjs(item.date);
//           if (timeRange === "Week")
//             return d.week() === selected.week() && d.year() === selected.year();
//           if (timeRange === "Month")
//             return (
//               d.month() === selected.month() && d.year() === selected.year()
//             );
//           if (timeRange === "Year") return d.year() === selected.year();
//           return d.isSame(selected, "day");
//         });
//       setTransactions(filtered);
//     };

//     fetchTransactions();
//   }, [userId, selectFullDate, transactionType, timeRange]);

//   // Generate Pie Chart Data
//   useEffect(() => {
//     if (transactions.length === 0) return;

//     const grouped = new Map<string, number>();
//     transactions.forEach((t) => {
//       const name = t.categories?.name || "Unknown";
//       grouped.set(name, (grouped.get(name) || 0) + t.amount);
//     });

//     const chartData = Array.from(grouped.entries()).map(([name, value]) => ({
//       name,
//       value,
//       color: randomColor(name),
//     }));

//     setPieChartData(chartData);
//   }, [transactions]);

//   // Generate Area Chart Data
//   useEffect(() => {
//     if (transactions.length === 0) return;

//     const formatLabel = (date: string) => {
//       const d = dayjs(date);
//       if (timeRange === "Week") return `W${d.week()}-${d.year()}`;
//       if (timeRange === "Month") return d.format("MMM YYYY");
//       if (timeRange === "Year") return d.format("YYYY");
//       return d.format("YYYY-MM-DD");
//     };

//     const grouped: Record<string, { Income: number; Expenses: number }> = {};

//     transactions.forEach((item) => {
//       const label = formatLabel(item.date);

//       // Đảm bảo transaction_type luôn đúng
//       const type = item.transaction_type;
//       if (type !== "Income" && type !== "Expenses") {
//         console.warn("Unknown transaction type:", type, item);
//         return; // bỏ qua các loại không hợp lệ
//       }

//       if (!grouped[label]) {
//         grouped[label] = { Income: 0, Expenses: 0 };
//       }

//       grouped[label][type] += item.amount;
//     });

//     setAreaChartData(
//       Object.entries(grouped).map(([date, values]) => ({ date, ...values }))
//     );
//   }, [transactions, timeRange]);

//   const totalIncome = transactions
//     .filter((t) => t.transaction_type === "Income")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const totalExpenses = transactions
//     .filter((t) => t.transaction_type === "Expenses")
//     .reduce((sum, t) => sum + t.amount, 0);
//   const balance = totalIncome - totalExpenses;

//   return (
//     <div className="datareport-background">
//       <Header />

//       <main className="datareport-container">
//         <div className="box piechart">
//           <Select
//             id="select-piechart"
//             value={transactionType}
//             onChange={(val) => setTransactionType(val as any)}
//             data={[
//               { value: "Income", label: "Income" },
//               { value: "Expenses", label: "Expenses" },
//               { value: "All", label: "All" },
//             ]}
//             placeholder="Transaction Type"
//             maw={200}
//             mb="md"
//           />

//           {pieChartData.length > 0 ? (
//             <PieChart
//               data={pieChartData}
//               withLabelsLine
//               withTooltip
//               size={220}
//               strokeColor="#fff"
//               tooltipDataSource="segment"
//             />
//           ) : (
//             <p>Không có dữ liệu trong ngày này.</p>
//           )}
//         </div>

//         <div className="box total">
//           <DatePickerInput
//             id="select-full-date"
//             value={selectFullDate}
//             onChange={setSelectFullDate}
//             placeholder="Select date"
//             mx="auto"
//             maw={300}
//           />

//           <p>Total Balance: {balance}$</p>

//           <div className="income-expense">
//             {totalIncome > 0 && (
//               <div className="income">
//                 income
//                 <br />
//                 {totalIncome}$
//               </div>
//             )}
//             {totalExpenses > 0 && (
//               <div className="expense">
//                 expenses
//                 <br />
//                 {totalExpenses}$
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="box chart">
//           <Select
//             value={timeRange}
//             onChange={(val) => setTimeRange(val!)}
//             data={[
//               { value: "Week", label: "Week" },
//               { value: "Month", label: "Month" },
//               { value: "Year", label: "Year" },
//             ]}
//             maw={200}
//             mb="md"
//             styles={{ input: { backgroundColor: "#b8dfe6", border: "none" } }}
//           />

//           {areaChartData.length > 0 ? (
//             <AreaChart
//               h={230}
//               data={areaChartData}
//               dataKey="date"
//               series={[
//                 { name: "Income", color: "#66bb6a" },
//                 { name: "Expenses", color: "#ef5350" },
//               ]}
//               withLegend
//               withXAxis
//               withYAxis
//               curveType="monotone"
//               tickLine="none"
//               gridAxis="none"
//               withTooltip
//               withGradient
//             />
//           ) : (
//             <p>Không có dữ liệu trong khoảng thời gian đã chọn.</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// // Hàm tạo màu ngẫu nhiên dựa trên tên
// function randomColor(name: string) {
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const c = (hash & 0x00ffffff).toString(16).toUpperCase();
//   return "#" + "00000".substring(0, 6 - c.length) + c;
// }
