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
import MyHealthRecords from './Components/Pages/HealthRecords.jsx';
import Packages from "./Components/Pages/Packages.jsx";
import PayPackage from "./Components/Pages/payPackage.jsx";
import PackCompletion from "./Components/Pages/PackCompletion.jsx"
import PatientRegisterForm from './Components/Pages/PatientRegisterForm';
import DoctorRegisterPage from "./Components/Pages/DoctorRegisterPage";
import FollowUpRegisterForm from './Components/Pages/FollowUpRegisterForm.jsx';
import RequestFollowUp from './Components/Pages/RequestFollowUp.jsx';
///Pharmacy add ons
import PharmacistRegisterPage from './Components/Pages/PharmacistRegisterPage';
import{MedicineList} from "./Components/UI/MedicineList";
import {Cart} from "./Components/Pages/Cart";
import  CompletionMed from "./Components/Pages/CompletionMedPayment.jsx";
import  CreditPayment from "./Components/Pages/CreditPaymentMed.jsx";
import OrderDetails from './Components/UI/orderDetails';
import PharmacistReqs from "./Components/Pages/PharmacistReqs";
import PharmaHome from "./Components/Pages/PharmaHome";
import{MedicineListControl} from "./Components/UI/MedicineListAdminPharma";
import{MedicineListwithSales} from "./Components/UI/MedicineListWithSales";
import {AddMedicine} from "./Components/UI/AddMed";
import ManagePrescriptions from "./Components/Pages/ManagePrescriptions.jsx";





function App() {
  
  const loginIns = ["Username", "Password"];

  return (
    <div >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/doctor-home" element={<Doctor />} />
        <Route path="/pharma-home" element={<PharmaHome />} />
        <Route path="/Unsigned-doctor-home" element={<UnsignedDoctor />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-home/admin-packs" element={<AdminPacks />} />
        <Route path="/admin-home/admin-users" element={<UserManagement/>} />
        <Route path="home/bookAppointments" element={<BookAppointments/>} />
        <Route path="home/familyAppointments" element={<FamilyAppointments/>} />
        <Route path="home/payAppointment/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<PayAppointments/>} />
        <Route path="/completion/:doctorUsername/:appointmentId/:amount/:memberID/:manualMem" element={<Completion/>} />
        <Route path="/completion/:username/:packID" element={<PackCompletion />} />
        <Route path="/home/viewPackages/:username" element={<Packages/>}/>
        <Route path="/home/payPack/:username/:packID" element={<PayPackage />}/>
        <Route path="/admin-home/admin-requests" element={ <DocReqs/>} />
        <Route path="home/viewDoctors" element={<DoctorList/>} />
        <Route path="home/apptsP" element={<AppointmentSearchAndTable/>} />
        <Route path="home/prescriptions" element={<PrescriptionViewer/>} />
        <Route path="doctor-home/myAvailability" element={<ViewAvailability/>} />  
        <Route path="doctor-home/apptsD" element={<ViewAppointments/>} />
        <Route path="doctor-home/myPatients" element={<DoctorPatientsTable/>} />  
        <Route path="Unsigned-doctor-home/contract" element={<DoctorContract/>} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/PasswordReset" element={<PasswordReset/>} />
        <Route path="/my-health-records/:patientUsername/:patientName" element={<HealthRecords />} />
        <Route path="/my-health-records/:patientUsername" element={<MyHealthRecords />} />
        <Route path="/patient-register" element={<PatientRegisterForm />} />
        <Route path="/doctor-register" element={<DoctorRegisterPage />} />
        {/* /doctor/prescriptions/${patient._id} */}
        <Route path="/doctor/prescriptions/:patientUser" element={<ManagePrescriptions/>} />
        <Route path="/follow-up-request" element={<FollowUpRegisterForm />} />
        <Route path="/follow-up-request2" element={<RequestFollowUp />} />

        {/* pharmacy */}
        <Route path="/pharmacist-register" element={<PharmacistRegisterPage />} />
        <Route path="/admin-home/pharmaRequests" element={<PharmacistReqs />} />
        <Route path="/medicine" element={<MedicineList />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/home/creditPayment/:address" element={<CreditPayment />} />
        <Route path="/Medcompletion/:address/:intentid" element={<CompletionMed />} />
        <Route path="/orderdetails" element={<OrderDetails/>} />
        <Route path="/medicineControl" element={<MedicineListControl/>} />
        <Route path="/medicine/sales" element={<MedicineListwithSales />} />
        <Route path="/addMed" element={<AddMedicine />} />


      </Routes>
    </div>
  );
}

export default App;
