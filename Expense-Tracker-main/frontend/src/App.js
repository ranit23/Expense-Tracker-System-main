import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/User/Login';
import Signup from './Components/User/SignUp';
import { useGlobalContext } from './context/globalContext';
import Transactions from './Components/Transactions/Txns.js';
import CameraButton from './Components/CameraButton/CameraButton';

function App() {
  const [active, setActive] = useState(1);
  const { user } = useGlobalContext(); // Get user from context

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <Router>
      <AppStyled bg={bg} className="App">
        {user && <CameraButton />} {/* Show button only when logged in */}
        <MainLayout>
          <Navigation active={active} setActive={setActive} />
          <main>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

              {/* Authenticated Routes */}
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/view-transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
              <Route path="/incomes" element={user ? <Income /> : <Navigate to="/login" />} />
              <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/login" />} />

              {/* Redirect to login if the route is not found */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </MainLayout>
      </AppStyled>
    </Router>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  background-size: cover; /* Ensures the background image covers the entire container */
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;