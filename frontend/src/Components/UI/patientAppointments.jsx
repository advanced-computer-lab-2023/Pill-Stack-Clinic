import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  Button,
  FormControl,
} from '@chakra-ui/react';
import axios from 'axios';

const AppointmentSearchAndTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState(appointments); // Initialize with all appointments
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function fetchAppointments() {
      try {
        // Fetch all appointments
        const response = await axios.post("http://localhost:8000/patient/allApp", {}, {
          withCredentials: true
        });
        setAppointments(response.data);
        setFilteredAppointments(response.data); // Initialize filteredAppointments with all appointments
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments based on selectedStatus and selectedDate
    const filtered = appointments.filter((appointment) => {
      const statusMatches = selectedStatus === 'All' || appointment.Status === selectedStatus;
      const dateMatches =
        selectedDate === '' || appointment.StartDate.includes(selectedDate);
      return statusMatches && dateMatches;
    });
    setFilteredAppointments(filtered);
  }, [selectedStatus, selectedDate, appointments]);


  

  const handleClear = () => {
    // Clear the date and reset the filter
    setSelectedDate('');
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <FormControl mb={4}>
        <Select
          placeholder="Filter by Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          size="sm" // Smaller size
          fontSize="sm" // Smaller font size
        >
          <option value="All">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
          {/* Add other status options as needed */}
        </Select>
        <Input
          type="date"
          placeholder="Filter by Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          size="sm" // Smaller size
          fontSize="sm" // Smaller font size
          mb={2}
        />

        <Button colorScheme="teal" onClick={handleClear} size="sm" fontSize="sm">
          Clear
        </Button>
      </FormControl>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Appointment Date</Th>
            <Th>Appointment Status</Th>
            <Th>Doctor Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAppointments.map((appointment, index) => (
            <Tr key={index}>
              <Td>{new Date(appointment.StartDate).toLocaleString('en-US',{ timeZone: 'UTC'})}</Td>
              <Td>{appointment.Status}</Td>
              <Td>{appointment.DoctorName}</Td>
             
              <Td>
                {/* Add actions as needed */}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AppointmentSearchAndTable;