import { HeaderPage } from "../../Header/HeaderPage";
import { Box } from "@mantine/core";
import { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { supabase } from "../../../supabase";
import { Notifications } from "@mantine/notifications";
import classes from "../transaction.module.css";
import { Pagination } from "@mantine/core";
import dayjs from "dayjs";
import { ExpensesTable } from "./ExpensesTable";
import { TableTranExpenses } from "./TableTranExpenses";

type Transaction = {
  id: number;
  id_user: string;
  id_cate: number;
  amount: number;
  note: string;
  date: string;
  transaction_type: string;
  categories: { name: string }; // thêm thuộc tính categories
};
export default function Expenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  // 1. Lấy thông tin user hiện tại từ Supabase Auth
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Không lấy được người dùng:", error.message);
      } else if (user) {
        setUserId(user.id);
        console.log("User đã đăng nhập:", user.id);
      }
    }

    getCurrentUser();
  }, []);

  // 2. Lấy dữ liệu từ bảng users và bảng categories
  useEffect(() => {
    async function fetchCategories() {
      const { data: categoriesData, error } = await supabase
        .from("categories")
        .select("id_cate, name")
        .eq("id_type", 22222);
      if (categoriesData) {
        setCategories(
          categoriesData.map((item) => ({
            label: item.name,
            value: item.id_cate.toString(),
          }))
        );
      } else {
        console.error("Error fetching categories:", error);
      }

      setLoading(false);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, activePage]);
  const fetchTransactions = async () => {
    if (!userId) return;

    // Lấy toàn bộ transaction trước để lọc đúng
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
          *,
          categories (
            name,
            id_type
          )
        `
      )
      .eq("id_user", userId);

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    // Lọc ra các giao dịch có id_type là 22222
    const filtered = (data || []).filter(
      (tran) => tran.categories?.id_type === 22222
    );

    const totalFiltered = filtered.length;
    const pages = Math.ceil(totalFiltered / itemsPerPage);

    if (activePage > pages) {
      setPage(pages || 1);
    }

    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);

    setTransactions(paginated);
    setSortedTransactions(paginated);
    setTotalPages(pages);
  };
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredTransactions = transactions.filter((transaction) => {
      // Kiểm tra các trường trực tiếp trong transaction
      const basicMatch = Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      );

      // Kiểm tra riêng cho categories.name nếu tồn tại
      const categoryMatch = transaction.categories?.name
        ?.toLowerCase()
        .includes(searchTerm);

      return basicMatch || categoryMatch;
    });

    setSortedTransactions(filteredTransactions);
  };

  const handleSaveOrUpdate = async () => {
    if (!selectedCategory || !date || !amount) {
      Notifications.show({
        title: "Lack of information",
        message: "Please fill in the information before saving.",
        color: "red",
      });
      return;
    }

    const payload = {
      id_user: userId,
      id_cate: parseInt(selectedCategory),
      amount: parseFloat(amount),
      note: note,
      date: dayjs(date).format("YYYY-MM-DD"),
      transaction_type: "Expenses",
    };

    let error;

    if (editingTransactionId) {
      // Update
      const result = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingTransactionId); // dùng ID để update chính xác
      error = result.error;
    } else {
      // Insert
      const result = await supabase.from("transactions").insert(payload);
      error = result.error;
    }

    if (error) {
      console.error("Lỗi lưu giao dịch:", error);
      Notifications.show({
        title: "Error",
        message: "Can not transfer transactions. Please try again.",
        color: "red",
      });
    } else {
      Notifications.show({
        title: editingTransactionId ? "Success update" : "Add new successfully",
        message: editingTransactionId
          ? "The transaction has been updated."
          : "Spending has been saved!",
        color: "green",
      });
      setAmount("");
      setNote("");
      setDate(null);
      setSelectedCategory(null);
      setEditingTransactionId(null); // reset lại để trở về trạng thái thêm mới
      await fetchTransactions();
    }
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedCategory(transaction.id_cate.toString());
    setAmount(transaction.amount.toString());
    setNote(transaction.note || "");
    setDate(new Date(transaction.date));
    setEditingTransactionId(transaction.id);
  };
  const handleDelete = async () => {
    if (!selectedCategory || !date || !amount) {
      Notifications.show({
        title: "Lack of information",
        message: "Please fill out the information to delete transactions!",
        color: "red",
      });
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id_user", userId)
      .eq("id_cate", parseInt(selectedCategory))
      .eq("date", date.toISOString().split("T")[0])
      .eq("amount", parseFloat(amount));

    if (error) {
      console.error("Lỗi xóa giao dịch:", error);
    } else {
      Notifications.show({
        title: "Delete successfully",
        message: "The transaction has been deleted!",
        color: "green",
      });
      setAmount("");
      setNote("");
      setDate(null);
      setSelectedCategory(null);
      await fetchTransactions();
    }
  };

  return (
    <Box className={classes.incomeBackground}>
      <HeaderPage />
      <Box id={classes.incomeContainer}>
        <ExpensesTable onRowClick={handleRowClick} />
        <Box className={classes.incomeContainer1} />
        <TableTranExpenses />
      </Box>
    </Box>
  );
}
