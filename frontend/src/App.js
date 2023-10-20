import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";


function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
