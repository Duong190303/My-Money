// "use client";

// import { useState, useEffect } from "react";
// import { Select, TextInput, Button, Textarea, Box } from "@mantine/core";
// import { supabase } from "../../../supabase";
// import { showNotification } from "@mantine/notifications";
// import { DateInput } from "@mantine/dates";
// import classes from "../transaction.module.css";
// import dayjs from "dayjs";
// import {
//   getCurrentUserId,
//   fetchIncomeCategories,
//   saveOrUpdateIncome,
//   deleteIncome,
//   type Transaction,
//   fetchIncomeTransactions,
// } from "../TransactionSevice/IncomeService";

// export const TableTranIncome: React.FC = () => {
//   // State related to the form inputs
//   const [categories, setCategories] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [amount, setAmount] = useState("");
//   const [note, setNote] = useState("");
//   const [date, setDate] = useState<Date | null>(null);
//   const [userId, setUserId] = useState<string>("");
//   const [editingTransactionId, setEditingTransactionId] = useState<
//     number | null
//   >(null);
//   const resetForm = () => {
//     setSelectedCategory(null);
//     setAmount("");
//     setNote("");
//     setDate(null);
//     setEditingTransactionId(null);
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       const id = await getCurrentUserId();
//       if (id) setUserId(id);
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       loadTransactions();
//     }
//   }, [userId]);

//   const loadTransactions = async () => {
//     if (!userId) return;
//     const data = await fetchIncomeTransactions(userId);
//     setTransactions(data || []);
//   };

//   const handleSaveOrUpdate = async () => {
//     if (!selectedCategory || !date || !amount) {
//       showNotification({
//         title: "Thiếu thông tin",
//         message: "Vui lòng điền đủ thông tin trước khi lưu.",
//         color: "red",
//       });
//       return;
//     }

//     const { error } = await saveOrUpdateIncome(
//       userId,
//       selectedCategory,
//       amount,
//       note,
//       date,
//       editingTransactionId
//     );

//     if (error) {
//       showNotification({
//         title: "Lỗi",
//         message: "Không thể lưu giao dịch. Vui lòng thử lại.",
//         color: "red",
//       });
//     } else {
//       showNotification({
//         title: editingTransactionId
//           ? "Cập nhật thành công"
//           : "Thêm mới thành công",
//         message: editingTransactionId
//           ? "Giao dịch đã được cập nhật."
//           : "Khoản thu nhập đã được lưu!",
//         color: "green",
//       });
//       resetForm();
//     }
//   };

//   const handleDelete = async () => {
//   if (!editingTransactionId) return;

//   try {
//     await deleteIncome(editingTransactionId);
//     showNotification({
//       title: "Đã xóa",
//       message: "Giao dịch đã được xóa.",
//       color: "green",
//     });
//     resetForm(); // ← dùng lại hàm reset
//   } catch (error) {
//     console.error("Lỗi khi xóa:", error);
//     showNotification({
//       title: "Lỗi",
//       message: "Không thể xóa giao dịch.",
//       color: "red",
//     });
//   }
// };

//   return (
//     <Box className={classes.incomeContainer3}>
//       <Box component="h1">INCOME</Box>
//       <Box
//         component="form"
//         id={classes.incomeForm}
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSaveOrUpdate();
//         }}
//       >
//         <Box id={classes.incomeTitle}>
//           <Select
//             classNames={{
//               root: classes.incomeCategoryRoot,
//               input: classes.incomeCategoryInput,
//             }}
//             placeholder={"Categories"}
//             data={categories}
//             value={selectedCategory}
//             onChange={setSelectedCategory}
//             clearable
//             searchable
//           />
//           <DateInput
//             classNames={{
//               root: classes.incomeDateRoot,
//               input: classes.incomeDateInput,
//             }}
//             size="sm"
//             placeholder="Date"
//             valueFormat="DD/MM/YYYY"
//             value={date}
//             onChange={setDate}
//             popoverProps={{
//               withinPortal: true,
//             }}
//           />
//           <TextInput
//             type="number"
//             classNames={{
//               root: classes.incomeAmountRoot,
//               input: classes.incomeAmountInput,
//             }}
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <Textarea
//             classNames={{
//               root: classes.incomeNoteRoot,
//               input: classes.incomeNoteInput,
//               wrapper: classes.incomeNoteWrapper,
//             }}
//             placeholder="Note"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//         </Box>
//         <Box id={classes.incomeFormButton}>
//           <Button
//             type="button"
//             id={classes.incomeDeleteButton}
//             onClick={handleDelete}
//             disabled={!editingTransactionId}
//           >
//             Delete
//           </Button>
//           <Button type="submit" id={classes.incomeSaveButton}>
//             {editingTransactionId ? "Update" : "Save"}
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//     // </Box>
//   );
// };
// TableTranIncome.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, TextInput, Button, Textarea, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import classes from "../transaction.module.css";
import {
  getCurrentUserId,
  fetchIncomeCategories,
  saveOrUpdateIncome,
  deleteIncome,
  type Transaction,
} from "../TransactionSevice/IncomeService";

