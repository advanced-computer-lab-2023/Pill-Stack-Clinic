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

export const AppointmentSearchAndTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('null');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [appointmentsNotFound, setAppointmentsNotFound] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        // Fetch all appointments
        const response = await axios.post(
          "http://localhost:8000/patient/allApp",{},
          { withCredentials: true }
        );
        console.log(response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);

  const handleSearch = async () => {
    try {
      // Send a POST request to search appointments
      const response = await axios.post("http://localhost:8000/patient/search", {
        status: status,
        sDate: startDate,
        eDate: endDate,
      },{ withCredentials: true });

      if (response.data.length === 0) {
        setAppointmentsNotFound(true);
      } else {
        setAppointmentsNotFound(false);
      }
       console.log(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error searching appointments:', error);
    }
  };

  const handleViewAllAppointments = () => {
    // Clear search results to display all appointments
    setFilteredAppointments([]);
    setAppointmentsNotFound(false);
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
              <option value="upcoming">upcoming</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
              <option value="rescheduled">rescheduled</option>
              {/* Add other status options as needed */}
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
          <Th>Appointment Doctor Name</Th>
            <Th>Appointment Start Time</Th>
            <Th>Appointment End Time</Th>
            <Th>Appointment Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{appointment.DoctorName}</Td>
                <Td>{appointment.StartDate}</Td>
                <Td>{appointment.EndDate}</Td>
                <Td>{appointment.Status}</Td>
                <Td>
                  {/* Add actions as needed */}
                </Td>
              </Tr>
            ))
          ) : (
            appointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{appointment.DoctorName}</Td>
                <Td>{appointment.StartDate}</Td>
                <Td>{appointment.EndDate}</Td>
                <Td>{appointment.Status}</Td>
                <Td>
                  {/* Add actions as needed */}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AppointmentSearchAndTable;
