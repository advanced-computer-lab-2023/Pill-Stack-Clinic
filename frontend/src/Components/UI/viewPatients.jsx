import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Thead,
  Tbody,
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
} from "@chakra-ui/react";

const DoctorPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHealthRecord, setPatientHealthRecord] = useState(null);

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

  const openPatientDetails = async (patient) => {
    setSelectedPatient(patient);

    // Fetch the patient's health record based on their username
    try {
      const response = await axios.get(`http://localhost:8000/doctor/healthRecord/${patient.PatientUsername}`, {
        withCredentials: true,
      });

      setPatientHealthRecord(response.data);
    } catch (error) {
      console.error('Error fetching patient health record:', error);
      setPatientHealthRecord(null);
    }
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
    setPatientHealthRecord(null);
  };

  return (
    <Container maxW="container.xl">
      <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
        <h1>My Patients</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
          <option value="rescheduled">rescheduled</option>
        </select>
        <Input
          type="text"
          placeholder="Search by Patient Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Patient Name</Th>
              <Th>Status</Th>
              <Th>Start Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {patients.map((patient, index) => (
              <Tr key={index}>
                <Td>{patient.PatientName}</Td>
                <Td>{patient.Status}</Td>
                <Td>{patient.StartDate}</Td>
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
                      {patientHealthRecord && (
                        <Box mt={4}>
                          <h2>Health Record</h2>
                          <p>Patient Username: {patientHealthRecord.PatientUsername}</p>
                          <p>Record Date: {patientHealthRecord.RecordDate}</p>
                          <p>Record Details: {patientHealthRecord.RecordDetails}</p>
                        </Box>
                      )}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default DoctorPatientsTable;
