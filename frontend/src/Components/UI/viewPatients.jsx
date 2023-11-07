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
  Button, // Import Button from Chakra UI
} from "@chakra-ui/react";

const DoctorPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // Initialize with 'All' to show all patients
  const [searchInput, setSearchInput] = useState(''); // State for the search input
  const [selectedPatient, setSelectedPatient] = useState(null); // State to store the selected patient
  const [newRecordInput, setNewRecordInput] = useState('');   

  useEffect(() => {
    async function fetchPatients() {
      try {
        // Make a GET request to the server to fetch patient data for the logged-in doctor
        const response = await axios.get('http://localhost:8000/doctor/myPatients', {
          withCredentials: true, // Include credentials if necessary
        });

        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchPatients();
  }, []);

  // Filter patients based on status and search input
  const filteredPatients = patients.filter(patient => {
    const statusMatches = statusFilter === 'All' || patient.Status === statusFilter;
    const nameMatches = patient.PatientName && patient.PatientName.toLowerCase().includes(searchInput.toLowerCase());
    return statusMatches && nameMatches;
  });

  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
  };

  const addHealthRecorda = async (patient) => {
    try {
      const response = await axios.post('http://localhost:8000/doctor/addHealthRecord', {
        PatientUsername: patient.PatientName, // Assuming you have a unique identifier for patients
        RecordDetails: newRecordInput,
      }
      ,
      { withCredentials: true });

      if (response.status === 201) {
        alert('Health record added successfully!');
        // Optionally, you can clear the input field or close the popover here.
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
            {filteredPatients.map((patient, index) => (
              <Tr key={index}>
                <Td>
                  {patient.PatientName}
                  
                </Td>
                <Td>{patient.Status}</Td>
                <Td>{patient.StartDate}</Td>
                <Td>
                <Popover>
                    <PopoverTrigger>
                      {/* Wrap "View Details" in a Chakra UI Button component */}
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
                      {/* Wrap "View Details" in a Chakra UI Button component */}
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
                        onClick={() => addHealthRecorda(patient)}
                      >
                        Save

                      </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default DoctorPatientsTable;