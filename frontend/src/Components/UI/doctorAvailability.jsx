import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Select,
  Input,
  Button,
  FormControl,
} from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react';

import axios from 'axios';

export const ViewAvailability = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isSuccess, setIsSucess] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    Date: '',
    startTime: '',
    endTime: '',
  });


  useEffect(() => {
    // Fetch all appointments when the component mounts
    async function fetchAppointments() {
      try {
        const response = await axios.get("http://localhost:8000/doctor/availability", {
          withCredentials: true
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }

    fetchAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments based on selectedStatus and selectedDate
    const filtered = appointments.filter((appointment) => {
    
      const dateMatches = selectedDate === '' || appointment.StartDate.includes(selectedDate);
      return dateMatches;
    });
    setFilteredAppointments(filtered);
  }, [ selectedDate, appointments]);
  const openModal = async () => {
    setIsModalOpen(true);
    setIsSucess(false);
  };
  const handleAdd=async()=>{
    try {
        const response = await axios.post("http://localhost:8000/doctor/availability",
        {date:newAppointment.Date,
        startTime:newAppointment.startTime,
        endTime:newAppointment.endTime,
    } ,{
          withCredentials: true
        });
        console.log(response.data.message);
        if(response.data.message==='Availability added successfully'){
            setIsModalOpen(false);
            setIsSucess(true);
            setAppointments([...appointments, response.data.data]);
            setIsError(false);
        }else{
            setIsError(true);
            setErrorMsg(response.data.message);
        }
       
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }

  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
         {isSuccess && (
      <Alert status="success">
        <AlertIcon />
        <AlertTitle>Confirmation</AlertTitle>
        <AlertDescription>Slot added successfully</AlertDescription>
      </Alert>
    )}
      <FormControl mb={4}>
  
        <Input
          type="date"
          placeholder="Filter by Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="sm"
          fontSize="sm"
          mb={2}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={() => openModal()}>

       Add Slot
      </Button>
      <Table variant="striped"shadow="md">
        <Thead>
          <Tr>
            <Th>Appointment start time </Th>
            <Th>Appointment end time</Th>

          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={2} textAlign="center">
                <Spinner size="lg" />
              </Td>
            </Tr>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <Tr key={index}>
          <Td>{new Date(appointment.StartDate).toLocaleString('en-US',{ timeZone: 'UTC'})}</Td>
          <Td>{new Date(appointment.EndDate).toLocaleString('en-US',{ timeZone: 'UTC'})}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center">No appointments found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setIsError(false);
    setNewAppointment({
        Date: '',
        startTime: '',
        endTime: '',
      });
    
    }}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Select Slot Time</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
    {isError &&(<Alert status='error'>
  <AlertIcon />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>{errorMsg} </AlertDescription>
</Alert>)}
           <label>Date:</label>

           <Input
              type="date"
              value={newAppointment.Date}
              onChange={(e) => setNewAppointment({ ...newAppointment, Date: e.target.value })}
            />
            <label>Start time</label>
            <Input
              type='time'
              value={newAppointment.startTime}
              onChange={(e) => setNewAppointment({ ...newAppointment, startTime: e.target.value })}
            />
            <label>End time</label>
            <Input
              type='time'
              value={newAppointment.endTime}
              onChange={(e) => setNewAppointment({ ...newAppointment, endTime: e.target.value })}
            />

    
      
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="teal" onClick={()=>handleAdd()}>
        Add
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>
  );
};

export default ViewAvailability;
