import { Link } from "react-router";
import { Header } from "./Header";
import {
  Select,
  TextInput,
  Button,
  Table,
  Text,
  ScrollArea,
  TableTbody,
} from "@mantine/core";
import { useState, useEffect } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { supabase } from "../supabase";
import "../welcome/Style/Income.css";

type Transaction = {
  id: number;
  id_user: string;
  id_cate: number;
  amount: number;
  note: string;
  date: string;
  categories: { name: string } // thêm thuộc tính categories
};
export default function Income() {
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
  const [sortBy, setSortBy] = useState<keyof Transaction | null>(null);
  const [reverseSort, setReverseSort] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<number | null>(null);


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

  // useEffect(() => {
  //   async function fetchTransactions() {
  //     if (!userId) return;
  //     const { data: transactionsData, error } = await supabase
  //       .from("transactions")
  //       .select("*, categories(name, id_type)")
  //       .eq("id_user", userId)
  //       .eq("categories.id_type", 11111);
  //     // .join("categories", "transactions.id_cate", "categories.id_cate");
  //     if (transactionsData) {
  //       setTransactions(transactionsData);
  //     } else {
  //       console.error("Error fetching transactions:", error);
  //     }
  //   }
  //   fetchTransactions();
  // }, [userId]);
  useEffect(() => {
    async function fetchTransactions() {
      if (!userId) return;
  
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          categories (
            name,
            id_type
          )
        `)
        .eq("id_user", userId);
  
      if (error) {
        console.error("Error fetching transactions:", error);
        return;
      }
  
      const filtered = data?.filter(
        (tran) => tran.categories?.id_type === 11111
      ) || [];
  
      setTransactions(filtered);
      setSortedTransactions(filtered); // Khởi tạo mảng đã sắp xếp
    }
  
    fetchTransactions();
  }, [userId]);
  

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    const filteredTransactions = transactions.filter((transaction) =>
      Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSortedTransactions(filteredTransactions);
  };
// const handleSort = (field: keyof Transaction | ((transaction: Transaction) => any)) => {
//   if (typeof field === 'function') {
//     throw new Error('Cannot sort by a function');
//   }
//   setSortBy(field);
//   setReverseSort(!reverseSort);
//   const sortedTransactions = transactions.sort((a, b) => {
//     let aValue, bValue;
//     aValue = a[field];
//     bValue = b[field];
//     if (aValue < bValue) return reverseSort ? 1 : -1;
//     if (aValue > bValue) return reverseSort ? -1 : 1;
//     return 0;
//   });
//   setSortedTransactions(sortedTransactions);
// };
// const handleSort = (field: keyof Transaction) => {
//   setSortBy(field);
//   const newReverse = !reverseSort;
//   setReverseSort(newReverse);

//   const sorted = [...transactions].sort((a, b) => {
//     const aValue = a[field];
//     const bValue = b[field];

//     if (aValue == null || bValue == null) return 0;

//     if (aValue < bValue) return newReverse ? 1 : -1;
//     if (aValue > bValue) return newReverse ? -1 : 1;
//     return 0;
//   });

//   setSortedTransactions(sorted);
// };
const handleSaveOrUpdate = async () => {
  if (!selectedCategory || !date || !amount) {
    alert("Vui lòng điền đầy đủ thông tin");
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
    const result = await supabase
      .from("transactions")
      .insert(payload);
    error = result.error;
  }

  if (error) {
    console.error("Lỗi lưu giao dịch:", error);
  } else {
    alert("Thu nhập đã được lưu!");
    setAmount("");
    setNote("");
    setDate(null);
    setSelectedCategory(null);
    setEditingTransactionId(null); // reset lại để trở về trạng thái thêm mới
  }
};

  // const handleSave = async () => {
  //   if (!selectedCategory || !date || !amount) {
  //     alert("Vui lòng điền đầy đủ thông tin");
  //     return;
  //   }

  //   const { error } = await supabase.from("transactions").insert({
  //     id_user: userId,
  //     id_cate: parseInt(selectedCategory),
  //     amount: parseFloat(amount),
  //     note: note,
  //     date: date.toISOString().split("T")[0],
  //   });

  //   if (error) {
  //     console.error("Lỗi lưu giao dịch:", error);
  //   } else {
  //     alert("Thu nhập đã được lưu!");
  //     setAmount("");
  //     setNote("");
  //     setDate(null);
  //     setSelectedCategory(null);
  //   }
  // };
  // const handUpdate = async () => {
  //   if (!selectedCategory || !date || !amount) {
  //     alert("Vui lòng điền đày đủ thông tin");
  //     return;
  //   }

  //   const { error } = await supabase.from("transactions").update({
  //     id_cate: parseInt(selectedCategory),
  //     amount: parseFloat(amount),
  //     note: note,
  //     date: date.toISOString().split("T")[0],
  //   }).eq("id_user", userId).eq("id_cate", parseInt(selectedCategory)).eq("date", date.toISOString().split("T")[0]).eq("amount", parseFloat(amount));

  //   if (error) {
  //     console.error("Lỗi lưu giao dịch:", error);
  //   } else {
  //     alert("Thu nhập đã được lưu!");
  //     setAmount("");
  //     setNote("");
  //     setDate(null);
  //     setSelectedCategory(null);
  //   }
  // };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedCategory(transaction.id_cate.toString());
    setAmount(transaction.amount.toString());
    setNote(transaction.note||"");
    setDate(new Date(transaction.date));
    setEditingTransactionId(transaction.id);
  }
  const handleDelete = async () => {
    if (!selectedCategory || !date || !amount) {
      alert("Vui lòng điền đầy đủ thông tin");
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
      alert("Giao dịch đã được xóa!");
      setAmount("");
      setNote("");
      setDate(null);
      setSelectedCategory(null);
    }
  };
  return (
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
                    <Table.Th
                      id="transaction-tableth"
                      // onClick={() => handleSort("date")}
                    >
                      Date
                    </Table.Th>
                    <Table.Th
                      id="transaction-tableth"
                      // onClick={() => handleSort("categories.name")}
                      >
                      Categories
                    </Table.Th>
                    <Table.Th
                      id="transaction-tableth"
                      // onClick={() => handleSort("amount")}
                    >
                      Amount
                    </Table.Th>
                    <Table.Th
                      id="transaction-tableth"
                      // onClick={() => handleSort("note")}
                    >
                      Note
                    </Table.Th>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
              <Table >
              <Table.Tbody styles={{ tbody: { overflow: "auto" }}}>
                {transactions.length > 0 ? (              
                  sortedTransactions.map((transaction) => (
                    
                    <Table.Tr key={transaction.id_user} onClick={() => handleRowClick(transaction)}>
                      <Table.Td>
                        <Text>{transaction.date}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>
                          {transaction.categories?.name ?? "Unknown Category"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{transaction.amount}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{transaction.note}</Text>
                      </Table.Td>
                    </Table.Tr>
                  )))   : (

                    <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text>
                        There isn’t any transaction recorded for this period
                        yet.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                  )           
                }
                </Table.Tbody>
                </Table>
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
                  value={date}
                  onChange={setDate}
                  popoverProps={{
                    withinPortal: true,
                    styles: {
                      dropdown: { fontSize: 13, maxWidth: 300 },
                      calendarHeaderControl: {
                        svg: {
                          width: 16,
                          height: 16,
                        },
                      },
                    } as any,
                  }}
                />
                <TextInput
                  id="income-amount"
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                ></TextInput>

                <TextInput
                  id="income-note"
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></TextInput>
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
  );
}
