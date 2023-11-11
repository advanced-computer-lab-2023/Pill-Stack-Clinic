import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

import axios from 'axios';

export const BookAppointments = () => {
  const navigate = useNavigate();
  const [doctors, setDoctor] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [time, setTime] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(doctors);
  const [appointmentsNotFound, setAppointmentsNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [linkedFamilyMembers, setLinkedFamilyMembers] = useState([]);
  const [isLoadingFamilyMembers, setIsLoadingFamilyMembers] = useState(false);
  const [selectedDoctorUsername, setSelectedDoctorUsername] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [isError, setIsError] = useState(false);
  const [amount, setAmount] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');




  

  useEffect(() => {
    async function fetchAppointments() {
      try {
        // Fetch all appointments
        const response = await axios.get(
          "http://localhost:8000/patient/bookAppointments",
          { withCredentials: true }
        );
        setDoctor(response.data);
        setFilteredAppointments(response.data)
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);
  const refreshAppointments = async () => {
    try {
      // Fetch all appointments
      const response = await axios.get(
        "http://localhost:8000/patient/bookAppointments",
        { withCredentials: true }
      );
      setDoctor(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  const handleSearch = async () => {
    const response = await axios.post(
      "http://localhost:8000/patient/searchDoctors",{name:searchName,speciality:speciality,startDate:startDate,endDate:endDate
    },
      { withCredentials: true }
    );
    setFilteredAppointments(response.data);
    setAppointmentsNotFound(filteredAppointments.length === 0);
    
  };

  const getAmount= async (selectedPatientValue) => {
    const response = await axios.post(
      "http://localhost:8000/patient/getAmount",{doctor:selectedDoctorUsername},
      { withCredentials: true }
    );
    console.log(response.data.userPrice);
    const userPrice=response.data.userPrice;
    const familyPrice=response.data.familyPrice
    if(selectedPatientValue==='accountOwner'){
      console.log('accountOwner');

      setAmount(userPrice);

    }else{
      console.log('fam');

      setAmount(familyPrice);
    }
    
  };
   
  const handleViewAllAppointments = () => {
    // Clear search results to display all appointments
    setFilteredAppointments(doctors);
    setAppointmentsNotFound(false);
  };

  const openModal = async (doctorUsername, appointmentId) => {
    setSelectedDoctorUsername(doctorUsername);
  setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
    setConfirmationMessage('');
    setErrorMessage('');


       // Fetch family members for the dropdown
       try {
        setIsLoadingFamilyMembers(true);
        const response = await axios.get(
          'http://localhost:8000/patient/viewFamily',
          { withCredentials: true }
        );
        const added=response.data.added;
        const linked=response.data.linkedAccounts;
        console.log(linked)
        var results=[];
        added.forEach((mem)=>{
         results.push(mem.MemberName);
        });
        linked.forEach((mem)=>{
          results.push(mem.Name);
         });
        
        console.log(results);
        setLinkedFamilyMembers(linked);
        setFamilyMembers(results);
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setIsLoadingFamilyMembers(false);
      }
  };
  const handlePay = async (doctorUsername, appointmentId) => {
    if(selectedPatient==='' || selectedPayment===''){

      setIsError(true);

  }else{
    if(selectedPatient==='accountOwner'){
      if(selectedPayment==='wallet'){
        console.log(selectedAppointmentId)
        const response = await axios.post(
          "http://localhost:8000/patient/payWallet",{amount:amount,doctorUsername:selectedDoctorUsername,appid:selectedAppointmentId},
          { withCredentials: true }
        );
        const finalMessage=response.data;
        if(finalMessage==='Appointment booked successfully'){
          setIsModalOpen(false); // Close the modal
          refreshAppointments();
          setConfirmationMessage('Payment successful');
        } else {
          // Handle the case when the payment was not successful
          // You can display an error message or take appropriate action
          setIsModalOpen(false); // Close the modal

          setErrorMessage('Payment failed. Not enough credit in wallet.');
        }
        console.log(response.data);
      }else{
        const memberID='undefined';
        const manualMem='undefined';
          navigate(`/home/payAppointment/${selectedDoctorUsername}/${selectedAppointmentId}/${amount}/${memberID}/${manualMem}`);

      }
    }else{
      //check if linked account
      var memberID='';
      linkedFamilyMembers.forEach((member)=>{
        if(member.Name===selectedPatient){
          memberID=member._id;
        }
      })   
      if(selectedPayment==='wallet'){
        var response;
        if(memberID!==''){
          response = await axios.post(
            "http://localhost:8000/patient/payWallet",{amount:amount,member:memberID,doctorUsername:selectedDoctorUsername,appid:selectedAppointmentId},
            { withCredentials: true }
          );
        }else{
          response = await axios.post(
            "http://localhost:8000/patient/payWallet",{amount:amount,manualMem:selectedPatient,doctorUsername:selectedDoctorUsername,appid:selectedAppointmentId},
            { withCredentials: true }
          );
        }
        const finalMessage=response.data;
        if(finalMessage==='Appointment booked successfully'){
          setIsModalOpen(false); // Close the modal
          refreshAppointments();
          setConfirmationMessage('Payment successful');
        } else {
          setIsModalOpen(false); // Close the modal
          setErrorMessage('Payment failed. Not enough credit in wallet.');
        }
        console.log(response.data);
      }else{
        if(memberID!==''){
          const manualMem='undefined';
          navigate(`/home/payAppointment/${selectedDoctorUsername}/${selectedAppointmentId}/${amount}/${memberID}/${manualMem}`);
        }else{
          const memberID='undefined';
          navigate(`/home/payAppointment/${selectedDoctorUsername}/${selectedAppointmentId}/${amount}/${memberID}/${selectedPatient}`);
        }
      }
    }

    }
  };
  

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
       {confirmationMessage && (
      <Alert status="success">
        <AlertIcon />
        <AlertTitle>Confirmation</AlertTitle>
        <AlertDescription>{confirmationMessage}</AlertDescription>
      </Alert>
    )}
     {errorMessage && (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    )}
    
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Flex direction={{ base: 'column', md: 'row' }} spacing={4}>
        <FormControl>
            <FormLabel>Search by Name or Speciality</FormLabel>
            <Input
              placeholder="Enter name or speciality"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </FormControl>
        <FormControl>
            <FormLabel>Select Speciality</FormLabel>
            <Select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            >
              <option value="">All</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurology">Neurology</option>
              <option value="Internal medicine">Internal medicine</option>
              <option value="Death">Death</option>
              <option value="Plastic Surgery">Plastic Surgery</option>
              <option value="Nervous System">Nervous System</option>
              <option value="ENT">ENT</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>

<FormControl>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
       
        </Flex>
        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" type="submit">
            Search
          </Button>
          <Button colorScheme="teal" onClick={handleViewAllAppointments}>
            View All Appointments
          </Button>
        </HStack>
      </form>

      {appointmentsNotFound && (
        <Box mt={4}>
          <p>No appointments found matching the criteria.</p>
        </Box>
      )}

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
          <Th>Doctor Name</Th>
          <Th>Speciality</Th>
            <Th>Appointment Start Time</Th>
            <Th>Appointment End Time</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
  {filteredAppointments.length > 0 ? (
    filteredAppointments.map((doctor, index) => (
      doctor.Availability.map((appointment, appIndex) => (
        <Tr key={index + '-' + appIndex}>
          <Td>{doctor.Name}</Td>
          <Td>{doctor.Speciality}</Td>
          <Td>{new Date(appointment.StartDate).toLocaleString('en-US',{ timeZone: 'UTC'})}</Td>
          <Td>{new Date(appointment.EndDate).toLocaleString('en-US',{ timeZone: 'UTC'})}</Td>
          <Td>
          <Button colorScheme="teal" onClick={() => openModal(doctor.Username, appointment._id)}>

              Book
            </Button>
          </Td>
        </Tr>
      ))
    ))
  ) : (
    <Tr>
      <Td colSpan="5">No appointments found matching the criteria.</Td>
    </Tr>
  )}
</Tbody>

      </Table>
      <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false);
       setSelectedPatient('');
       setSelectedPayment('');
       setAmount('');
       setIsError(false);
      }}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Select Payment Option</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
    {isError &&(<Alert status='error'>
  <AlertIcon />
  <AlertTitle>Missing information</AlertTitle>
  <AlertDescription>Please select a patient and a payment method.</AlertDescription>
</Alert>)}
{selectedPatient  && (
    <Alert status='info'>
      <AlertIcon />
      <AlertTitle>Session Amount</AlertTitle>
      <AlertDescription>{amount}</AlertDescription>
    </Alert>
  )}
     
      <FormControl>
        <FormLabel>Select patient</FormLabel>
        <Select
    value={selectedPatient}
    onChange={(e) => {setSelectedPatient(e.target.value);

      getAmount(e.target.value); 
    }
  }
  >
    <option value="">Select</option>

    <option value="accountOwner">Myself</option>

    {isLoadingFamilyMembers ? (
      <option>Loading family members...</option>
    ) : (
      
      familyMembers.map((familyMember) => (
        <option key={familyMember} value={familyMember}>
          {familyMember}
        </option>
      ))
    )}
  </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Select Payment Method</FormLabel>
        <Select
          value={selectedPayment}
          onChange={(e) => {setSelectedPayment(e.target.value);
            
            }}
          
        >
          <option value="">Select payment</option>
          <option value="wallet">Wallet</option>
          <option value="credit">Credit</option>
          {/* Add more options as needed */}
        </Select>
      </FormControl>
      
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="teal" onClick={()=>handlePay(selectedDoctorUsername, selectedAppointmentId)}>
        Pay
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
        
  );
};

export default BookAppointments;
