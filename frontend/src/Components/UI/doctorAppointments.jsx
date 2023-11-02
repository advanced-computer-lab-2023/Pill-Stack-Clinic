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
import axios from 'axios';

export const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fetch all appointments when the component mounts
    async function fetchAppointments() {
      try {
        const response = await axios.post("http://localhost:8000/doctor/allApp", {}, {
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
      const statusMatches = selectedStatus === 'All' || appointment.Status === selectedStatus;
      const dateMatches = selectedDate === '' || appointment.StartDate.includes(selectedDate);
      return statusMatches && dateMatches;
    });
    setFilteredAppointments(filtered);
  }, [selectedStatus, selectedDate, appointments]);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <FormControl mb={4}>
        <Select
          placeholder="Filter by Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          size="sm"
          fontSize="sm"
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
          size="sm"
          fontSize="sm"
          mb={2}
        />
      </FormControl>

      <Table variant="striped"shadow="md">
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Appointment Date</Th>
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
                <Td>{appointment.PatientName}</Td>
                <Td>{appointment.StartDate}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign="center">No appointments found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ViewAppointments;
