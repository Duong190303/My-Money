import { Header } from "./Header";
import {
  Select,
  TextInput,
  Button,
  Table,
  Text,
  ScrollArea,
  Textarea,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { supabase } from "../supabase";
import { Notifications } from "@mantine/notifications";
import "../welcome/Style/Income.css";
import { Pagination } from "@mantine/core";

type Transaction = {
  id: number;
  id_user: string;
  id_cate: number;
  amount: number;
  note: string;
  date: string;
  categories: { name: string,id_type:number }; // thêm thuộc tính categories
};
export default function Income() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [editingTransactionId, setEditingTransactionId] = useState< number | null>(null);
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
        .eq("id_type", 11111);
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
  
    // Lọc ra các giao dịch có id_type là 11111
    const filtered = (data || []).filter(
      (tran) => tran.categories?.id_type === 11111
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
        title: "Thiếu thông tin",
        message: "Vui lòng điền đầy đủ thông tin trước khi lưu.",
        color: "red",
      });
      return;
    }

    const payload = {
      id_user: userId,
      id_cate: parseInt(selectedCategory),
      amount: parseFloat(amount),
      note: note,
      date: date.toISOString().split("T")[0],
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
        title: "Lỗi",
        message: "Không thể lưu giao dịch. Vui lòng thử lại.",
        color: "red",
      });
    } else {
      Notifications.show({
        title: editingTransactionId
          ? "Cập nhật thành công"
          : "Thêm mới thành công",
        message: editingTransactionId
          ? "Giao dịch đã được cập nhật."
          : "Thu nhập đã được lưu!",
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
        title: "Thiếu thông tin",
        message: "Vui lòng điền đầy đủ thông tin để xoá giao dịch!",
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
        title: "Xoá thành công",
        message: "Giao dịch đã được xoá!",
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
    <>  <Notifications position="bottom-right" zIndex={300} />
    <div className="income-background">
      <Header />
      <div id="income-container">
        <div className="income-container1"></div>
        <div className="income-container2">
          <div id="income-text">
            <ScrollArea id="transaction-table-container">
              <TextInput
                id="search-input"
                mb="md"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                placeholder="Search transactions"
                value={search}
                onChange={handleSearch}
              />
              <Table
                id="transaction-table"
                horizontalSpacing="md"
                verticalSpacing="xs"
                miw={700}
                layout="fixed"
              >
                <Table.Tbody id="transaction-tablethead">
                  <Table.Tr id="transaction-tabletr">
                    <Table.Td>Catelogies</Table.Td>
                    <Table.Td>Date</Table.Td>
                    <Table.Td>Amount</Table.Td>
                    <Table.Td>Note</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
              <Table id="transaction-table-content">
                <Table.Tbody >
                  {transactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <Table.Tr
                        key={transaction.id_user}
                        onClick={() => handleRowClick(transaction)}
                      >
                        <Table.Td>
                          <Text style={{ position: "absolute" }}>
                            {transaction.categories?.name ?? "Unknown Category"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>{transaction.date}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>
                            {transaction.amount}
                            <span style={{ position: "absolute" }}> $</span>
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text>{transaction.note}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr id="transaction-text">
                      <Table.Td colSpan={4}>
                        <Text>
                          There isn’t any transaction recorded for this period
                          yet.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
              {/* Pagination - placed outside of table, centered */}
              {transactions.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                  }}
                >
                  <Pagination
                    value={activePage}
                    onChange={setPage}
                    total={totalPages}
                    size="xs"
                    color="69 196 190 0.26"
                    radius="md"
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        <div className="income-container3">
          <h1>INCOME</h1>
          <form
            id="income-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div id="income-form-content">
              <div id="income-title">
                <Select
                  id="income-select-category"
                  placeholder={"Categories"}
                  data={categories}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  clearable
                  searchable
                ></Select>
                <DateInput
                  id="income-date"
                  size="sm"
                  placeholder="Date"
                  valueFormat="DD/MM/YYYY"
                  value={date}
                  onChange={setDate}
                  popoverProps={{
                    withinPortal: true,
                  }}
                />
                <TextInput
                  type="number"
                  id="income-amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.trim())}
                ></TextInput>
                <Textarea
                  id="income-note"
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></Textarea>
              </div>
              <div id="income-form-button">
                <Button
                  type="button"
                  id="income-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  id="income-save-button"
                  onClick={handleSaveOrUpdate}
                >
                  {editingTransactionId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
