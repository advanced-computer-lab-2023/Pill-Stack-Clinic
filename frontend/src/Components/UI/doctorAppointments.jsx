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
} from '@chakra-ui/react';
import axios from 'axios';

export const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all appointments when the component mounts
    async function fetchAppointments() {
      try {
        const response = await axios.post("http://localhost:8000/doctor/allApp",{}, {
          withCredentials: true
        });
        console.log("DAREEEEEENN")
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchAppointments();
  }, []);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Appointment Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={2}>
                <Spinner size="lg" />
              </Td>
            </Tr>
          ) : appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{appointment.PatientName}</Td>
                <Td>{appointment.StartDate}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2}>No appointments found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};


export default ViewAppointments;