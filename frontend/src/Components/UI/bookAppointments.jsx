import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from "react-router-dom";

import '../UI/button.css'
import {
  Text,
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
import { MdClear } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import axios from 'axios';

export const BookAppointments = () => {
  const { doctorUsername} = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctor] = useState([]);
  const [searchName, setSearchName] = useState(doctorUsername);
 // const [speciality, setSpeciality] = useState('');
 const [selectedStartDate, setSelectedStartDate] = useState(null);
 const [selectedEndDate, setSelectedEndDate] = useState(null);
  const back =()=>  navigate(-1);
  const [time, setTime] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(doctors);
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
        // const response = await axios.get(
        //   "http://localhost:8000/patient/bookAppointments",
        //   { withCredentials: true }
        // );
        const response = await axios.get(
          `http://localhost:8000/patient/viewDoctorAppointments/${doctorUsername}`,
          { withCredentials: true }
        );
        setDoctor(response.data);
        setFilteredAppointments(response.data.Availability)
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);
  useEffect(() => {
    const filtered = doctors.Availability?.filter((appointment) => {
      const dateMatches =
        (selectedStartDate === null || new Date(appointment.StartDate) >= selectedStartDate) &&
        (selectedEndDate === null || new Date(appointment.StartDate) <= selectedEndDate);

      return dateMatches;
    });
    setFilteredAppointments(filtered);
  }, [ selectedStartDate, selectedEndDate, doctors]);
  const refreshAppointments = async () => {
    try {
      // Fetch all appointments
      const response = await axios.get(
        `http://localhost:8000/patient/viewDoctorAppointments/${doctorUsername}`,
        { withCredentials: true }
      );
      setDoctor(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  // const handleSearch = async () => {
  //   const response = await axios.post(
  //     "http://localhost:8000/patient/searchDoctors",{name:searchName,startDate:startDate,endDate:endDate
  //   },
  //     { withCredentials: true }
  //   );
  //   setFilteredAppointments(response.data);
    
  // };

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
  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

   
  const handleViewAllAppointments = () => {
    // Clear search results to display all appointments
    setFilteredAppointments(doctors);
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
    <><Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Book Appointment</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
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

<FormControl mb={4}>
        
          <Flex alignItems="center" mb={2}>
            <Text mr={2} fontSize="sm">Filter by Date:</Text>
            <DatePicker 
              selected={selectedStartDate} 
              onChange={(date) => setSelectedStartDate(date)} 
              showTimeSelect 
              timeFormat="HH:mm" 
              timeIntervals={15} 
              dateFormat="MMMM d, yyyy h:mm aa" 
              placeholderText="Start Date & Time" 
              size="sm" 
            />
  
            <Text mx={2} fontSize="sm">to</Text>
  
            <DatePicker 
              selected={selectedEndDate} 
              onChange={(date) => setSelectedEndDate(date)} 
              showTimeSelect 
              timeFormat="HH:mm" 
              timeIntervals={15} 
              dateFormat="MMMM d, yyyy h:mm aa" 
              placeholderText="End Date & Time" 
              size="sm" 
            />
          </Flex>
  
          <Button 
            colorScheme="teal" 
            onClick={handleClear} 
            size="sm" 
            fontSize="sm" 
            leftIcon={<MdClear />} 
            mt={2}
          >
            Clear Filters
          </Button>
        </FormControl>



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
            {filteredAppointments?.length > 0 ? (
                filteredAppointments.map((appointment, appIndex) => (
                  <Tr key={ appIndex}>
                    <Td>{doctors.Name}</Td>
                    <Td>{doctors.Speciality}</Td>
                    <Td>{new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                    <Td>{new Date(appointment.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                    <Td>
                      <Button colorScheme="teal" onClick={() => openModal(doctors.Username, appointment._id)}>

                        Book
                      </Button>
                    </Td>
                  </Tr>
                ))
            
            ) : (
              <Tr>
                <Td colSpan="5">Sorry for the inconvennince,Doctor {doctorUsername} does not have any available appointments.</Td>
              </Tr>
            )}
          </Tbody>

        </Table>
        <Modal isOpen={isModalOpen} onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient('');
          setSelectedPayment('');
          setAmount('');
          setIsError(false);
        } }>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Payment Option</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isError && (<Alert status='error'>
                <AlertIcon />
                <AlertTitle>Missing information</AlertTitle>
                <AlertDescription>Please select a patient and a payment method.</AlertDescription>
              </Alert>)}
              {selectedPatient && (
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
                  onChange={(e) => {
                    setSelectedPatient(e.target.value);

                    getAmount(e.target.value);
                  } }
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
                  onChange={(e) => {
                    setSelectedPayment(e.target.value);

                  } }

                >
                  <option value="">Select payment</option>
                  <option value="wallet">Wallet</option>
                  <option value="credit">Credit</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>

            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={() => handlePay(selectedDoctorUsername, selectedAppointmentId)}>
                Pay
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </Box></>
        
  );
};

export default BookAppointments;
