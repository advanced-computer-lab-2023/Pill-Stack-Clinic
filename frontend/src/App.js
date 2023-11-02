import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";
import { Doctor} from './Components/Pages/Doctor.jsx';
import  AdminHome from "./Components/Pages/AdminHome";
import  AdminPacks from "./Components/Pages/AdminPacks";
import UserManagement from './Components/Pages/UserManagement';
import DocReqs from './Components/Pages/DocReqs';
import  PayAppointments from "./Components/Pages/PayAppointments.jsx";
import  Completion from "./Components/Pages/Completion";
import BookAppointments from "./Components/UI/bookAppointments.jsx";
import DoctorSearchAndTable from "./Components/UI/viewDoctors.jsx";
import AppointmentSearchAndTable from "./Components/UI/patientAppointments.jsx";
import PrescriptionViewer from "./Components/UI/patientPrescriptions.jsx";
import ViewAppointments from "./Components/UI/doctorAppointments.jsx";
import DoctorPatientsTable from "./Components/UI/viewPatients.jsx";
import FamilyAppointments from "./Components/UI/FamilyAppointment.jsx";

function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/doctor-home" element={<Doctor />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-packs" element={<AdminPacks />} />
        <Route path="/admin-users" element={<UserManagement/>} />
        <Route path="home/bookAppointments" element={<BookAppointments/>} />
        <Route path="home/familyAppointments" element={<FamilyAppointments/>} />
        <Route path="home/payAppointment/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<PayAppointments/>} />
        <Route path="/completion/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<Completion/>} />
        <Route path="/admin-requests" element={ <DocReqs/>} />
        <Route path="home/viewDoctors" element={<DoctorSearchAndTable/>} />
        <Route path="home/apptsP" element={<AppointmentSearchAndTable/>} />
        <Route path="home/prescriptions" element={<PrescriptionViewer/>} />
        <Route path="doctor-home/apptsD" element={<ViewAppointments/>} />
        <Route path="doctor-home/myPatients" element={<DoctorPatientsTable/>} />  
      </Routes>
    </div>
  );
}

export default App;
