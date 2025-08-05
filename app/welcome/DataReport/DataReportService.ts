// src/services/transaction.service.ts
import { supabase } from "../../supabase";
import dayjs from "dayjs";

export type Transaction = {
  id: number;
  categories: { name: string; id_type: number } | null;
  amount: number;
  color: string | null;
  id_cate: number;
  transaction_type: "Income" | "Expenses";
  date: string;
  created_at: string;
  note: string;
};

interface FetchParams {
  userId: string;
  selectFullDate: Date;
  timeRange: "Day" | "Week" | "Month" | "Year";
}

export const getTransactionsByPeriod = async ({
  userId,
  selectFullDate,
  timeRange,
}: FetchParams): Promise<Transaction[]> => {
  if (!userId || !selectFullDate) {
    return [];
  }

  const selected = dayjs(selectFullDate);
  let startDate: dayjs.Dayjs;
  let endDate: dayjs.Dayjs;

  switch (timeRange) {
    case "Day":
      startDate = selected.startOf("day");
      endDate = selected.endOf("day");
      break;
    case "Week":
      startDate = selected.startOf("week");
      endDate = selected.endOf("week");
      break;
    case "Month":
      startDate = selected.startOf("month");
      endDate = selected.endOf("month");
      break;
    case "Year":
      startDate = selected.startOf("year");
      endDate = selected.endOf("year");
      break;
    default:
      return [];
  }

  let { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, id_type)")
    .eq("id_user", userId)
    .gte("date", startDate.toISOString())
    .lte("date", endDate.toISOString())
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error.message);
    return [];
  }

  return (data as Transaction[]) || [];
};