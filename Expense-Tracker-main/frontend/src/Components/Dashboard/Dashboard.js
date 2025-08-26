import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { InnerLayout } from "../../styles/Layouts";
import { dollar } from "../../utils/Icons";
import Chart from "../Chart/Chart";

function Dashboard() {
  const {
    totalExpenses,
    totalIncome,
    totalBalance,
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
        <h1>All Transactions</h1>
        <div className="main-con">
          <div className="chart-history-con">
            <div className="chart-con">
              <Chart />
            </div>
            <div className="history-con">
              <History />
            </div>
          </div>
          <div className="amount-con">
            <div className="income">
              <h2>Total Income</h2>
              <p>
                {dollar} {totalIncome()}
              </p>
            </div>
            <div className="expense">
              <h2>Total Expense</h2>
              <p>
                {dollar} {totalExpenses()}
              </p>
            </div>
            <div className="balance">
              <h2>Total Balance</h2>
              <p>
                {dollar} {totalBalance()}
              </p>
            </div>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  .main-con {
    display: flex;
    flex-direction:column;
    gap: 1rem;
  }

  .chart-history-con {
    display: flex;
    gap: 1.5rem;
    flex: 3;

    .chart-con {
      height: 300px;
      width:400px;
    }

    .history-con {
      flex: 1;
      
      h2 {
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .amount-con {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex: 2;

    .income,
    .expense,
    .balance {
      background: #fcf6f9;
      border: 2px solid #ffffff;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1rem;
      flex: 1;
      font-size: 1.2rem;
      min-width: 200px; /* Adjust this as needed for better layout */

      p {
        font-size: 1.2rem;
        font-weight: 700;
      }
    }

    .balance {
      p {
        color: var(--color-green);
        opacity: 0.6;
        font-size: 1.2rem;
      }
    }
  }
`;

export default Dashboard;
