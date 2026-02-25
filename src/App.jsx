import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './css/Theme';
// import { PinProvider } from './helper/PinComponents'; // Import the provider

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
// import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./components/Wrapper";
import Profile from "./pages/Profile";
import ReportForm from "./components/ReportForm";
import Test from "./pages/Test";
import History from "./pages/History";
import LocalStorage from './components/LocalStorage'
import Status from "./components/Status";
// import Sample from "./components/Sample";
import Pin from "./components/Pin";
import Register from "./pages/Register";
import Notification from "./components/Notification";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Register />} />

          {/* Register */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/register" element={<Register />} />

          {/* Login */}
          {/* <Route path="/login" element={<Login />} /> */}

          {/* Test page */}
          <Route path="/test" element={<Test />} />

          {/* Status */}
          {/* <Route path="/sample" element={<Sample />} /> */}

          {/* Pin */}
          <Route path="/pin" element={<Pin />} />

          {/* Dashboard with nested routes */}
          <Route path="/dashboard" element={
            <Wrapper>
              <Dashboard />
            </Wrapper>
          }
          >
          </Route>

          {/* Profile */}
          <Route path="/profile" element={
            <Wrapper>
              <Profile />
            </Wrapper>
          }
          ></Route>

          {/* Report form */}
          <Route path="/report" element={
            <Wrapper>
              <ReportForm />
            </Wrapper>
          }
          ></Route>


          {/* History */}
          <Route path="/history" element={
            <Wrapper>
              <History />
            </Wrapper>
          }
          ></Route>

          {/* Local storage testing */}
          <Route path="/local" element={
            <Wrapper>
              <LocalStorage />
            </Wrapper>
          }
          ></Route>

          {/* Status */}
          <Route path="/status/:pinId" element={
            <Wrapper>
              <Status />
            </Wrapper>
          } ></Route>

          {/* Notification */}
          <Route path="/notification" element={
            <Wrapper>
              <Notification />
            </Wrapper>
          } ></Route>



        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

