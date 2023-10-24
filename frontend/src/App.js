import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";
import  AdminHome from "./Components/Pages/AdminHome";
import  AdminPacks from "./Components/Pages/AdminPacks";
import UserManagement from './Components/Pages/UserManagement';
import DocReqs from './Components/Pages/DocReqs';
import  Appointments from "./Components/Pages/Appointments";
import  Completion from "./Components/Pages/Completion.js";

function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-packs" element={<AdminPacks />} />
        <Route path="/admin-users" element={<UserManagement/>} />
        <Route path="home/appointments" element={<Appointments/>} />
        <Route path="/completion" element={<Completion/>} />
        <Route path="/admin-requests" element={ <DocReqs/>} />
     
      </Routes>
    </div>
  );
}

export default App;
