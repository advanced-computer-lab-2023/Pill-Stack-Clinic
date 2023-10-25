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
  Select,
  FormControl,
  FormLabel,
  Flex,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';

export const PrescriptionSearchAndTable = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [status, setStatus] = useState('null');
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState('null');
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionsNotFound, setPrescriptionsNotFound] = useState(false);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        // Fetch all prescriptions
        const response = await axios.get(
          "http://localhost:8000/user/viewPrescriptions",
          { withCredentials: true }
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    }
    fetchPrescriptions();
  }, []);

  const handleSearch = async () => {
    try {
      // Send a POST request to filter prescriptions
      const response = await axios.post("http://localhost:8000/user/filterPrescriptions", {
        prepStatus: status,
        prepDate: date,
        prepDr: doctor,
      });

      if (response.data.length === 0) {
        setPrescriptionsNotFound(true);
      } else {
        setPrescriptionsNotFound(false);
      }

      setFilteredPrescriptions(response.data);
      setSelectedPrescription(null); // Clear selected prescription
    } catch (error) {
      console.error('Error filtering prescriptions:', error);
    }
  };

  const handleViewAllPrescriptions = () => {
    // Clear search results to display all prescriptions
    setFilteredPrescriptions([]);
    setPrescriptionsNotFound(false);
    setSelectedPrescription(null); // Clear selected prescription
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Flex direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl>
            <FormLabel>Select Status</FormLabel>
            <Select
              placeholder="All Statuses"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="null">All</option>
              <option value="Filled">Filled</option>
              <option value="Unfilled">Unfilled</option>
              {/* Add other status options as needed */}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Select Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Select Doctor</FormLabel>
            <Select
              placeholder="All Doctors"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            >
              <option value="null">All</option>
              {/* Add doctor options as needed */}
            </Select>
          </FormControl>
        </Flex>
        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" type="submit">
            Search
          </Button>
          <Button colorScheme="teal" onClick={handleViewAllPrescriptions}>
            View All Prescriptions
          </Button>
        </HStack>
      </form>

      {prescriptionsNotFound && (
        <Box mt={4}>
          <p>No prescriptions found matching the criteria.</p>
        </Box>
      )}

      {selectedPrescription && (
        <Box mt={4}>
          <h2>Selected Prescription Details</h2>
          <p>Prescription Date: {selectedPrescription.PrescriptionDate}</p>
          <p>Doctor: {selectedPrescription.Doctor}</p>
          <p>Status: {selectedPrescription.Status}</p>
          {/* Add additional details as needed */}
        </Box>
      )}

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Prescription Date</Th>
            <Th>Doctor</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription, index) => (
              <Tr key={index}>
                <Td>{prescription.PrescriptionDate}</Td>
                <Td>{prescription.Doctor}</Td>
                <Td>{prescription.Status}</Td>
                <Td>
                  <Button colorScheme="teal" onClick={() => handleViewDetails(prescription)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            prescriptions.map((prescription, index) => (
              <Tr key={index}>
                <Td>{prescription.PrescriptionDate}</Td>
                <Td>{prescription.Doctor}</Td>
                <Td>{prescription.Status}</Td>
                <Td>
                  <Button colorScheme="teal" onClick={() => handleViewDetails(prescription)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PrescriptionSearchAndTable;