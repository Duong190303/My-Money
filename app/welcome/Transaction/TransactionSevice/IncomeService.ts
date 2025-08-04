import { supabase } from "../../../supabase";
import dayjs from "dayjs";

export const INCOME_TYPE_ID = 11111;

export type Transaction = {
  id: number;
  id_user: string;
  id_cate: number;
  amount: number;
  note: string;
  date: string;
  transaction_type: string;
  categories: { name: string; id_type: number };
};

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

export async function fetchIncomeCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id_cate, name")
    .eq("id_type", INCOME_TYPE_ID);

  if (error) throw error;
  return data.map((item) => ({
    label: item.name,
    value: item.id_cate.toString(),
  }));
}

export async function fetchIncomeTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, id_type)")
    .eq("id_user", userId)
    .eq("transaction_type", "Income");

  if (error) throw error;
  return data || [];
}

export async function saveOrUpdateIncome(
  userId: string,
  selectedCategory: string,
  amount: string,
  note: string,
  date: Date,
  editingTransactionId: number | null
) {
  const payload = {
    id_user: userId,
    id_cate: parseInt(selectedCategory),
    amount: parseFloat(amount),
    note,
    date: dayjs(date).format("YYYY-MM-DD"),
    transaction_type: "Income",
  };

  if (editingTransactionId) {
    return await supabase.from("transactions").update(payload).eq("id", editingTransactionId);
  } else {
    return await supabase.from("transactions").insert(payload);
  }
}

export async function deleteIncome(id: number) {
  return await supabase.from("transactions").delete().eq("id", id);
}
