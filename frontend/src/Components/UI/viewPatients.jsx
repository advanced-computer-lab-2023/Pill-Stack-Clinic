import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Box,
  Container,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DoctorPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newRecordInput, setNewRecordInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [followUpPatient, setFollowUpPatient] = useState('');
  const [availability, setAvailability] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get('http://localhost:8000/doctor/myPatients', {
          withCredentials: true,
        });

        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const statusMatches = statusFilter === 'All' || patient.Status === statusFilter;
    const nameMatches = patient.PatientName && patient.PatientName.toLowerCase().includes(searchInput.toLowerCase());
    const dateMatches = (
      startDate === null ||
      endDate === null ||
      (new Date(patient.StartDate) >= startDate && new Date(patient.StartDate) <= endDate)
    );

    return statusMatches && nameMatches && dateMatches;
  });

  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
  };

  const openModal = async (patient) => {
    setIsModalOpen(true);
    setConfirmationMessage('');
    setErrorMessage('');
    setFollowUpPatient(patient);

    try {
      setIsLoadingAvailability(true);
      const response = await axios.get(
        'http://localhost:8000/doctor/availability',
        { withCredentials: true }
      );
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const scheduleFollowUp = async () => {
    if (appointment !== null) {
      const response = await axios.post('http://localhost:8000/doctor/scheduleFollowUp', { oldAppointment: followUpPatient, newAppointment: appointment }, {
        withCredentials: true,
      });

      if (response.data === 'follow up booked successfully') {
        setConfirmationMessage(response.data);
        setIsModalOpen(false);
      } else {
        setIsError(true);
        setErrorMessage(response.data);
      }
    } else {
      setIsError(true);
      setErrorMessage('Please select an appointment');
    }
  };

  const addHealthRecord = async (patient) => {
    try {
      const response = await axios.post('http://localhost:8000/doctor/addHealthRecord', {
        PatientUsername: patient.PatientUsername,
        PatientName: patient.PatientName,
        RecordDetails: newRecordInput,
      },
        { withCredentials: true });

      if (response.status === 201) {
        alert('Health record added successfully!');
      } else {
        alert('Failed to add health record. Please try again.');
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      alert('Failed to add health record. Please try again.');
    }
  };

  return (
    <Container maxW="container.xl">
      <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
        {confirmationMessage && (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Confirmation</AlertTitle>
            <AlertDescription>{confirmationMessage}</AlertDescription>
          </Alert>
        )}
        <h1>My Patients</h1>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
          <option value="rescheduled">rescheduled</option>
        </Select>
        <Input
          type="text"
          placeholder="Search by Patient Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Text fontSize="md" mb="2">Filter by Date Range:</Text>
        <Flex justifyContent="space-between" mb="4">
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select Start Date"
              dateFormat="MMMM d, yyyy"
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select End Date"
              dateFormat="MMMM d, yyyy"
            />
          </FormControl>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Patient Name</Th>
              <Th>Status</Th>
              <Th>Start Date</Th>
              <Th> </Th>
              <Th> </Th>
              <Th> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.map((patient, index) => (
              <Tr key={index}>
                <Td>{patient.PatientName}</Td>
                <Td>{patient.Status}</Td>
                <Td>{new Date(patient.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => openPatientDetails(patient)}
                      >
                        View Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Patient Details</PopoverHeader>
                      <PopoverBody>
                        <p>Patient username: {patient.PatientUsername}</p>
                        <p>Patient Name: {patient.PatientName}</p>
                        <p>Status: {patient.Status}</p>
                        <p>Start Date: {patient.StartDate}</p>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => openPatientDetails(patient)}
                      >
                        Add Health Record
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Health Record</PopoverHeader>
                      <PopoverBody>
                        <Input
                          type="text"
                          placeholder='Input Record Here'
                          value={newRecordInput}
                          onChange={(e) => setNewRecordInput(e.target.value)}
                        />
                        <Button
                          marginTop="10px"
                          size="sm"
                          alignSelf="end"
                          onClick={() => addHealthRecord(patient)}
                        >
                          Save
                        </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => openModal(patient)}
                  >
                    Schedule a follow up
                  </Button>
                </Td>
                <Td>
                  <Link to={`/my-health-records/${patient.PatientUsername}/${patient.PatientName}`}>
                    <Button size="sm" colorScheme="teal">
                      View Health Records
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Modal isOpen={isModalOpen} onClose={() => {
          setIsModalOpen(false);
          setFollowUpPatient('');
          setIsError(false);
          setErrorMessage('');
        }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Appointment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isError && (<Alert status='error'>
                <AlertIcon />
                <AlertTitle>Missing input</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>)}
              <FormControl>
                <FormLabel>Select appointment</FormLabel>
                <Select
                  value={appointment}
                  onChange={(e) => {
                    setAppointment(e.target.value);
                  }
                  }
                >
                  <option value="">Select</option>
                  {isLoadingAvailability ? (
                    <option>Loading Appointments..</option>
                  ) : (
                    availability.map((appointment) => (
                      <option key={appointment._id} value={appointment._id}>
                        {new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })} {new Date(appointment.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}
                      </option>
                    ))
                  )}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={() => scheduleFollowUp()}>
                Schedule
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default DoctorPatientsTable;
