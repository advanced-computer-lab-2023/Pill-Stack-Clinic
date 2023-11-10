import React from 'react';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import MyForm from './Components/UI/MyForm.js';
import { Box , Flex,  Button, ButtonGroup } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import { Login, Home} from "./Components/Pages";
import { Doctor} from './Components/Pages/Doctor.jsx';
import { UnsignedDoctor} from './Components/Pages/DoctorUnsigned.jsx';
import  AdminHome from "./Components/Pages/AdminHome";
import  AdminPacks from "./Components/Pages/AdminPacks";
import UserManagement from './Components/Pages/UserManagement';
import DocReqs from './Components/Pages/DocReqs';
import  PayAppointments from "./Components/Pages/PayAppointments.jsx";
import  Completion from "./Components/Pages/Completion";
import BookAppointments from "./Components/UI/bookAppointments.jsx";
import DoctorList from "./Components/UI/viewDoctors.jsx";
import AppointmentSearchAndTable from "./Components/UI/patientAppointments.jsx";
import PrescriptionViewer from "./Components/UI/patientPrescriptions.jsx";
import ViewAppointments from "./Components/UI/doctorAppointments.jsx";
import DoctorPatientsTable from "./Components/UI/viewPatients.jsx";
import FamilyAppointments from "./Components/UI/FamilyAppointment.jsx";
import ViewAvailability from "./Components/UI/doctorAvailability.jsx";
import ForgotPassword from './Components/Pages/ForgotPassword.jsx';
import PasswordReset from './Components/Pages/PasswordReset.jsx';
import DoctorContract from './Components/Pages/doctorContract.jsx';
import HealthRecords from './Components/Pages/MyHealthRecords.jsx';
import Packages from "./Components/Pages/Packages.jsx";
import PayPackage from "./Components/Pages/payPackage.jsx";
import PackCompletion from "./Components/Pages/PackCompletion.jsx"
import PatientRegisterForm from './Components/Pages/PatientRegisterForm';
function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/doctor-home" element={<Doctor />} />
        <Route path="/Unsigned-doctor-home" element={<UnsignedDoctor />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="admin-home/admin-packs" element={<AdminPacks />} />
        <Route path="admin-home/admin-users" element={<UserManagement/>} />
        <Route path="home/bookAppointments" element={<BookAppointments/>} />
        <Route path="home/familyAppointments" element={<FamilyAppointments/>} />
        <Route path="home/payAppointment/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<PayAppointments/>} />
        <Route path="/completion/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<Completion/>} />
        <Route path="/completion/:username/:packID" element={<PackCompletion />} />
        <Route path="/home/viewPackages/:username" element={<Packages/>}/>
        <Route path="/home/payPack/:username/:packID" element={<PayPackage />}/>
        <Route path="admin-home/admin-requests" element={ <DocReqs/>} />
        <Route path="home/viewDoctors" element={<DoctorList/>} />
        <Route path="home/apptsP" element={<AppointmentSearchAndTable/>} />
        <Route path="home/prescriptions" element={<PrescriptionViewer/>} />
        <Route path="doctor-home/myAvailability" element={<ViewAvailability/>} />  
        <Route path="doctor-home/apptsD" element={<ViewAppointments/>} />
        <Route path="doctor-home/myPatients" element={<DoctorPatientsTable/>} />  
        <Route path="Unsigned-doctor-home/contract" element={<DoctorContract/>} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/PasswordReset" element={<PasswordReset/>} />
        <Route path="/my-health-records/:Username" element={<HealthRecords />} />
        <Route path="/patient-register" element={<PatientRegisterForm />} />

      </Routes>
    </div>
  );
}

export default App;