// ADDED: Props mới cho component
type TableTranIncomeProps = {
  selectedTransaction: Transaction | null;
  onDataChange: () => void; // Hàm để báo cho cha tải lại dữ liệu
  onClear: () => void; // Hàm để báo cho cha xóa lựa chọn
};

export const TableTranIncome: React.FC<TableTranIncomeProps> = ({
  selectedTransaction,
  onDataChange,
  onClear,
}) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  // REMOVED: Xóa state `transactions` không cần thiết
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);

  // ADDED: useEffect để điền form khi `selectedTransaction` từ cha thay đổi
  useEffect(() => {
    if (selectedTransaction) {
      setSelectedCategory(selectedTransaction.id_cate.toString());
      setAmount(selectedTransaction.amount.toString());
      setNote(selectedTransaction.note || "");
      setDate(new Date(selectedTransaction.date));
      setEditingTransactionId(selectedTransaction.id);
    } else {
      // Nếu không có giao dịch nào được chọn (VD: sau khi thêm mới, xóa) -> reset form
      resetForm();
    }
  }, [selectedTransaction]);

  const resetForm = () => {
    setSelectedCategory(null);
    setAmount("");
    setNote("");
    setDate(null);
    setEditingTransactionId(null);
  };

  const clearSelectionAndForm = () => {
    onClear(); // Báo cho cha biết là đã xong, không còn giao dịch nào được chọn
    resetForm(); // Reset state của form này
  };

  // Load categories một lần
  useEffect(() => {
    const init = async () => {
      const id = await getCurrentUserId();
      if (id) setUserId(id);
      const cats = await fetchIncomeCategories();
      setCategories(cats);
    };
    init();
  }, []);

  // REMOVED: Xóa logic tải lại transactions vì đã được cha quản lý

  const handleSaveOrUpdate = async () => {
    if (!selectedCategory || !date || !amount) {
      showNotification({
        title: "Thiếu thông tin",
        message: "Vui lòng điền đủ thông tin trước khi lưu.",
        color: "red",
      });
      return;
    }
    const { error } = await saveOrUpdateIncome(
      userId,
      selectedCategory,
      amount,
      note,
      date,
      editingTransactionId
    );
    if (error) {
      showNotification({
        title: "Lỗi",
        message: "Không thể lưu giao dịch. Vui lòng thử lại.",
        color: "red",
      });
    } else {
      showNotification({
        title: editingTransactionId
          ? "Cập nhật thành công"
          : "Thêm mới thành công",
        message: editingTransactionId
          ? "Giao dịch đã được cập nhật."
          : "Khoản thu nhập đã được lưu!",
        color: "green",
      });
      // CHANGED: Gọi callback để tải lại dữ liệu ở cha và reset form
      onDataChange();
      clearSelectionAndForm();
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!editingTransactionId) return;

    try {
      await deleteIncome(editingTransactionId);
      showNotification({
        title: "Đã xóa",
        message: "Giao dịch đã được xóa.",
        color: "green",
      });
      resetForm();
      // CHANGED: Gọi callback để tải lại dữ liệu ở cha và reset form
      onDataChange();
      clearSelectionAndForm();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      showNotification({
        title: "Lỗi",
        message: "Không thể xóa giao dịch.",
        color: "red",
      });
    }
  };

  return (
    <Box className={classes.incomeContainer3}>
      <Box component="h1">INCOME</Box>
      <Box
        component="form"
        id={classes.incomeForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveOrUpdate();
        }}
      >
        <Box id={classes.incomeTitle}>
          <Select
            classNames={{
              root: classes.incomeCategoryRoot,
              input: classes.incomeCategoryInput,
            }}
            placeholder={"Categories"}
            data={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            clearable
            searchable
          />
          <DateInput
            classNames={{
              root: classes.incomeDateRoot,
              input: classes.incomeDateInput,
            }}
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
            classNames={{
              root: classes.incomeAmountRoot,
              input: classes.incomeAmountInput,
            }}
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Textarea
            classNames={{
              root: classes.incomeNoteRoot,
              input: classes.incomeNoteInput,
              wrapper: classes.incomeNoteWrapper,
            }}
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
        <Box id={classes.incomeFormButton}>
          <Button
            type="button"
            id={classes.incomeDeleteButton}
            onClick={handleDelete}
            disabled={!editingTransactionId}
          >
            Delete
          </Button>
          <Button type="submit" id={classes.incomeSaveButton}>
            {editingTransactionId ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
    // </Box>
  );
};
