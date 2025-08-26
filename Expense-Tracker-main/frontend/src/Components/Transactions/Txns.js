import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext.js";
import AllTransactions from "./AllTxns.js";
import { InnerLayout } from "../../styles/Layouts.js";

function Transactions() {
  const {
    getIncomes,
    getExpenses,
  } = useGlobalContext();

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="heading">
          <h1>Txns</h1>
          <h1>Amount</h1>
          <h1>Date</h1>
        </div>

        <div className="stats-con">
          <AllTransactions />
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  .heading
  {
    display: flex;
    justify-content: space-between;
    width: 120vh;
    padding: 1rem 2rem;
    align-items: center;
  }
  .stats-con
  {
    display: flex;
    flex-direction: column;
  }
`;

export default Transactions;
