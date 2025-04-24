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
import { Table, Text, Pagination } from "@mantine/core";

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
  const [page, setPage] = useState(1);
  const itemsPerPage = 8; // Số item trên mỗi trang

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
    }));

    setPieChartData(chartData);
  }, [transactions]);

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

  useEffect(() => {
    if (!userId || !selectFullDate) return;

    const fetchTransactionsByRange = async () => {
      let { data, error } = await supabase
        .from("transactions")
        .select("*, categories(name)")
        .eq("id_user", userId)
        .order("transaction_type", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
        return;
      }

      const selected = dayjs(selectFullDate);

      const filtered = (data as transaction[]).filter((item) => {
        const d = dayjs(item.date);

        if (timeRange === "Week") {
          return d.week() === selected.week() && d.year() === selected.year();
        } else if (timeRange === "Month") {
          return d.month() === selected.month() && d.year() === selected.year();
        } else if (timeRange === "Year") {
          return d.year() === selected.year();
        } else {
          return d.isSame(selected, "day");
        }
      });

      // Lọc thêm theo loại giao dịch
      const final =
        transactionType === "All"
          ? filtered
          : filtered.filter(
              (item) => item.transaction_type === transactionType
            );

      setLatest(final as never[]);
    };

    fetchTransactionsByRange();
  }, [userId, selectFullDate, transactionType, timeRange]);

  // Phân trang
  const paginatedTransactions = latestTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
              setTransactionType((val as "All" | "Income" | "Expenses") || "")
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

          {transactions.length > 0 && pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              withLabelsLine
              withTooltip
              size={220}
              strokeColor="#fff"
              tooltipDataSource="segment"
            />
          ) : (
            <p>There isn’t any transaction recorded for this period yet.</p>
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
          <Table id="title-table">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Text>{item.categories?.name}</Text>
                    <Text style={{ fontSize: "12px" }}>{item.note}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      style={{
                        color:
                          item.transaction_type === "Income" ? "green" : "red",
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
              <Text id="history-text">
                There isn’t any transaction recorded for this period yet.
              </Text>
            )}
            {latestTransactions.length > itemsPerPage && (
              <Pagination id="pagination"
                value={page}
                onChange={setPage}
                total={Math.ceil(latestTransactions.length / itemsPerPage)}
                mt="md"
                size="sm"
                radius="xl"
                color="69 196 190 0.26"
              />
            )}
          </Table>
        </div>
        <div className="box chart">
          <Select
            // styles={{ input: { backgroundColor: "#b8dfe6", border: "none" } }}
            placeholder="Time Range"
            // defaultValue="Week"
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
              id="barchart"
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
            <p>There isn’t any transaction recorded for this period yet.</p>
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
