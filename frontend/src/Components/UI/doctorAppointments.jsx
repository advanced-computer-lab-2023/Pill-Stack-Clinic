import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from '@chakra-ui/react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState({ status: 'all', date: 'all' });

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await axios.get(
          // Replace with your API endpoint for fetching doctor's appointments
          'http://localhost:8000/doctor/appointments',
          { withCredentials: true }
        );
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }

    fetchAppointments();
  }, []);

  // Filter appointments based on status and date
  const filteredAppointments = appointments.filter(appointment => {
    const statusFilter = filter.status;
    const dateFilter = filter.date;

    // Implement your filtering logic here based on status and date
    // For example, you can compare appointment dates for date filtering.

    return true; // Modify this condition based on your logic
  });

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <Select
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        mb={4}
      >
        <option value="all">All Appointments</option>
        <option value="upcoming">Upcoming Appointments</option>
          <option value="completed">completed Appointments</option>
          <option value="cancelled">cancelled Appointments</option>
          <option value="rescheduled">rescheduled Appointments</option>
      </Select>
      <Select
        value={filter.date}
        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        mb={4}
      >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="future">Future Dates</option>
        <option value="past">Past Dates</option>
      </Select>
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Appointment Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAppointments.map((appointment, index) => (
            <Tr key={index}>
              <Td>{appointment.PatientName}</Td>
              <Td>{appointment.AppointmentDate}</Td>
              <Td>
                {/* Add actions for filtered appointments */}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DoctorAppointments;
