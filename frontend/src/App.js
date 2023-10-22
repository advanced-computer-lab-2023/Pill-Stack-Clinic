import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";
import  AdminHome from "./Components/Pages/AdminHome";
import  AdminPacks from "./Components/Pages/AdminPacks";


function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
         <Route path="/admin-home" element={<AdminHome />} />
         <Route path="/admin-packs" element={<AdminPacks />} />
         
      </Routes>
    </div>
  );
}

export default App;
