import { Link } from "react-router-dom";
import { Header } from "./Header";
import { DateInput } from "@mantine/dates";
import "./Style/Datareport.css";

export default function Datareport() {
  return (
    <div className="datareport-background">
      <Header />

      <main className="container">
        <div className="box donutchart">
          There isn’t any transaction recorded for this period yet.
        </div>
        <div className="box total">
          <DateInput placeholder="Select date range" />
          <p>Total Balance: 0$</p>
          <div className="income-expense">
            <div className="income">
              income
              <br />
              0$
            </div>
            <div className="expense">
              expenses
              <br />
              0$
            </div>
          </div>
        </div>
        <div className="box history">
          {" "}
          <h3 className="title">TRANSACTION HISTORY</h3>
          <br />
          There isn’t any transaction recorded for this period yet.
        </div>
        <div className="box piechart">
          There isn’t any transaction recorded for this period yet.
        </div>
      </main>
    </div>
  );
}
