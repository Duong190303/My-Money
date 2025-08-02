// transaction-logic.ts

import { supabase } from "../../supabase";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(weekOfYear);

// --- TYPE DEFINITIONS ---

export type Transaction = {
  id: number;
  categories: { name: string; id_type: number };
  amount: number;
  color: string;
  id_cate: number;
  id_type: number;
  transaction_type: "Income" | "Expenses";
  date: string;
  created_at: string;
  note: string;
};

export type PieChartDataPoint = {
  name: string;
  value: number;
  color: string;
};

export type BarChartDataPoint = {
  date: string;
  Income: number;
  Expenses: number;
};

export type TransactionTotals = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

// --- UTILITY FUNCTIONS ---

/**
 * Generates a consistent hex color based on a string name.
 * @param name The input string (e.g., category name).
 * @returns A hex color string.
 */
function randomColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

// --- CORE LOGIC FUNCTIONS ---

/**
 * Fetches and filters all transactions for a user based on a date and time range.
 * @param userId - The ID of the user.
 * @param selectFullDate - The selected date for filtering.
 * @param timeRange - The time range ("Day", "Week", "Month", "Year").
 * @param transactionType - The type of transaction to filter ("All", "Income", "Expenses").
 * @returns A promise that resolves to an array of transactions.
 */
export async function fetchAndFilterTransactions(
  userId: string,
  selectFullDate: Date,
  timeRange: "Day" | "Week" | "Month" | "Year",
  transactionType: "All" | "Income" | "Expenses"
): Promise<Transaction[]> {
  if (!userId || !selectFullDate) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, id_type)")
    .eq("id_user", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }

  const selected = dayjs(selectFullDate);
  const rawData = data as Transaction[];

  const timeFiltered = rawData.filter((item) => {
    const d = dayjs(item.date);
    switch (timeRange) {
      case "Day":
        return d.isSame(selected, "day");
      case "Week":
        return d.week() === selected.week() && d.year() === selected.year();
      case "Month":
        return d.month() === selected.month() && d.year() === selected.year();
      case "Year":
        return d.year() === selected.year();
      default:
        return false;
    }
  });

  if (transactionType === "All") {
    return timeFiltered;
  }

  return timeFiltered.filter(
    (item) => item.transaction_type === transactionType
  );
}

/**
 * Generates data for the Pie Chart by grouping transactions by category.
 * @param transactions - An array of transactions.
 * @returns An array of data points for the Pie Chart.
 */
export function generatePieChartData(
  transactions: Transaction[]
): PieChartDataPoint[] {
  if (transactions.length === 0) return [];

  const grouped = new Map<string, number>();

  transactions.forEach((t) => {
    const name = t.categories?.name || "Unknown";
    const prevAmount = grouped.get(name) || 0;
    grouped.set(name, prevAmount + t.amount);
  });

  return Array.from(grouped.entries()).map(([name, value]) => ({
    name,
    value,
    color: randomColor(name),
  }));
}

/**
 * Generates data for the Bar Chart by grouping transactions by date labels.
 * @param transactions - An array of all transactions (income and expenses).
 * @param timeRange - The current time range to determine grouping.
 * @returns An array of data points for the Bar Chart.
 */
export function generateBarChartData(
  transactions: Transaction[],
  timeRange: "Day" | "Week" | "Month" | "Year"
): BarChartDataPoint[] {
  if (transactions.length === 0) return [];

  const grouped: Record<string, { Income: number; Expenses: number }> = {};

  transactions.forEach((item) => {
    const d = dayjs(item.date);
    let label = "";

    switch (timeRange) {
      case "Week":
      case "Day":
        label = d.format("YYYY-MM-DD");
        break;
      case "Month":
        const week = d.week() - dayjs(d).startOf("month").week() + 1;
        label = `Week ${week}`;
        break;
      case "Year":
        label = d.format("MMM YYYY");
        break;
      default:
        label = d.format("YYYY-MM-DD");
        break;
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

  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,
      ...values,
    }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
}

/**
 * Calculates total income, expenses, and balance from transactions.
 * @param transactions - An array of transactions.
 * @returns An object containing totalIncome, totalExpenses, and balance.
 */
export function calculateTotals(transactions: Transaction[]): TransactionTotals {
  const totalIncome = transactions
    .filter((t) => t.transaction_type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transaction_type === "Expenses")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

/**
 * Fetches the current authenticated user's ID.
 * @returns A promise that resolves to the user ID string or an empty string if not found.
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error.message);
    return "";
  }
  return user?.id || "";
}