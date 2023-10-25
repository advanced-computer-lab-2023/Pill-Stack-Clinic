import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormLabel,
  Flex,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';

export const DoctorPatientsSearchAndTable = () => {
  const [patients, setPatients] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', or 'past'

  useEffect(() => {
    async function fetchPatients() {
      try {
        // Fetch all patients
        const response = await axios.get(
          "http://localhost:8000/doctor/myPatients",
          { withCredentials: true }
        );
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchPatients();
  }, []);

  const handleSearch = async () => {
    try {
      // Send a POST request to search for patients by name
      const response = await axios.post("http://localhost:8000/doctor/searchByName", {
        search: searchName,
      });

      setSearchedPatients(response.data);
    } catch (error) {
      console.error('Error searching patients by name:', error);
    }
  };
  const handleViewPatientDetails = async () => {
    try {
      // Send a GET request to view the details of a selected patient
      const response = await axios.get("http://localhost:8000/doctor/myPatients/viewPatient");
      // Handle the response, e.g., set the selected patient data in the state.
      console.log(response.data); // You can also set the data to the state or use it as needed.
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };
  const handleFilter = async (username) => {
    try {
      // Send a POST request to filter patients based on upcoming and past appointments
      const response = await axios.post(`http://localhost:8000/doctor/doctor-appointments/:username?username=${username}`, {
        filter,
      });

      setSearchedPatients(response.data);
    } catch (error) {
      console.error('Error filtering patients:', error);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Flex direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl>
            <FormLabel>Search by Patient Name</FormLabel>
            <Input
              placeholder="Enter patient name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </FormControl>
        </Flex>
        <Button colorScheme="teal" type="submit">
          Search
        </Button>
      </form>

      <FormControl>
        <FormLabel>Filter Patients</FormLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Patients</option>
          <option value="upcoming">Upcoming Appointments</option>
          <option value="past">Past Appointments</option>
        </Select>
      </FormControl>
      <Button colorScheme="teal" onClick={handleFilter}>
        Apply Filter
      </Button>

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {searchedPatients.length > 0 ? (
            searchedPatients.map((patient, index) => (
              <Tr key={index}>
                <Td>{patient.PatientName}</Td>
                <Td>
                  <Button colorScheme="teal" onClick={() => handleViewPatientDetails(patient.PatientUsername)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2}>No patients found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DoctorPatientsSearchAndTable;

