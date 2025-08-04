"use client";

import { useState, useEffect } from "react";
import { Select, TextInput, Button, Textarea, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import classes from "../transaction.module.css";
import { getCurrentUserId } from "../TransactionSevice/IncomeService";
import {
  type Transaction,
  fetchExpenseCategories,
  saveOrUpdateExpense,
  deleteExpense,
} from "../TransactionSevice/ExpensesService";


type TableTranIncomeProps = {
  selectedTransaction: Transaction | null;
  onDataChange: () => void; 
  onClear: () => void; 
};

export const TableTranExpenses: React.FC<TableTranIncomeProps> = ({
  selectedTransaction,
  onDataChange,
  onClear,
}) => {
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (selectedTransaction) {
      setSelectedCategory(selectedTransaction.id_cate.toString());
      setAmount(selectedTransaction.amount.toString());
      setNote(selectedTransaction.note || "");
      setDate(new Date(selectedTransaction.date));
      setEditingTransactionId(selectedTransaction.id);
    } else {
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
    onClear(); 
    resetForm(); 
  };

  useEffect(() => {
    const init = async () => {
      const id = await getCurrentUserId();
      if (id) setUserId(id);
      const cats = await fetchExpenseCategories();
      setCategories(cats);
    };
    init();
  }, []);

  const handleSaveOrUpdate = async () => {
    if (!selectedCategory || !date || !amount) {
      showNotification({
        title: "Thiếu thông tin",
        message: "Vui lòng điền đủ thông tin trước khi lưu.",
        color: "red",
      });
      return;
    }
    const { error } = await saveOrUpdateExpense(
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
      onDataChange();
      clearSelectionAndForm();
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!editingTransactionId) return;

    try {
      await deleteExpense(editingTransactionId);
      showNotification({
        title: "Đã xóa",
        message: "Giao dịch đã được xóa.",
        color: "green",
      });
      resetForm();
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
      <Box component="h1">EXPENSES</Box>
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
  );
};
