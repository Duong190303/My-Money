"use client";

import { useState, useEffect } from "react";
import { Select, TextInput, Button, Textarea, Box } from "@mantine/core";
import { supabase } from "../../../supabase";
import { showNotification } from "@mantine/notifications";
import { DateInput } from "@mantine/dates";
import classes from "../transaction.module.css";
import dayjs from "dayjs";

export const TableTranIncome: React.FC = () => {
  // State related to the form inputs
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

  // 1. Fetch current user from Supabase Auth
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getCurrentUser();
  }, []);

  // 2. Fetch categories data from the 'categories' table
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
    }
    fetchCategories();
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

    const payload = {
      id_user: userId,
      id_cate: parseInt(selectedCategory),
      amount: parseFloat(amount),
      note: note,
      date: dayjs(date).format("YYYY-MM-DD"),
      transaction_type: "Income",
    };

    const { error } = editingTransactionId
      ? await supabase
          .from("transactions")
          .update(payload)
          .eq("id", editingTransactionId)
      : await supabase.from("transactions").insert(payload);

    if (error) {
      console.error("Lỗi lưu giao dịch:", error);
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
      // Reset form
      setAmount("");
      setNote("");
      setDate(null);
      setSelectedCategory(null);
      setEditingTransactionId(null);
    }
  };

  const handleDelete = async () => {
    if (!editingTransactionId) {
      showNotification({
        title: "Chưa chọn giao dịch",
        message: "Bạn cần chọn một giao dịch để xóa!",
        color: "red",
      });
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", editingTransactionId);

    if (error) {
      console.error("Lỗi xóa giao dịch:", error);
    } else {
      showNotification({
        title: "Xóa thành công",
        message: "Giao dịch đã được xóa!",
        color: "green",
      });
      // Reset form
      setAmount("");
      setNote("");
      setDate(null);
      setSelectedCategory(null);
      setEditingTransactionId(null);
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
