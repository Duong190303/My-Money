import { HeaderPage } from "../../Header/HeaderPage";
import { Box } from "@mantine/core";
import classes from "../transaction.module.css";
import { IncomeTable } from "./IncomeTable";
import { TableTranIncome } from "./TableTranIncome";

export default function Income() {
  
  const handleRowClick = (transaction: any) => {
    console.log("Row clicked:", transaction);
  };
  return (
    <Box className={classes.incomeBackground}>
      <HeaderPage />
      <Box id={classes.incomeContainer}>
        <IncomeTable onRowClick={handleRowClick} />
        <Box className={classes.incomeContainer1} />
        <TableTranIncome />
      </Box>
    </Box>
  );
}
